package com.craftycorner.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long productVariantId;
    private String productName;
    private String variantDetails;
    private int quantity;
    private double price;
    private double totalPrice;
    private String imageUrl;
}
