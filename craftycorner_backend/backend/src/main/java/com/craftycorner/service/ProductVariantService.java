package com.craftycorner.service;

import com.craftycorner.model.Product;
import com.craftycorner.model.ProductVariant;
import com.craftycorner.repository.ProductRepository;
import com.craftycorner.repository.ProductVariantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductVariantService {

    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;

    public ProductVariant addVariant(Long productId, ProductVariant variant) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        variant.setProduct(product);
        return variantRepository.save(variant);
    }

    public List<ProductVariant> getVariantsByProduct(Long productId) {
        return variantRepository.findByProductId(productId);
    }

    public ProductVariant updateVariant(Long variantId, ProductVariant updatedVariant) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new EntityNotFoundException("Variant not found"));

        variant.setVariantName(updatedVariant.getVariantName());
        variant.setVariantValue(updatedVariant.getVariantValue());
        variant.setStockQuantity(updatedVariant.getStockQuantity());
        variant.setPrice(updatedVariant.getPrice());

        return variantRepository.save(variant);
    }

    public void deleteVariant(Long variantId) {
        if (!variantRepository.existsById(variantId)) {
            throw new EntityNotFoundException("Variant not found");
        }
        variantRepository.deleteById(variantId);
    }
}
