package com.craftycorner.controller;

import com.craftycorner.dto.auth.ForgotPasswordRequest;
import com.craftycorner.dto.auth.ResetPasswordRequest;
import com.craftycorner.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class PasswordController {

    private final PasswordResetService passwordResetService;

    // Trigger password reset email
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        passwordResetService.initiatePasswordReset(req.getEmail());
        return ResponseEntity.ok("If an account exists for this email, a password reset link has been sent.");
    }

    // Reset password using token
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        passwordResetService.resetPassword(req.getToken(), req.getNewPassword());
        return ResponseEntity.ok("Password reset successful. You can now log in with your new password.");
    }
}
