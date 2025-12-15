package com.craftycorner.dto.review;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingSummaryDTO {
    private Long productVariantId;
    private Double averageRating;
    private Long totalReviews;
}
