package com.smartcampus.services;

import com.smartcampus.entity.BookingModel;
import com.smartcampus.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class BookingStatusScheduler {

    private final BookingRepository repo;

    public BookingStatusScheduler(BookingRepository repo) {
        this.repo = repo;
    }

    // =========================
    // RUN EVERY 1 MINUTE
    // =========================
    @Scheduled(fixedRate = 60000)
    public void updateStatuses() {

        LocalDateTime now = LocalDateTime.now();

        List<BookingModel> all = repo.findAll();

        List<BookingModel> toUpdate = new ArrayList<>();

        for (BookingModel b : all) {

            if (b.getEndTime() == null || b.getStatus() == null) {
                continue;
            }

            // =========================
            // PENDING → EXPIRED
            // =========================
            if ("PENDING".equals(b.getStatus())
                    && b.getEndTime().isBefore(now)) {

                b.setStatus("EXPIRED");
                toUpdate.add(b);
            }

            // =========================
            // APPROVED → COMPLETED
            // =========================
            if ("APPROVED".equals(b.getStatus())
                    && b.getEndTime().isBefore(now)) {

                b.setStatus("COMPLETED");
                toUpdate.add(b);
            }
        }

        // =========================
        // SINGLE BATCH SAVE (OPTIMIZED)
        // =========================
        if (!toUpdate.isEmpty()) {
            repo.saveAll(toUpdate);
        }
    }
}