package com.craftycorner.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceOrderRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull
    private Long addressId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotEmpty(message = "Order must contain at least one item")
    private List<@Valid PlaceOrderItemRequest> items;
}
