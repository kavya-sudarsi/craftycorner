package com.craftycorner.specification;

import com.craftycorner.model.Product;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) -> {
            if (category == null || category.isBlank()) return null;

            return cb.equal(
                    cb.lower(root.join("category", JoinType.LEFT).get("name")),
                    category.toLowerCase()
            );
        };
    }

    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return null;

            if (minPrice != null && maxPrice != null) {
                return cb.between(root.get("basePrice"), minPrice, maxPrice);
            }
            if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice);
            }
            return cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice);
        };
    }
}
