package com.craftycorner.service;

import com.craftycorner.dto.product.ProductDTO;
import com.craftycorner.model.*;
import com.craftycorner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @Value("${app.base-url:http://localhost:8082}")
    private String baseUrl;


    private ProductDTO mapToDTO(Product p) {

        List<String> tags = p.getTags() != null
                ? p.getTags().stream().map(Tag::getName).toList()
                : List.of();

        List<String> imageUrls = p.getImages() != null
                ? p.getImages().stream()
                    .map(img -> normalizeImageUrl(img.getImageUrl()))
                    .filter(Objects::nonNull)
                    .toList()
                : List.of();

        return new ProductDTO(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getBasePrice(),
                p.getMadeToOrder(),
                p.getLeadTimeDays(),
                p.getStatus(),
                p.getCreatedAt(),
                p.getUpdatedAt(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getVendor() != null ? p.getVendor().getShopName() : null,
                tags,
                imageUrls
        );
    }

    private String normalizeImageUrl(String url) {
        if (url == null) return null;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        if (url.startsWith("/uploads")) return baseUrl + url;
        if (url.startsWith("uploads")) return baseUrl + "/" + url;
        return baseUrl + "/uploads/" + url;
    }


    private void setTags(Product product, List<String> tagNames) {
        if (tagNames != null && !tagNames.isEmpty()) {

            Set<Tag> tags = tagNames.stream()
                    .map(name -> 
                            tagRepository.findByName(name)
                                .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()))
                    )
                    .collect(Collectors.toSet());

            product.setTags(tags);

        } else {
            product.setTags(new HashSet<>());
        }
    }


    @Transactional
    public ProductDTO createProductForVendor(
            Product product,
            Long categoryId,
            String vendorEmail,
            List<String> tagNames
    ) {
        User user = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + vendorEmail));

        VendorProfile vendor = vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found for: " + vendorEmail));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));

        product.setVendor(vendor);
        product.setCategory(category);
        if (product.getStatus() == null) product.setStatus(ProductStatus.DRAFT);

        setTags(product, tagNames);

        Product saved = productRepository.save(product);
        return mapToDTO(saved);
    }

 
    @Transactional
    public ProductDTO updateProductForVendor(
            Long productId,
            Product updated,
            String vendorEmail,
            List<String> tagNames,
            Long categoryId
    ) {
        Product existing = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (!existing.getVendor().getUser().getEmail().equals(vendorEmail)) {
            throw new RuntimeException("Not your product");
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setBasePrice(updated.getBasePrice());
        existing.setMadeToOrder(updated.getMadeToOrder());
        existing.setLeadTimeDays(updated.getLeadTimeDays());
        existing.setStatus(updated.getStatus() != null ? updated.getStatus() : existing.getStatus());

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
            existing.setCategory(category);
        }

        setTags(existing, tagNames);

        Product saved = productRepository.save(existing);
        return mapToDTO(saved);
    }


    @Transactional
    public void deleteProductForVendor(Long productId, String vendorEmail) {
        Product existing = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (!existing.getVendor().getUser().getEmail().equals(vendorEmail)) {
            throw new RuntimeException("Not your product");
        }

        productRepository.delete(existing);
    }


    @Transactional(readOnly = true)
    public List<ProductDTO> getAllActiveProducts() {
        return productRepository.findAllActiveProducts()
                .stream()
                .filter(p -> p.getVendor() != null && p.getVendor().getOnboardingStatus() == OnboardingStatus.APPROVED)
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        return mapToDTO(p);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsForVendor(String vendorEmail) {

        User user = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + vendorEmail));

        VendorProfile vendor = vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found: " + vendorEmail));

        return productRepository.findByVendor_Id(vendor.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByStatus(ProductStatus status) {
        return productRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    public ProductDTO updateProductStatus(Long productId, ProductStatus status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        product.setStatus(status);
        productRepository.save(product);

        return mapToDTO(product);
    }

    @Transactional
    public void deleteProductByAdmin(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found: " + productId);
        }
        productRepository.deleteById(productId);
    }
}
