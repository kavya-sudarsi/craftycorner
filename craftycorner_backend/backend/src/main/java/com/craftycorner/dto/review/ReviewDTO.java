package com.craftycorner.dto.review;

import com.craftycorner.model.Review;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private Long productVariantId;
    private Long userId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewDTO fromEntity(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .productVariantId(review.getProductVariant().getId())
                .userId(review.getUser().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
