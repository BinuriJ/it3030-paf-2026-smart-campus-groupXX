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

    @GetMapping
    public List<Booking> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Booking create(@RequestBody Booking booking) {
        return service.createBooking(booking);
    }

    @PutMapping("/{id}")
    public Booking update(@PathVariable String id, @RequestBody Booking booking) {
        return service.update(id, booking);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        service.delete(id);
        return "Deleted successfully";
    }
}