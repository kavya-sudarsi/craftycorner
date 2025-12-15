package com.craftycorner.controller;

import com.craftycorner.dto.vendor.VendorDecisionRequest;
import com.craftycorner.dto.vendor.VendorProfileResponse;
import com.craftycorner.model.OnboardingStatus;
import com.craftycorner.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/vendors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVendorController {

    private final VendorService vendorService;

    @GetMapping
    public Page<VendorProfileResponse> list(
            @RequestParam(required = false) OnboardingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String sortField = sort.split(",")[0];
        boolean desc = sort.toLowerCase().endsWith("desc");

        Sort sorting = desc ? Sort.by(sortField).descending() : Sort.by(sortField).ascending();
        Pageable pageable = PageRequest.of(page, size, sorting);

        return vendorService.listByStatus(status, pageable);
    }

    @PostMapping("/{id}/approve")
    public VendorProfileResponse approve(@PathVariable Long id) {
        return vendorService.approve(id);
    }

    @PostMapping("/{id}/reject")
    public VendorProfileResponse reject(
            @PathVariable Long id,
            @RequestBody VendorDecisionRequest req
    ) {
        return vendorService.reject(id, req.getReason());
    }
}
