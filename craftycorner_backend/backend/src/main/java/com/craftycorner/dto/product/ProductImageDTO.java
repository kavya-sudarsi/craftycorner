package com.craftycorner.dto.product;

import com.craftycorner.model.ProductImage;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {

    private Long id;
    private String imageUrl;
    private boolean primaryImage;

    public static ProductImageDTO fromEntity(ProductImage image, String baseUrl) {
        if (image == null) {
            return null;
        }

        return ProductImageDTO.builder()
                .id(image.getId())
                .imageUrl(baseUrl + image.getImageUrl())
                .primaryImage(Boolean.TRUE.equals(image.getPrimaryImage()))
                .build();
    }
}
