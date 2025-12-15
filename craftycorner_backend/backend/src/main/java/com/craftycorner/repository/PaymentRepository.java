package com.craftycorner.repository;

import com.craftycorner.model.Payment;
import com.craftycorner.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByOrder(Order order);
}
