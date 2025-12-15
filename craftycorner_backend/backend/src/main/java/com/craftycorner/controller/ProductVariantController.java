package com.craftycorner.controller;

import com.craftycorner.model.ProductVariant;
import com.craftycorner.service.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService variantService;

    // Vendor - Add variant to product
    @PreAuthorize("hasRole('VENDOR')")
    @PostMapping("/{productId}")
    public ResponseEntity<ProductVariant> addVariant(
            @PathVariable Long productId,
            @RequestBody ProductVariant variant
    ) {
        return ResponseEntity.ok(variantService.addVariant(productId, variant));
    }

    // Public - Get variants by product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariant>> getVariantsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(variantService.getVariantsByProduct(productId));
    }

    // Vendor - Update variant
    @PreAuthorize("hasRole('VENDOR')")
    @PutMapping("/{variantId}")
    public ResponseEntity<ProductVariant> updateVariant(
            @PathVariable Long variantId,
            @RequestBody ProductVariant variant
    ) {
        return ResponseEntity.ok(variantService.updateVariant(variantId, variant));
    }

    // Vendor - Delete variant
    @PreAuthorize("hasRole('VENDOR')")
    @DeleteMapping("/{variantId}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long variantId) {
        variantService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }
}
