package com.craftycorner.dto.order;

import com.craftycorner.model.OrderItem;
import com.craftycorner.model.ProductImage;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long id;
    private Long productVariantId;
    private int quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;

    private String productName;
    private List<String> imageUrls;

    public static OrderItemDTO fromEntity(OrderItem item) {
        var variant = item.getProductVariant();
        var product = (variant != null) ? variant.getProduct() : null;

        String name = product != null ? product.getTitle() : null;

        List<String> urls = (product != null && product.getImages() != null)
                ? product.getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList())
                : null;

        return OrderItemDTO.builder()
                .id(item.getId())
                .productVariantId(variant != null ? variant.getId() : null)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .totalPrice(item.getTotalPrice())
                .productName(name)
                .imageUrls(urls)
                .build();
    }
}
