package com.craftycorner.controller;

import com.craftycorner.service.StripePaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final StripePaymentService stripePaymentService;

    @PostMapping("/create/{orderId}")
    public ResponseEntity<Map<String, Object>> createStripePayment(@PathVariable Long orderId) {
        return ResponseEntity.ok(stripePaymentService.createPaymentIntent(orderId));
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPayment(@RequestBody Map<String, String> payload) {
        String intentId = payload.get("paymentIntentId");
        Long orderId = Long.valueOf(payload.get("orderId"));

        boolean success = stripePaymentService.confirmPayment(intentId, orderId);

        return success
                ? ResponseEntity.ok("Payment confirmed")
                : ResponseEntity.badRequest().body("Payment not successful");
    }
}
