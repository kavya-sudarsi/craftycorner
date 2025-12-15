package com.craftycorner.service;

import com.craftycorner.dto.cart.CartDTO;
import com.craftycorner.dto.cart.CartItemDTO;
import com.craftycorner.model.*;
import com.craftycorner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    public CartDTO getCartByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return getCart(user.getId());
    }

    public CartDTO addToCartByEmail(String email, Long variantId, int quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        ProductVariant variant = findVariantSafely(variantId);

        CartItem cartItem = cartItemRepository.findByCartAndProductVariant(cart, variant)
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .productVariant(variant)
                        .quantity(0)
                        .build());

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        cartItemRepository.save(cartItem);

        return mapToDTO(cart);
    }

    public CartDTO removeFromCartByEmail(String email, Long cartItemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return removeFromCart(user.getId(), cartItemId);
    }

    public void clearCartByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        clearCart(user.getId());
    }

    private CartDTO getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        return mapToDTO(cart);
    }

    private CartDTO removeFromCart(Long userId, Long cartItemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteById(cartItemId);
        cartRepository.flush();

        Cart updatedCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after deletion"));

        return mapToDTO(updatedCart);
    }

    private void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cartItemRepository.deleteAll(cart.getItems());
    }

    private ProductVariant findVariantSafely(Long idFromFrontend) {
        ProductVariant variant = productVariantRepository.findById(idFromFrontend).orElse(null);
        if (variant != null) return variant;

        Product product = productRepository.findById(idFromFrontend)
                .orElseThrow(() -> new RuntimeException("No variant or product found for ID: " + idFromFrontend));

        List<ProductVariant> variants = productVariantRepository.findAll().stream()
                .filter(v -> v.getProduct().getId().equals(product.getId()))
                .collect(Collectors.toList());

        if (variants.isEmpty()) {
            ProductVariant defaultVariant = ProductVariant.builder()
                    .product(product)
                    .variantName("Default")
                    .variantValue("Standard")
                    .price(product.getBasePrice())
                    .stockQuantity(100)
                    .build();
            return productVariantRepository.save(defaultVariant);
        }

        return variants.get(0);
    }

    private CartDTO mapToDTO(Cart cart) {
        List<CartItemDTO> items = cart.getItems().stream()
                .map(item -> {
                    ProductVariant variant = item.getProductVariant();
                    Product product = variant.getProduct();

                    String imageUrl = null;
                    if (product.getImages() != null && !product.getImages().isEmpty()) {
                        imageUrl = product.getImages().iterator().next().getImageUrl();
                    }

                    return CartItemDTO.builder()
                            .id(item.getId())
                            .productVariantId(variant.getId())
                            .productName(product.getTitle())
                            .variantDetails(variant.getVariantName() + " : " + variant.getVariantValue())
                            .quantity(item.getQuantity())
                            .price(variant.getPrice().doubleValue())
                            .totalPrice(item.getQuantity() * variant.getPrice().doubleValue())
                            .imageUrl(imageUrl)
                            .build();
                })
                .collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(CartItemDTO::getTotalPrice)
                .sum();

        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .totalAmount(total)
                .build();
    }

    public void updateCartItemQuantity(Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }
}
