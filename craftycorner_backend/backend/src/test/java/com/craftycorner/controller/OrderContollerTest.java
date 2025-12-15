package com.craftycorner.controller;

import com.craftycorner.dto.order.PlaceOrderRequest;
import com.craftycorner.model.OrderStatus;
import com.craftycorner.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void placeOrder_shouldReturnOk() throws Exception {
        PlaceOrderRequest req = new PlaceOrderRequest();
        req.setUserId(1L);
        req.setItems(Collections.emptyList());

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void updateOrderStatus_shouldReturnOk() throws Exception {
        mockMvc.perform(put("/api/orders/1/status")
                        .param("status", OrderStatus.PAID.name()))
                .andExpect(status().isOk());
    }
}
