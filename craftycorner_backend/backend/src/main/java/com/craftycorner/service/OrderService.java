package com.craftycorner.service;

import com.craftycorner.dto.order.OrderDTO;
import com.craftycorner.dto.order.PlaceOrderRequest;
import com.craftycorner.model.*;
import com.craftycorner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final CartItemRepository cartItemRepository;
    private final NotificationService notificationService;
    private final AddressRepository addressRepository;
    private final VendorProfileRepository vendorProfileRepository;

    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return OrderDTO.fromEntity(orderRepository.save(order));
    }

    @Transactional
    public OrderDTO placeOrder(PlaceOrderRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(address);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cart.getItems()) {

            ProductVariant variant = productVariantRepository.findById(ci.getProductVariant().getId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            if (variant.getStockQuantity() != null && variant.getStockQuantity() < ci.getQuantity()) {
                throw new RuntimeException("Not enough stock for variant id " + variant.getId());
            }

            BigDecimal price = variant.getPrice();
            if (price == null) {
                throw new RuntimeException("Variant price missing for id " + variant.getId());
            }

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductVariant(variant);
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(price);
            oi.setTotalPrice(price.multiply(BigDecimal.valueOf(ci.getQuantity())));

            order.getItems().add(oi);
            total = total.add(oi.getTotalPrice());
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        Payment payment = Payment.builder()
                .order(savedOrder)
                .amount(total)
                .method(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        // clear cart
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);

        // send confirmation email
        String subject = "Order placed successfully: #" + savedOrder.getId();
        String body = "Hello " + user.getName() +
                ",\nYour order #" + savedOrder.getId() +
                " has been placed successfully!\nTotal: ₹" + savedOrder.getTotalAmount() +
                "\nWe’ll notify you once it’s confirmed.";

        notificationService.sendNotification(user.getEmail(), subject, body);

        return OrderDTO.fromEntity(savedOrder);
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderDTO.fromEntity(order);
    }

    public List<OrderDTO> getOrdersForVendor() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        List<Order> vendorOrders = orderRepository.findOrdersByVendorUserId(user.getId());

        return vendorOrders.stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
