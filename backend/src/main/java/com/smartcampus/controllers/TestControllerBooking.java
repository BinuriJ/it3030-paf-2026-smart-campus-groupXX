package com.smartcampus.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestControllerBooking {

    @GetMapping("/")
    public String home() {
        return "Booking System is Running!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test API working!";
    }
}