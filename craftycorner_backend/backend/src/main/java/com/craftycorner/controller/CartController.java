package com.craftycorner.controller;

import com.craftycorner.dto.cart.CartDTO;
import com.craftycorner.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getMyCart(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(cartService.getCartByEmail(email));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            Authentication auth,
            @RequestParam Long variantId,
            @RequestParam(defaultValue = "1") int quantity
    ) {
        String email = auth.getName();
        CartDTO updated = cartService.addToCartByEmail(email, variantId, quantity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<CartDTO> removeFromCart(
            Authentication auth,
            @PathVariable Long itemId
    ) {
        String email = auth.getName();
        CartDTO updated = cartService.removeFromCartByEmail(email, itemId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication auth) {
        String email = auth.getName();
        cartService.clearCartByEmail(email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Long itemId,
            @RequestParam int quantity
    ) {
        try {
            cartService.updateCartItemQuantity(itemId, quantity);
            return ResponseEntity.ok("Quantity updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
