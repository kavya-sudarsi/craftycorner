package com.craftycorner.controller;

import com.craftycorner.dto.product.ProductImageDTO;
import com.craftycorner.dto.product.ProductImageUpdateRequest;
import com.craftycorner.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService imageService;

    @PostMapping("/{productId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ProductImageDTO> addImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "primaryImage", defaultValue = "false") boolean primaryImage
    ) {
        return ResponseEntity.ok(
                imageService.saveFile(productId, file, primaryImage)
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImageDTO>> getImagesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(imageService.getImagesByProduct(productId));
    }

    @PreAuthorize("hasRole('VENDOR')")
    @PutMapping("/{imageId}")
    public ResponseEntity<ProductImageDTO> updateImage(
            @PathVariable Long imageId,
            @RequestBody ProductImageUpdateRequest request
    ) {
        return ResponseEntity.ok(
                imageService.updateImage(imageId, request.getPrimaryImage())
        );
    }

    @PreAuthorize("hasRole('VENDOR')")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
