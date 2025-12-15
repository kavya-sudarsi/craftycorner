package com.craftycorner.dto.wishlist;

import com.craftycorner.model.Product;
import com.craftycorner.model.WishlistItem;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItemDTO {

    private Long id;
    private Long productId;
    private String title;
    private String imageUrl;

    public static WishlistItemDTO fromEntity(WishlistItem item) {
        Product product = item.getProduct();

        String thumbnail = (product.getImages() == null || product.getImages().isEmpty())
                ? null
                : product.getImages().iterator().next().getImageUrl();

        return WishlistItemDTO.builder()
                .id(item.getId())
                .productId(product.getId())
                .title(product.getTitle())
                .imageUrl(thumbnail)
                .build();
    }
}
