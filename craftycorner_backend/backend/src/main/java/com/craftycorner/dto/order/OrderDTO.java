package com.craftycorner.dto.order;

import com.craftycorner.model.Order;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private Long userId;
    private String status;
    private BigDecimal totalAmount;
    private Instant createdAt;
    private Instant updatedAt;
    private String paymentMethod;
    private String paymentStatus;
    private List<OrderItemDTO> items;
    private String customerName;
    private String orderDate;

    public static OrderDTO fromEntity(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .customerName(order.getUser().getName())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPayment() != null ? order.getPayment().getMethod() : null)
                .paymentStatus(order.getPayment() != null ? order.getPayment().getStatus().name() : null)
                .items(
                        order.getItems().stream()
                                .map(OrderItemDTO::fromEntity)
                                .collect(Collectors.toList())
                )
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .orderDate(order.getCreatedAt().toString())
                .build();
    }
}
