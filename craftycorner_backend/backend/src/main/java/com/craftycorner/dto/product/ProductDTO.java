package com.craftycorner.dto.product;

import com.craftycorner.model.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;
    private String title;
    private String description;
    private BigDecimal basePrice;
    private Boolean madeToOrder;
    private Integer leadTimeDays;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long categoryId;
    private String categoryName;
    private String vendorName;

    private List<String> tags;
    private List<String> imageUrls;
}
