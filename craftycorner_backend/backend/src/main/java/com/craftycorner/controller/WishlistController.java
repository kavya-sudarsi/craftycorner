package com.craftycorner.controller;

import com.craftycorner.dto.wishlist.WishlistDTO;
import com.craftycorner.service.WishlistService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<WishlistDTO> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<WishlistDTO> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/{userId}/remove/{itemId}")
    public ResponseEntity<WishlistDTO> remove(
            @PathVariable Long userId,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(userId, itemId));
    }
}
