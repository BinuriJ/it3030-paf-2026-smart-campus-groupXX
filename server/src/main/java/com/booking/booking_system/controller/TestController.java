package com.booking.booking_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Booking System is Running!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test API working!";
    }
}