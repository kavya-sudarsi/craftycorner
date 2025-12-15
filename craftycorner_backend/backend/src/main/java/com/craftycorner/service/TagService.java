package com.craftycorner.service;

import com.craftycorner.model.Product;
import com.craftycorner.model.Tag;
import com.craftycorner.repository.ProductRepository;
import com.craftycorner.repository.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final ProductRepository productRepository;

    public Tag createTag(String name) {
        return tagRepository.findByName(name)
                .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public List<Product> getProductsByTag(String tagName) {
        Tag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found"));
        return List.copyOf(tag.getProducts());
    }

    public Product assignTagToProduct(Long productId, String tagName) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        Tag tag = tagRepository.findByName(tagName)
                .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));

        product.getTags().add(tag);
        return productRepository.save(product);
    }
}
