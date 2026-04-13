package com.booking.booking_system.service;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    // =========================
    // AUTO STATUS UPDATE (EXPIRED / COMPLETED)
    // =========================
    @Scheduled(fixedRate = 60000)
    public void updateStatuses() {

        LocalDateTime now = LocalDateTime.now();
        List<Booking> all = repo.findAll();

        for (Booking b : all) {

            if (b.getEndTime() == null) continue;

            String status = safe(b.getStatus());

            if ("PENDING".equals(status) && b.getEndTime().isBefore(now)) {
                b.setStatus("EXPIRED");
            }

            if ("APPROVED".equals(status) && b.getEndTime().isBefore(now)) {
                b.setStatus("COMPLETED");
            }
        }

        repo.saveAll(all);
    }

    // =========================
    // CONFLICT CHECK
    // =========================
    private boolean hasConflict(String resourceId,
                                LocalDateTime start,
                                LocalDateTime end,
                                String ignoreId) {

        if (resourceId == null || start == null || end == null) return false;

        List<Booking> bookings = repo.findByResourceId(resourceId);

        for (Booking b : bookings) {

            if (b == null) continue;
            if (ignoreId != null && ignoreId.equals(b.getId())) continue;

            String status = safe(b.getStatus());

            if (!"PENDING".equals(status) && !"APPROVED".equals(status)) continue;

            if (b.getStartTime() == null || b.getEndTime() == null) continue;

            boolean overlap =
                    start.isBefore(b.getEndTime()) &&
                    end.isAfter(b.getStartTime());

            if (overlap) return true;
        }

        return false;
    }

    // =========================
    // CREATE
    // =========================
    public Booking save(Booking b) {

        validate(b);

        if (hasConflict(b.getResourceId(), b.getStartTime(), b.getEndTime(), null)) {
            throw new RuntimeException("Slot already booked");
        }

        b.setStatus("PENDING");
        b.setCreatedAt(LocalDateTime.now());

        return repo.save(b);
    }

    // =========================
    // READ
    // =========================
    public List<Booking> getByUser(String userName) {
        return repo.findByUserNameIgnoreCase(userName);
    }

    public List<Booking> getAll() {
        return repo.findAll();
    }

    public Booking getById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // =========================
    // ADMIN STATUS CONTROL (UPDATED: FULL FLEXIBILITY)
    // =========================
    public Booking updateStatus(String id, String status, String adminName) {

        Booking booking = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        String current = safe(booking.getStatus());
        String newStatus = status.toUpperCase();

        // ❌ ONLY FINAL STATES ARE LOCKED
        if ("EXPIRED".equals(current) || "COMPLETED".equals(current)) {
            throw new RuntimeException("Final bookings cannot be modified");
        }

        // ✅ ADMIN CAN SWITCH BETWEEN ALL NON-FINAL STATES
        List<String> allowed = List.of("PENDING", "APPROVED", "REJECTED");

        if (!allowed.contains(newStatus)) {
            throw new RuntimeException("Invalid status");
        }

        booking.setStatus(newStatus);
        booking.setApprovedBy(adminName);
        booking.setUpdatedAt(LocalDateTime.now());

        return repo.save(booking);
    }

    // =========================
    // UPDATE (USER SIDE)
    // =========================
    public Booking update(String id, Booking updated, String userName) {

        Booking existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!existing.getUserName().equalsIgnoreCase(userName)) {
            throw new RuntimeException("Unauthorized");
        }

        if ("EXPIRED".equals(existing.getStatus()) ||
            "COMPLETED".equals(existing.getStatus())) {
            throw new RuntimeException("Cannot update finalized booking");
        }

        String resourceId = updated.getResourceId() != null
                ? updated.getResourceId()
                : existing.getResourceId();

        LocalDateTime start = updated.getStartTime() != null
                ? updated.getStartTime()
                : existing.getStartTime();

        LocalDateTime end = updated.getEndTime() != null
                ? updated.getEndTime()
                : existing.getEndTime();

        if (hasConflict(resourceId, start, end, id)) {
            throw new RuntimeException("Slot conflict detected");
        }

        existing.setResourceType(updated.getResourceType());
        existing.setResourceId(resourceId);
        existing.setPurpose(updated.getPurpose());
        existing.setParticipants(updated.getParticipants());
        existing.setStartTime(start);
        existing.setEndTime(end);
        existing.setUpdatedAt(LocalDateTime.now());

        return repo.save(existing);
    }

    // =========================
    // DELETE (USER ONLY)
    // =========================
    public void delete(String id, String userName) {

        Booking existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!existing.getUserName().equalsIgnoreCase(userName)) {
            throw new RuntimeException("Unauthorized");
        }

        if ("APPROVED".equals(existing.getStatus())) {
            throw new RuntimeException("Cannot delete approved booking");
        }

        repo.deleteById(id);
    }

    // =========================
    // VALIDATION
    // =========================
    private void validate(Booking b) {

        if (b.getResourceType() == null || b.getResourceType().isBlank())
            throw new RuntimeException("Resource type required");

        if (b.getResourceId() == null || b.getResourceId().isBlank())
            throw new RuntimeException("Resource ID required");

        if (b.getUserName() == null || b.getUserName().isBlank())
            throw new RuntimeException("User name required");

        if (b.getPurpose() == null || b.getPurpose().isBlank())
            throw new RuntimeException("Purpose required");

        if (b.getParticipants() <= 0)
            throw new RuntimeException("Participants must be > 0");

        if (b.getStartTime() == null || b.getEndTime() == null)
            throw new RuntimeException("Start & End required");

        if (b.getEndTime().isBefore(b.getStartTime()))
            throw new RuntimeException("Invalid time range");
    }
}