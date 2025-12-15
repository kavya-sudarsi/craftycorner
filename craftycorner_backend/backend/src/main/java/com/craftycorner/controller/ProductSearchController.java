package com.craftycorner.controller;

import com.craftycorner.dto.common.SearchResponse;
import com.craftycorner.dto.product.ProductSearchDTO;
import com.craftycorner.service.ProductSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class ProductSearchController {

    private final ProductSearchService productSearchService;

    @GetMapping("/products")
    public SearchResponse<ProductSearchDTO> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return productSearchService.searchProducts(
                keyword, category, minPrice, maxPrice, sortBy, page, size
        );
    }
}
