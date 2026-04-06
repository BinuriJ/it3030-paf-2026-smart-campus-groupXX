package com.smartcampus.notifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")

public class NotificationController {

    @Autowired
    private NotificationService service;

    // GET notifications for a user
    @GetMapping("/user/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return service.getUserNotifications(userId);
    }

    // CREATE notification
    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return service.createNotification(notification);
    }

    // MARK AS READ
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable String id) {
        service.markAsRead(id);
    }
}