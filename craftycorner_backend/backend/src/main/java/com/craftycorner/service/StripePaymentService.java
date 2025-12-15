package com.craftycorner.service;

import com.craftycorner.model.Order;
import com.craftycorner.model.OrderStatus;
import com.craftycorner.model.Payment;
import com.craftycorner.model.PaymentStatus;
import com.craftycorner.repository.OrderRepository;
import com.craftycorner.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StripePaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    @Transactional
    public Map<String, Object> createPaymentIntent(Long orderId) {
        try {
            Stripe.apiKey = stripeSecretKey;

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            Payment paymentEntity = paymentRepository.findByOrderId(orderId)
                    .orElseGet(() -> paymentRepository.save(
                            Payment.builder()
                                    .order(order)
                                    .amount(order.getTotalAmount())
                                    .method("STRIPE")
                                    .status(PaymentStatus.PENDING)
                                    .build()
                    ));

            long amountInPaise = order.getTotalAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInPaise)
                    .setCurrency("inr")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .putMetadata("orderId", String.valueOf(orderId))
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            Map<String, Object> resp = new HashMap<>();
            resp.put("clientSecret", intent.getClientSecret());
            resp.put("publishableKey", stripePublishableKey);
            resp.put("paymentId", paymentEntity.getId());
            resp.put("orderId", orderId);
            resp.put("amount", order.getTotalAmount());
            return resp;

        } catch (StripeException e) {
            throw new RuntimeException("Stripe PaymentIntent creation failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public boolean confirmPayment(String paymentIntentId, Long orderId) {
        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntent pi = PaymentIntent.retrieve(paymentIntentId);

            String status = pi.getStatus();

            Optional<Payment> payOpt = paymentRepository.findByOrderId(orderId);
            if (payOpt.isPresent()) {
                Payment payment = payOpt.get();
                Order order = payment.getOrder();

                if ("succeeded".equalsIgnoreCase(status)) {
                    payment.setStatus(PaymentStatus.PAID);
                    payment.setMethod("CARD");
                    order.setStatus(OrderStatus.PAID);
                } else {
                    payment.setStatus(PaymentStatus.FAILED);
                    order.setStatus(OrderStatus.PAYMENT_FAILED);
                }

                paymentRepository.save(payment);
                orderRepository.save(order);
                return "succeeded".equalsIgnoreCase(status);
            }
            return false;

        } catch (Exception e) {
            throw new RuntimeException("Payment confirmation failed: " + e.getMessage(), e);
        }
    }
}
