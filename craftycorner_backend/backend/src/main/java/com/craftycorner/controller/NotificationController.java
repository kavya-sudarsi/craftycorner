package com.craftycorner.controller;

import com.craftycorner.dto.NotificationRequest;
import com.craftycorner.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Profile("dev")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        notificationService.sendNotification(
                request.getTo(),
                request.getSubject(),
                request.getBody()
        );
        return ResponseEntity.ok("Notification sent successfully to " + request.getTo());
    }
}
