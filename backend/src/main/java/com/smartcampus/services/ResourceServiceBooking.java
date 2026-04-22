package com.smartcampus.services;

import com.smartcampus.entity.ResourceBookingModel;
import com.smartcampus.repository.ResourceRepositoryBooking;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ResourceServiceBooking {

    private final ResourceRepositoryBooking repo;

    public ResourceServiceBooking(ResourceRepositoryBooking repo) {
        this.repo = repo;
    }

    // =========================
    // GET ALL RESOURCES
    // =========================
    public List<ResourceBookingModel> getAll() {
        return repo.findAll();
    }

    // =========================
    // FILTER BY TYPE
    // =========================
    public List<ResourceBookingModel> getByType(String type) {

        if (type == null || type.isBlank()) {
            return List.of();
        }

        return repo.findByTypeAndAvailableTrue(type);
    }

    // =========================
    // SAVE RESOURCE (SAFE)
    // =========================
    public ResourceBookingModel save(ResourceBookingModel r) {

        if (r == null) {
            throw new IllegalArgumentException("Resource cannot be null");
        }

        // optional safety checks
        Objects.requireNonNull(r.getType(), "Resource type required");

        return repo.save(r);
    }
}