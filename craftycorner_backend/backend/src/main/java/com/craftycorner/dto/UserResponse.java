package com.craftycorner.dto;

import com.craftycorner.model.OnboardingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Set<String> roles;
    private OnboardingStatus vendorStatus;
}
