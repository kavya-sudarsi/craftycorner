//package com.craftycorner.controller;
//
//import com.craftycorner.model.Payment;
//import com.craftycorner.model.PaymentStatus;
//import com.craftycorner.service.PaymentService;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.math.BigDecimal;
//import java.util.Optional;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(PaymentController.class)
//class PaymentControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private PaymentService paymentService;
//
//    @Test
//    void testCreatePayment() throws Exception {
//        Payment payment = new Payment();
//        payment.setId(1L);
//        payment.setAmount(BigDecimal.valueOf(1000));
//        payment.setStatus(PaymentStatus.PENDING);
//
//      //  Mockito.when(paymentService.createPayment(any(Payment.class)))
//            //   .thenReturn(payment);
//
//        mockMvc.perform(post("/api/payments")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{\"amount\":1000, \"method\":\"CARD\"}"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.status").value("PENDING"));
//    }
//
//    @Test
//    void testGetPaymentById() throws Exception {
//        Payment payment = new Payment();
//        payment.setId(1L);
//        payment.setAmount(BigDecimal.valueOf(1000));
//        payment.setStatus(PaymentStatus.PENDING);
//
//       // Mockito.when(paymentService.getPaymentById(1L))
//               //.thenReturn(Optional.of(payment));
////
//        mockMvc.perform(get("/api/payments/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.status").value("PENDING"));
//    }
//
////    @Test
////    void testUpdatePaymentStatus() throws Exception {
////        Payment payment = new Payment();
////        payment.setId(1L);
////        payment.setAmount(BigDecimal.valueOf(1000));
////        payment.setStatus(PaymentStatus.COMPLETED);
////
////        Mockito.when(paymentService.updatePaymentStatus(eq(1L), eq(PaymentStatus.COMPLETED)))
////               .thenReturn(payment);
////
////        mockMvc.perform(put("/api/payments/1/status")
////                        .param("status", "COMPLETED"))
////                .andExpect(status().isOk())
////                .andExpect(jsonPath("$.status").value("COMPLETED"));
////    }
////}
