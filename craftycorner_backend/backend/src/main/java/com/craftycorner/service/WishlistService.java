package com.craftycorner.service;

import com.craftycorner.dto.wishlist.WishlistDTO;
import com.craftycorner.model.*;
import com.craftycorner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    Wishlist wishlist = Wishlist.builder()
                            .user(user)
                            .build();

                    return wishlistRepository.save(wishlist);
                });
    }

    public WishlistDTO getWishlist(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return WishlistDTO.fromEntity(wishlist);
    }

    @Transactional
    public WishlistDTO addToWishlist(Long userId, Long productId) {

        Wishlist wishlist = getOrCreateWishlist(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean exists = wishlist.getItems().stream()
                .anyMatch(i -> i.getProduct().getId().equals(productId));

        if (!exists) {
            WishlistItem item = WishlistItem.builder()
                    .wishlist(wishlist)
                    .product(product)
                    .build();

            wishlist.getItems().add(item);
            wishlistItemRepository.save(item);
        }

        return WishlistDTO.fromEntity(wishlist);
    }

    @Transactional
    public WishlistDTO removeFromWishlist(Long userId, Long itemId) {

        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        wishlist.getItems().removeIf(i -> i.getId().equals(itemId));
        wishlistItemRepository.deleteById(itemId);

        return WishlistDTO.fromEntity(wishlist);
    }
}
