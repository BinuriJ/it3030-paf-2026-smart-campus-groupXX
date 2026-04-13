package com.booking.booking_system.controller;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    // =========================
    // CREATE BOOKING (USER)
    // =========================
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Booking b) {

        try {
            if (b.getUserEmail() == null || b.getUserEmail().isBlank()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("userEmail is required for booking creation");
            }

            if (b.getUserName() == null || b.getUserName().isBlank()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("userName is required");
            }

            Booking created = service.save(b);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================
    // GET USER BOOKINGS
    // =========================
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(@RequestParam String userName) {

        if (userName == null || userName.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("userName is required");
        }

        return ResponseEntity.ok(service.getByUser(userName));
    }

    // =========================
    // GET SINGLE BOOKING
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {

        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================
    // UPDATE BOOKING (USER)
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestParam String userName,
            @RequestBody Booking b
    ) {

        try {
            if (userName == null || userName.isBlank()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("userName is required");
            }

            Booking updated = service.update(id, b, userName);
            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================
    // DELETE BOOKING (USER)
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable String id,
            @RequestParam String userName
    ) {

        try {
            if (userName == null || userName.isBlank()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("userName is required");
            }

            service.delete(id, userName);
            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================
    // ADMIN - GET ALL BOOKINGS
    // =========================
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(service.getAll());
    }

    // =========================
    // ADMIN - UPDATE STATUS (WITH REASON)
    // =========================
    @PutMapping("/admin/status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam String adminName,
            @RequestParam(required = false) String reason   // ✅ ADDED
    ) {

        try {
            if (adminName == null || adminName.isBlank()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("adminName is required");
            }

            return ResponseEntity.ok(
                    service.updateStatus(id, status, adminName, reason)
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}