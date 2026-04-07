package com.booking.booking_system.controller;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService service;

    @PostMapping
    public Booking create(@RequestBody Booking booking) {
        return service.create(booking);
    }

    @GetMapping
    public List<Booking> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public Booking update(@PathVariable String id, @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @GetMapping("/suggest")
    public List<String> suggest() {
        return service.suggest();
    }
}
