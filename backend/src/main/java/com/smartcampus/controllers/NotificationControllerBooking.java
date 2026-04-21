package com.smartcampus.controllers;

import com.smartcampus.entity.NotificationBookingModel;
import com.smartcampus.services.NotificationServiceBooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
public class NotificationControllerBooking {

    @Autowired
    private NotificationServiceBooking service;

    @GetMapping
    public List<NotificationBookingModel> getAll() {
        return service.getAll();
    }
}