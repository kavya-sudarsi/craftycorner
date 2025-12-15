package com.craftycorner.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceOrderItemRequest {

    @NotNull(message = "Product variant ID is required")
    private Long productVariantId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
