package com.craftycorner.service;

import com.craftycorner.dto.product.ProductImageDTO;
import com.craftycorner.model.Product;
import com.craftycorner.model.ProductImage;
import com.craftycorner.repository.ProductImageRepository;
import com.craftycorner.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository imageRepository;
    private final ProductRepository productRepository;

    @Value("${app.base-url:http://localhost:8082}")
    private String baseUrl;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final int MAX_IMAGES = 5;

    /** Save uploaded file to /uploads and DB */
    public ProductImageDTO saveFile(Long productId, MultipartFile file, boolean primaryImage) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Limit image count
        long count = imageRepository.countByProductId(productId);
        if (count >= MAX_IMAGES) {
            throw new RuntimeException("Maximum " + MAX_IMAGES + " images allowed per product");
        }

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.write(filePath, file.getBytes());

            String relativePath = "/uploads/" + fileName;

            // If marking primary → unset existing ones
            if (primaryImage) {
                List<ProductImage> others = imageRepository.findByProductId(productId);
                for (ProductImage img : others) {
                    img.setPrimaryImage(false);
                }
                imageRepository.saveAll(others);
            }

            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(relativePath);
            image.setPrimaryImage(primaryImage);

            ProductImage saved = imageRepository.save(image);
            return ProductImageDTO.fromEntity(saved, baseUrl);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    /** Get all images for a product */
    public List<ProductImageDTO> getImagesByProduct(Long productId) {
        return imageRepository.findByProductId(productId)
                .stream()
                .map(img -> ProductImageDTO.fromEntity(img, baseUrl))
                .collect(Collectors.toList());
    }

    /** Update primary image flag */
    public ProductImageDTO updateImage(Long imageId, Boolean primaryImage) {
        ProductImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));

        if (Boolean.TRUE.equals(primaryImage)) {
            List<ProductImage> others = imageRepository.findByProductId(image.getProduct().getId());
            for (ProductImage img : others) {
                if (!img.getId().equals(imageId)) {
                    img.setPrimaryImage(false);
                }
            }
            imageRepository.saveAll(others);
        }

        if (primaryImage != null) {
            image.setPrimaryImage(primaryImage);
        }

        ProductImage saved = imageRepository.save(image);
        return ProductImageDTO.fromEntity(saved, baseUrl);
    }

    /** Delete image and assign a new primary if needed */
    public void deleteImage(Long imageId) {
        ProductImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));

        Long productId = image.getProduct().getId();
        boolean wasPrimary = Boolean.TRUE.equals(image.getPrimaryImage());

        imageRepository.deleteById(imageId);

        if (wasPrimary) {
            List<ProductImage> remaining = imageRepository.findByProductId(productId);
            if (!remaining.isEmpty()) {
                ProductImage first = remaining.get(0);
                first.setPrimaryImage(true);
                imageRepository.save(first);
            }
        }
    }
}
