package com.craftycorner.controller;

import com.craftycorner.dto.product.ProductDTO;
import com.craftycorner.model.ProductStatus;
import com.craftycorner.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductDTO> list(@RequestParam(required = false) ProductStatus status) {
        return (status != null)
                ? productService.getProductsByStatus(status)
                : productService.getAllProducts();
    }

    @PostMapping("/{id}/approve")
    public ProductDTO approve(@PathVariable Long id) {
        return productService.updateProductStatus(id, ProductStatus.ACTIVE);
    }

    @PostMapping("/{id}/reject")
    public ProductDTO reject(@PathVariable Long id) {
        return productService.updateProductStatus(id, ProductStatus.INACTIVE);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteProductByAdmin(id);
    }

    @GetMapping("/count")
    public long getTotalProductsCount() {
        return productService.getAllProducts().size();
    }

    @GetMapping("/pending/count")
    public long getPendingProductsCount() {
        return productService.getProductsByStatus(ProductStatus.DRAFT).size()
                + productService.getProductsByStatus(ProductStatus.INACTIVE).size();
    }

    @GetMapping("/recent")
    public List<ProductDTO> getRecentProducts() {
        List<ProductDTO> all = productService.getAllProducts();
        int size = all.size();
        return all.subList(Math.max(0, size - 5), size);
    }
}
