package com.smartcampus.notifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    // Get all notifications for a user
    public List<Notification> getUserNotifications(String userId) {
        return repository.findByUserId(userId);
    }

    // Create new notification
    public Notification createNotification(Notification notification) {
        return repository.save(notification);
    }

    // Mark as read
    public void markAsRead(String id) {
        Notification n = repository.findById(id).orElse(null);
        if (n != null) {
            n.setRead(true);
            repository.save(n);
        }
    }
}