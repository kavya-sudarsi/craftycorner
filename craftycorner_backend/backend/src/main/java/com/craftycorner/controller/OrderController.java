package com.craftycorner.controller;

import com.craftycorner.dto.order.OrderDTO;
import com.craftycorner.dto.order.PlaceOrderRequest;
import com.craftycorner.model.OrderStatus;
import com.craftycorner.repository.UserRepository;
import com.craftycorner.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    // Get all orders for a specific user
    @GetMapping("/my/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }

    // Admin - Get all orders
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Admin - Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // User - Place a new order
    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    // Get order by ID (used during payment)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // Vendor - Get their own orders
    @GetMapping("/vendor/my")
    public ResponseEntity<List<OrderDTO>> getVendorOrders() {
        return ResponseEntity.ok(orderService.getOrdersForVendor());
    }
}
