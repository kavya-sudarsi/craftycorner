package com.craftycorner.controller;

import com.craftycorner.dto.vendor.VendorOnboardRequest;
import com.craftycorner.dto.vendor.VendorProfileResponse;
import com.craftycorner.dto.vendor.VendorProfileUpdateRequest;
import com.craftycorner.dto.order.OrderDTO;
import com.craftycorner.dto.vendor.VendorDecisionRequest;
import com.craftycorner.model.OnboardingStatus;
import com.craftycorner.service.OrderService;
import com.craftycorner.service.VendorService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;
    private final OrderService orderService;

    @PostMapping("/onboard")
    public VendorProfileResponse onboard(@RequestBody VendorOnboardRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return vendorService.onboard(email, req);
    }

    @GetMapping("/me")
    public VendorProfileResponse myProfileMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return vendorService.myProfile(email);
    }

    @PutMapping("/me")
    public VendorProfileResponse updateProfileMe(@RequestBody VendorProfileUpdateRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return vendorService.updateMyProfile(email, req);
    }

    @GetMapping("/profile")
    public VendorProfileResponse myProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return vendorService.myProfile(email);
    }

    @PutMapping("/profile")
    public VendorProfileResponse updateProfile(@RequestBody VendorProfileUpdateRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return vendorService.updateMyProfile(email, req);
    }

    @GetMapping("/profiles")
    public Page<VendorProfileResponse> list(
            @RequestParam(required = false) OnboardingStatus status,
            Pageable pageable
    ) {
        return vendorService.listByStatus(status, pageable);
    }

    @PostMapping("/profiles/{id}/approve")
    public VendorProfileResponse approve(@PathVariable Long id) {
        return vendorService.approve(id);
    }

    @PostMapping("/profiles/{id}/reject")
    public VendorProfileResponse reject(
            @PathVariable Long id,
            @RequestBody VendorDecisionRequest req
    ) {
        return vendorService.reject(id, req.getReason());
    }

    @GetMapping("/orders")
    public List<OrderDTO> getMyOrders() {
        return orderService.getOrdersForVendor();
    }
}
