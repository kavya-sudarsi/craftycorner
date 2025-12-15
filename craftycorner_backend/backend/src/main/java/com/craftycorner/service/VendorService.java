package com.craftycorner.service;

import com.craftycorner.dto.vendor.VendorOnboardRequest;
import com.craftycorner.dto.vendor.VendorProfileResponse;
import com.craftycorner.dto.vendor.VendorProfileUpdateRequest;
import com.craftycorner.model.*;
import com.craftycorner.repository.RoleRepository;
import com.craftycorner.repository.UserRepository;
import com.craftycorner.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorProfileRepository vendorProfileRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private static final String ROLE_VENDOR = "ROLE_VENDOR";

    private VendorProfileResponse map(VendorProfile vp) {
        return new VendorProfileResponse(
                vp.getId(),
                vp.getUser().getId(),
                vp.getShopName(),
                vp.getBio(),
                vp.getGstin(),
                vp.getOnboardingStatus(),
                vp.getRejectionReason(),
                vp.getCreatedAt() != null
                        ? vp.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant()
                        : null,
                vp.getApprovedAt() != null
                        ? vp.getApprovedAt().atZone(java.time.ZoneId.systemDefault()).toInstant()
                        : null
        );
    }

    @Transactional
    public VendorProfileResponse onboard(String email, VendorOnboardRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        boolean hasVendor = user.getRoles().stream().anyMatch(r -> ROLE_VENDOR.equals(r.getName()));

        if (!hasVendor) {
            Role vendorRole = roleRepository.findByName(ROLE_VENDOR)
                    .orElseThrow(() -> new RuntimeException("ROLE_VENDOR not found. Seed it in DB."));
            user.getRoles().add(vendorRole);
            userRepository.save(user);
        }

        VendorProfile vp = vendorProfileRepository.findByUserId(user.getId()).orElse(null);

        if (vp == null) {
            vp = VendorProfile.builder()
                    .user(user)
                    .shopName(req.getShopName())
                    .bio(req.getBio())
                    .gstin(req.getGstin())
                    .onboardingStatus(OnboardingStatus.PENDING)
                    .build();
        } else {
            vp.setShopName(req.getShopName());
            vp.setBio(req.getBio());
            vp.setGstin(req.getGstin());

            if (vp.getOnboardingStatus() == OnboardingStatus.REJECTED) {
                vp.setOnboardingStatus(OnboardingStatus.PENDING);
                vp.setRejectionReason(null);
                vp.setApprovedAt(null);
            }
        }

        return map(vendorProfileRepository.save(vp));
    }

    @Transactional(readOnly = true)
    public VendorProfileResponse myProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        VendorProfile vp = vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found for user"));

        return map(vp);
    }

    @Transactional
    public VendorProfileResponse updateMyProfile(String email, VendorProfileUpdateRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        VendorProfile vp = vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found for user"));

        vp.setShopName(req.getShopName());
        vp.setBio(req.getBio());
        vp.setGstin(req.getGstin());

        return map(vendorProfileRepository.save(vp));
    }

    @Transactional(readOnly = true)
    public Page<VendorProfileResponse> listByStatus(OnboardingStatus status, Pageable pageable) {
        Page<VendorProfile> page = (status == null)
                ? vendorProfileRepository.findAll(pageable)
                : vendorProfileRepository.findByOnboardingStatus(status, pageable);

        return page.map(this::map);
    }

    @Transactional
    public VendorProfileResponse approve(Long vendorProfileId) {
        VendorProfile vp = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found: " + vendorProfileId));

        if (vp.getOnboardingStatus() == OnboardingStatus.APPROVED) {
            return map(vp);
        }

        vp.setOnboardingStatus(OnboardingStatus.APPROVED);
        vp.setRejectionReason(null);
        vp.setApprovedAt(LocalDateTime.now());

        User user = vp.getUser();
        if (user != null && user.getRoles().stream().noneMatch(r -> ROLE_VENDOR.equals(r.getName()))) {
            Role vendorRole = roleRepository.findByName(ROLE_VENDOR)
                    .orElseThrow(() -> new RuntimeException("ROLE_VENDOR not found."));
            user.getRoles().add(vendorRole);
            userRepository.save(user);
        }

        vendorProfileRepository.save(vp);
        return map(vp);
    }

    @Transactional
    public VendorProfileResponse reject(Long vendorProfileId, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new RuntimeException("Rejection reason is required");
        }

        VendorProfile vp = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found: " + vendorProfileId));

        vp.setOnboardingStatus(OnboardingStatus.REJECTED);
        vp.setRejectionReason(reason);
        vp.setApprovedAt(null);

        vendorProfileRepository.save(vp);
        return map(vp);
    }
}
