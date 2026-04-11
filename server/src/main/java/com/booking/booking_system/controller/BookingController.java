package com.booking.booking_system.controller;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    // =========================
    // CREATE BOOKING
    // =========================
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Booking b) {
        try {
            Booking saved = service.save(b);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =========================
    // GET BOOKINGS BY USER
    // =========================
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(@RequestParam String userName) {
        try {
            if (userName == null || userName.isBlank()) {
                return ResponseEntity.badRequest().body("userName is required");
            }

            List<Booking> list = service.getByUser(userName);
            return ResponseEntity.ok(list);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching bookings");
        }
    }

    // =========================
    // UPDATE BOOKING (FULL RECHECK)
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestParam String userName,
                                    @RequestBody Booking b) {
        try {
            if (userName == null || userName.isBlank()) {
                return ResponseEntity.badRequest().body("userName is required");
            }

            Booking updated = service.update(id, b, userName);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =========================
    // DELETE BOOKING
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id,
                                    @RequestParam String userName) {
        try {
            if (userName == null || userName.isBlank()) {
                return ResponseEntity.badRequest().body("userName is required");
            }

            service.delete(id, userName);
            return ResponseEntity.ok("Deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =========================
    // DEBUG / TEST ENDPOINT
    // =========================
    @GetMapping
    public ResponseEntity<?> getAllByUser(@RequestParam String userName) {
        try {
            return ResponseEntity.ok(service.getByUser(userName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error loading data");
        }
    }
}