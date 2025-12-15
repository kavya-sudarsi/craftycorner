package com.craftycorner.controller;

import com.craftycorner.dto.AuthResponse;
import com.craftycorner.dto.LoginRequest;
import com.craftycorner.dto.RegisterRequest;
import com.craftycorner.dto.UserResponse;
import com.craftycorner.model.OnboardingStatus;
import com.craftycorner.model.Role;
import com.craftycorner.model.User;
import com.craftycorner.model.VendorProfile;
import com.craftycorner.repository.VendorProfileRepository;
import com.craftycorner.service.JwtService;
import com.craftycorner.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final VendorProfileRepository vendorProfileRepository;

    // Register new user
    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    // Login and get JWT
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User loggedInUser = userService.loginUser(request.getEmail(), request.getPassword());
        String token = jwtService.generateToken(loggedInUser);
        return new AuthResponse(token);
    }

    // Get current user profile
    @GetMapping("/me")
    public UserResponse me() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User dbUser = userService.findByEmail(email);

        Set<String> roleNames = dbUser.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        OnboardingStatus vendorStatus = vendorProfileRepository.findByUserId(dbUser.getId())
                .map(VendorProfile::getOnboardingStatus)
                .orElse(null);

        return new UserResponse(
                dbUser.getId(),
                dbUser.getName(),
                dbUser.getEmail(),
                roleNames,
                vendorStatus
        );
    }

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminDashboard() {
        return "Welcome Admin! 🚀 Only admins can see this.";
    }
}
