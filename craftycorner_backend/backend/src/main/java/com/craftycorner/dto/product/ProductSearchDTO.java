package com.craftycorner.dto.product;

import com.craftycorner.model.Product;
import com.craftycorner.model.ProductImage;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchDTO {

    private Long id;
    private String title;
    private String description;
    private String categoryName;
    private String vendorName;
    private BigDecimal basePrice;
    private List<String> imageUrls;

    public static ProductSearchDTO fromEntity(Product product) {

        List<String> images = product.getImages() != null
                ? product.getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList())
                : List.of();

        return ProductSearchDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .categoryName(
                        product.getCategory() != null
                                ? product.getCategory().getName()
                                : null
                )
                .vendorName(
                        product.getVendor() != null
                                ? product.getVendor().getShopName()
                                : null
                )
                .basePrice(product.getBasePrice())
                .imageUrls(images)
                .build();
    }
}
