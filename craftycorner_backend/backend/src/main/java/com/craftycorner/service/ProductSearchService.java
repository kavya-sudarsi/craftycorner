package com.craftycorner.service;

import com.craftycorner.dto.common.SearchResponse;
import com.craftycorner.dto.product.ProductSearchDTO;
import com.craftycorner.model.Product;
import com.craftycorner.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductSearchService {

    private final ProductRepository productRepository;

    public SearchResponse<ProductSearchDTO> searchProducts(
            String keyword,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy,
            int page,
            int size
    ) {
        String sortParam = (sortBy == null ? "newest" : sortBy.toLowerCase().trim());

        // Run native search
        List<Product> allProducts = productRepository.searchProductsNative(keyword, category, sortParam);

        // Apply price filter in Java
        if (minPrice != null || maxPrice != null) {
            allProducts = allProducts.stream()
                    .filter(p -> {
                        if (p.getBasePrice() == null) return false;
                        boolean withinMin = (minPrice == null || p.getBasePrice().compareTo(minPrice) >= 0);
                        boolean withinMax = (maxPrice == null || p.getBasePrice().compareTo(maxPrice) <= 0);
                        return withinMin && withinMax;
                    })
                    .collect(Collectors.toList());
        }

        // Pagination manually since native query returns list
        int start = Math.min(page * size, allProducts.size());
        int end = Math.min(start + size, allProducts.size());
        
        Page<Product> pageResult = new PageImpl<>(
                allProducts.subList(start, end),
                PageRequest.of(page, size),
                allProducts.size()
        );

        // Collect filters
        Map<String, Object> appliedFilters = new HashMap<>();
        if (keyword != null && !keyword.isBlank()) appliedFilters.put("keyword", keyword);
        if (category != null && !category.isBlank()) appliedFilters.put("category", category);
        if (minPrice != null) appliedFilters.put("minPrice", minPrice);
        if (maxPrice != null) appliedFilters.put("maxPrice", maxPrice);
        appliedFilters.put("sortBy", sortParam);

        // Build final response
        return new SearchResponse<>(
                pageResult.getContent().stream()
                        .map(ProductSearchDTO::fromEntity)
                        .collect(Collectors.toList()),
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortParam,
                appliedFilters
        );
    }
}
