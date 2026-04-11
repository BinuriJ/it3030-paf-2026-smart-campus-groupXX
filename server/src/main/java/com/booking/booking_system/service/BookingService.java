package com.booking.booking_system.service;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    // =========================
    // AUTO STATUS UPDATE
    // =========================
    @Scheduled(fixedRate = 60000)
    public void updateStatuses() {

        LocalDateTime now = LocalDateTime.now();
        List<Booking> all = repo.findAll();

        for (Booking b : all) {

            if (b.getEndTime() == null) continue;

            if ("PENDING".equals(b.getStatus()) && b.getEndTime().isBefore(now)) {
                b.setStatus("EXPIRED");
            }

            if ("APPROVED".equals(b.getStatus()) && b.getEndTime().isBefore(now)) {
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

            String id = b.getId();
            if (ignoreId != null && id != null && id.equals(ignoreId)) continue;

            String status = b.getStatus();
            if (status == null) continue;

            if (!status.equals("PENDING") && !status.equals("APPROVED")) continue;

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

        if (hasConflict(
                b.getResourceId(),
                b.getStartTime(),
                b.getEndTime(),
                null)) {
            throw new RuntimeException("❌ Slot already booked");
        }

        return repo.save(b);
    }

    // =========================
    // READ
    // =========================
    public List<Booking> getByUser(String userName) {
        if (userName == null) return List.of();
        return repo.findByUserNameIgnoreCase(userName);
    }

    // =========================
    // UPDATE (FULL RECHECK LIKE NEW BOOKING)
    // =========================
    public Booking update(String id, Booking updated, String userName) {

        if (id == null || userName == null) {
            throw new RuntimeException("Invalid request");
        }

        Optional<Booking> optional = repo.findById(id);

        Booking existing = optional
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getUserName() == null ||
                !existing.getUserName().equalsIgnoreCase(userName)) {
            throw new RuntimeException("Unauthorized");
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
            throw new RuntimeException("❌ Slot already booked after update");
        }

        if (updated.getResourceType() != null)
            existing.setResourceType(updated.getResourceType());

        if (updated.getResourceId() != null)
            existing.setResourceId(updated.getResourceId());

        if (updated.getPurpose() != null)
            existing.setPurpose(updated.getPurpose());

        if (updated.getParticipants() > 0)
            existing.setParticipants(updated.getParticipants());

        existing.setStartTime(start);
        existing.setEndTime(end);

        return repo.save(existing);
    }

    // =========================
    // DELETE
    // =========================
    public void delete(String id, String userName) {

        if (id == null || userName == null) {
            throw new RuntimeException("Invalid request");
        }

        Booking existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getUserName() == null ||
                !existing.getUserName().equalsIgnoreCase(userName)) {
            throw new RuntimeException("Unauthorized");
        }

        repo.deleteById(id);
    }

    // =========================
    // VALIDATION
    // =========================
    private void validate(Booking b) {

        if (b == null) throw new RuntimeException("Booking cannot be null");

        if (b.getResourceType() == null || b.getResourceType().isBlank())
            throw new RuntimeException("Resource type required");

        if (b.getResourceId() == null || b.getResourceId().isBlank())
            throw new RuntimeException("Resource ID required");

        if (b.getUserName() == null || b.getUserName().isBlank())
            throw new RuntimeException("User name required");

        if (b.getRole() == null || b.getRole().isBlank())
            throw new RuntimeException("Role required");

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