package com.craftycorner.dto.vendor;

import com.craftycorner.model.OnboardingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class VendorProfileResponse {
    private Long id;
    private Long userId;
    private String shopName;
    private String bio;
    private String gstin;
    private OnboardingStatus onboardingStatus;
    private String rejectionReason;
    private Instant createdAt;
    private Instant approvedAt;
}
