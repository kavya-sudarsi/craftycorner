package com.craftycorner.repository;

import com.craftycorner.model.Cart;
import com.craftycorner.model.CartItem;
import com.craftycorner.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProductVariant(Cart cart, ProductVariant variant);
}
