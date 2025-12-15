package com.craftycorner.controller;

import com.craftycorner.dto.order.OrderDTO;
import com.craftycorner.model.OrderStatus;
import com.craftycorner.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderId}")
    public OrderDTO getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/{orderId}/status")
    public OrderDTO updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/count")
    public long getOrderCount() {
        return orderService.getAllOrders().size();
    }
}
