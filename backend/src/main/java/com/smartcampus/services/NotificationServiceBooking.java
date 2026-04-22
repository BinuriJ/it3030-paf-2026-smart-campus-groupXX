package com.smartcampus.services;

import com.smartcampus.entity.NotificationBookingModel;
import com.smartcampus.repository.NotificationRepositoryBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceBooking {

    @Autowired
    private NotificationRepositoryBooking repository;

    // =========================
    // CREATE NOTIFICATION
    // =========================
    public NotificationBookingModel save(String message, String user) {

        NotificationBookingModel n = new NotificationBookingModel();
        n.setMessage(message);
        n.setUserName(user);

        return repository.save(n);
    }

    // =========================
    // GET ALL NOTIFICATIONS
    // =========================
    public List<NotificationBookingModel> getAll() {
        return repository.findAll();
    }
}