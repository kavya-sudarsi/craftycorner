package com.craftycorner.service;

import com.craftycorner.dto.review.RatingSummaryDTO;
import com.craftycorner.dto.review.ReviewDTO;
import com.craftycorner.model.ProductVariant;
import com.craftycorner.model.Review;
import com.craftycorner.model.User;
import com.craftycorner.repository.ProductVariantRepository;
import com.craftycorner.repository.ReviewRepository;
import com.craftycorner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    public List<ReviewDTO> getReviews(Long productVariantId) {
        return reviewRepository.findByProductVariantId(productVariantId)
                .stream()
                .map(ReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO addReview(Long userId, Long productVariantId, int rating, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductVariant variant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        Review review = Review.builder()
                .user(user)
                .productVariant(variant)
                .rating(rating)
                .comment(comment)
                .build();

        reviewRepository.save(review);
        return ReviewDTO.fromEntity(review);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    public RatingSummaryDTO getRatingSummary(Long productVariantId) {
        Double avgRating = reviewRepository.findAverageRatingByProductVariantId(productVariantId);
        Long total = reviewRepository.countReviewsByProductVariantId(productVariantId);

        return RatingSummaryDTO.builder()
                .productVariantId(productVariantId)
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(total)
                .build();
    }
}
