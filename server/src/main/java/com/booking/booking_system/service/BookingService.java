package com.booking.booking_system.service;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    // =========================
    // 🔥 CHECK CONFLICT (CORE LOGIC)
    // =========================
    private boolean hasConflict(String resourceId,
                                LocalDateTime start,
                                LocalDateTime end,
                                String ignoreId) {

        List<Booking> bookings = repo.findByResourceId(resourceId);

        for (Booking b : bookings) {

            // skip current booking during update
            if (ignoreId != null && b.getId().equals(ignoreId)) {
                continue;
            }

            // only active bookings block slots
            if (!("PENDING".equals(b.getStatus()) || "APPROVED".equals(b.getStatus()))) {
                continue;
            }

            // 🔥 TIME OVERLAP CHECK
            boolean overlap =
                    start.isBefore(b.getEndTime()) &&
                    end.isAfter(b.getStartTime());

            if (overlap) {
                return true;
            }
        }

        return false;
    }

    // =========================
    // CREATE (BLOCK DOUBLE BOOKING)
    // =========================
    public Booking save(Booking b) {

        validate(b);

        if (hasConflict(b.getResourceId(),
                b.getStartTime(),
                b.getEndTime(),
                null)) {

            throw new RuntimeException("❌ This class/resource is already booked for selected time slot");
        }

        return repo.save(b);
    }

    // =========================
    // READ
    // =========================
    public List<Booking> getByUser(String userName) {
        return repo.findByUserNameIgnoreCase(userName);
    }

    // =========================
    // UPDATE (RECHECK CONFLICT)
    // =========================
    public Booking update(String id, Booking updated, String userName) {

        Booking existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!existing.getUserName().equalsIgnoreCase(userName)) {
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
            throw new RuntimeException("❌ Time slot already booked for this class/resource");
        }

        if (updated.getResourceType() != null)
            existing.setResourceType(updated.getResourceType());

        if (updated.getResourceId() != null)
            existing.setResourceId(updated.getResourceId());

        if (updated.getPurpose() != null)
            existing.setPurpose(updated.getPurpose());

        if (updated.getParticipants() > 0)
            existing.setParticipants(updated.getParticipants());

        if (updated.getStartTime() != null)
            existing.setStartTime(updated.getStartTime());

        if (updated.getEndTime() != null)
            existing.setEndTime(updated.getEndTime());

        return repo.save(existing);
    }

    // =========================
    // DELETE
    // =========================
    public void delete(String id, String userName) {

        Booking existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!existing.getUserName().equalsIgnoreCase(userName)) {
            throw new RuntimeException("Unauthorized");
        }

        repo.deleteById(id);
    }

    // =========================
    // VALIDATION METHOD
    // =========================
    private void validate(Booking b) {

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
            throw new RuntimeException("Start & End time required");

        if (b.getEndTime().isBefore(b.getStartTime()))
            throw new RuntimeException("End time cannot be before start time");
    }
}