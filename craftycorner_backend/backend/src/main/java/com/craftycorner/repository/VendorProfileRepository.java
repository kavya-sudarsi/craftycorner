package com.craftycorner.repository;

import com.craftycorner.model.OnboardingStatus;
import com.craftycorner.model.VendorProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {

    Optional<VendorProfile> findByUserId(Long userId);

    Page<VendorProfile> findByOnboardingStatus(OnboardingStatus status, Pageable pageable);
}
