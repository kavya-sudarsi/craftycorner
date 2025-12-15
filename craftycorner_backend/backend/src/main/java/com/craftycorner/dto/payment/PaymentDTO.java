package com.craftycorner.dto.payment;

import com.craftycorner.model.Payment;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private String method;
    private String status;

    public static PaymentDTO fromEntity(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus().name())
                .build();
    }
}
