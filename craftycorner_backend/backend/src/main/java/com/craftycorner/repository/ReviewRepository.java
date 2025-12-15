package com.craftycorner.repository;

import com.craftycorner.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductVariantId(Long productVariantId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productVariant.id = :productVariantId")
    Double findAverageRatingByProductVariantId(Long productVariantId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.productVariant.id = :productVariantId")
    Long countReviewsByProductVariantId(Long productVariantId);
}
