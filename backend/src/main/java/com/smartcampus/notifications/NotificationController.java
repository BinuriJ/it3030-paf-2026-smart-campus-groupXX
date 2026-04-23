package com.smartcampus.notifications;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping("/user/{userId}")
    public List<AppNotification> getNotifications(@PathVariable String userId) {
        return service.getUserNotifications(userId);
    }

    @PostMapping
    public AppNotification createNotification(@RequestBody AppNotification notification) {
        return service.createNotification(notification);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable String id) {
        service.markAsRead(id);
    }
}
