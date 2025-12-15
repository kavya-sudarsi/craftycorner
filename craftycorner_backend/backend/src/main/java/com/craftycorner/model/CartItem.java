package com.craftycorner.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Column(name = "qty", nullable = false)
    private int quantity;

    @Column(name = "unit_price_snapshot", nullable = false)
    private BigDecimal unitPriceSnapshot;

    @Column(name = "customization_text")
    private String customizationText;

    @Column(name = "customization_image_url")
    private String customizationImageUrl;

    @PrePersist
    protected void prePersist() {
        if (unitPriceSnapshot == null && productVariant != null) {
            this.unitPriceSnapshot = productVariant.getPrice();
        }
    }
}
