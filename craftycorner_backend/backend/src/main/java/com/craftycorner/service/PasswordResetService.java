package com.craftycorner.service;

import com.craftycorner.model.PasswordResetToken;
import com.craftycorner.model.User;
import com.craftycorner.repository.PasswordResetTokenRepository;
import com.craftycorner.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.password-reset.expiry-seconds:3600}")
    private long tokenTtlSeconds;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendBaseUrl;

    //Create token, save it, and send link by email 
    @Transactional
    public void initiatePasswordReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {

            // remove old tokens for this user
            tokenRepository.deleteByUserId(user.getId());

            PasswordResetToken token = PasswordResetToken.create(user, tokenTtlSeconds);
            tokenRepository.save(token);

            String resetUrl = frontendBaseUrl + "/reset-password/" + token.getToken();

            String subject = "CraftyCorner - Password reset request";
            String body =
                    "Hello " + user.getName() + ",\n\n"
                    + "We received a request to reset your password. "
                    + "Click the link below to set a new password (valid for "
                    + (tokenTtlSeconds / 60) + " minutes):\n\n"
                    + resetUrl + "\n\n"
                    + "If you didn't request this, you can safely ignore this email.\n\n"
                    + "— CraftyCorner";

            notificationService.sendNotification(user.getEmail(), subject, body);
        });
    }

    // Validate token and change password 
    @Transactional
    public void resetPassword(String tokenString, String newPlainPassword) {
        PasswordResetToken token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new RuntimeException("Token expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPlainPassword));
        userRepository.save(user);

        // delete token after use
        tokenRepository.delete(token);
    }
}
