package com.booking.booking_system.service;

import com.booking.booking_system.model.Notification;
import com.booking.booking_system.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    public Notification save(String message, String user) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setUserName(user);
        return repository.save(n);
    }

    public List<Notification> getAll() {
        return repository.findAll();
    }
}
