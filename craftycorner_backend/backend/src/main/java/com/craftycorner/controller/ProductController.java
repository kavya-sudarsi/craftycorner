package com.craftycorner.controller;

import com.craftycorner.dto.product.ProductDTO;
import com.craftycorner.model.Product;
import com.craftycorner.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/vendors/products")
    public ProductDTO createProduct(@RequestBody ProductDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setBasePrice(dto.getBasePrice());
        product.setMadeToOrder(dto.getMadeToOrder());
        product.setLeadTimeDays(dto.getLeadTimeDays());
        product.setStatus(dto.getStatus());

        return productService.createProductForVendor(
                product,
                dto.getCategoryId(),
                email,
                dto.getTags()
        );
    }

    @PutMapping("/vendors/products/{productId}")
    public ProductDTO updateProduct(@PathVariable Long productId,
                                    @RequestBody ProductDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Product updated = new Product();
        updated.setTitle(dto.getTitle());
        updated.setDescription(dto.getDescription());
        updated.setBasePrice(dto.getBasePrice());
        updated.setMadeToOrder(dto.getMadeToOrder());
        updated.setLeadTimeDays(dto.getLeadTimeDays());
        updated.setStatus(dto.getStatus());

        return productService.updateProductForVendor(
                productId,
                updated,
                email,
                dto.getTags(),
                dto.getCategoryId()
        );
    }

    @DeleteMapping("/vendors/products/{productId}")
    public void deleteProduct(@PathVariable Long productId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        productService.deleteProductForVendor(productId, email);
    }

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllActiveProducts();
    }

    @GetMapping("/products/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/vendors/products")
    public List<ProductDTO> getVendorProducts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return productService.getProductsForVendor(email);
    }
}
