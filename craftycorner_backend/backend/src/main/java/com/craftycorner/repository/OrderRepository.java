package com.craftycorner.repository;

import com.craftycorner.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.items i
        LEFT JOIN FETCH i.productVariant v
        LEFT JOIN FETCH v.product p
        LEFT JOIN FETCH p.images imgs
        WHERE o.user.id = :userId
    """)
    List<Order> findByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.items i
        LEFT JOIN FETCH i.productVariant v
        LEFT JOIN FETCH v.product p
        LEFT JOIN FETCH p.images imgs
        WHERE o.id = :orderId
    """)
    Order findByIdWithDetails(@Param("orderId") Long orderId);

    @Query("""
        SELECT DISTINCT o FROM Order o
        JOIN o.items i
        JOIN i.productVariant v
        JOIN v.product p
        WHERE p.vendor.user.id = :vendorUserId
    """)
    List<Order> findOrdersByVendorUserId(@Param("vendorUserId") Long vendorUserId);
}
