package com.smartcampus.controllers;

import com.smartcampus.dto.TimeSlotDto;
import com.smartcampus.entity.TimeSlot;
import com.smartcampus.services.TimeSlotService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/slots")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TimeSlotController {

    private final TimeSlotService service;

    public TimeSlotController(TimeSlotService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TimeSlotDto>> getAllSlots() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeSlotDto> getSlot(@PathVariable String id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/available")
    public ResponseEntity<List<TimeSlotDto>> getAvailableSlots() {
        return ResponseEntity.ok(service.findAvailableSlots());
    }

    @GetMapping("/booked")
    public ResponseEntity<List<TimeSlotDto>> getBookedSlots() {
        return ResponseEntity.ok(service.findBookedSlots());
    }

    @PostMapping("/{slotId}/book")
    public ResponseEntity<TimeSlotDto> bookSlot(
            @PathVariable String slotId,
            @RequestBody Map<String, String> bookingRequest) {
        String studentName = bookingRequest.get("studentName");
        String purpose = bookingRequest.get("purpose");

        if (studentName == null || purpose == null) {
            return ResponseEntity.badRequest().build();
        }

        TimeSlotDto bookedSlot = service.bookSlot(slotId, studentName, purpose);
        return ResponseEntity.ok(bookedSlot);
    }

    @PostMapping("/{slotId}/cancel")
    public ResponseEntity<TimeSlotDto> cancelBooking(@PathVariable String slotId) {
        TimeSlotDto canceledSlot = service.cancelBooking(slotId);
        return ResponseEntity.ok(canceledSlot);
    }

    @PutMapping("/{slotId}/status")
    public ResponseEntity<TimeSlotDto> updateSlotStatus(
            @PathVariable String slotId,
            @RequestBody Map<String, String> statusRequest) {
        String status = statusRequest.get("status");

        if (status == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            TimeSlot.SlotStatus slotStatus = TimeSlot.SlotStatus.valueOf(status.toUpperCase());
            TimeSlotDto updatedSlot = service.updateSlotStatus(slotId, slotStatus);
            return ResponseEntity.ok(updatedSlot);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}