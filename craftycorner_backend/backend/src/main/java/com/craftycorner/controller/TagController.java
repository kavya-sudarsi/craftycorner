package com.craftycorner.controller;

import com.craftycorner.model.Product;
import com.craftycorner.model.Tag;
import com.craftycorner.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PreAuthorize("hasAnyRole('VENDOR','ADMIN')")
    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestParam String name) {
        return ResponseEntity.ok(tagService.createTag(name));
    }

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @GetMapping("/{name}/products")
    public ResponseEntity<List<Product>> getProductsByTag(@PathVariable String name) {
        return ResponseEntity.ok(tagService.getProductsByTag(name));
    }

    @PreAuthorize("hasRole('VENDOR')")
    @PostMapping("/assign")
    public ResponseEntity<Product> assignTagToProduct(
            @RequestParam Long productId,
            @RequestParam String tagName) {
        return ResponseEntity.ok(tagService.assignTagToProduct(productId, tagName));
    }
}
