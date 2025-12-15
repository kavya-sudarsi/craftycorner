package com.craftycorner.controller;

import com.craftycorner.dto.review.RatingSummaryDTO;
import com.craftycorner.dto.review.ReviewDTO;
import com.craftycorner.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{variantId}/summary")
    public ResponseEntity<RatingSummaryDTO> getRatingSummary(@PathVariable Long variantId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(variantId));
    }

    @PostMapping("/product/{variantId}/user/{userId}")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Long variantId,
            @PathVariable Long userId,
            @RequestParam int rating,
            @RequestParam(required = false) String comment
    ) {
        return ResponseEntity.ok(
                reviewService.addReview(userId, variantId, rating, comment)
        );
    }

    @DeleteMapping("/{reviewId}/user/{userId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @PathVariable Long userId
    ) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
