package com.booking.booking_system.controller;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public Booking create(@RequestBody Booking b) {
        return service.save(b);
    }

    @GetMapping
    public List<Booking> getAll() {
        return service.getAll();
    }

    @GetMapping("/user/{userName}")
    public List<Booking> getUser(@PathVariable String userName) {
        return service.getByUser(userName);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}