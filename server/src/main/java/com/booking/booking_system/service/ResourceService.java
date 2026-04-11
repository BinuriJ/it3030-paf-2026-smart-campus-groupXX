package com.booking.booking_system.service;

import com.booking.booking_system.model.Resource;
import com.booking.booking_system.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ResourceService {

    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) {
        this.repo = repo;
    }

    // =========================
    // GET ALL RESOURCES
    // =========================
    public List<Resource> getAll() {
        return repo.findAll();
    }

    // =========================
    // FILTER BY TYPE
    // =========================
    public List<Resource> getByType(String type) {

        if (type == null || type.isBlank()) {
            return List.of();
        }

        return repo.findByTypeAndAvailableTrue(type);
    }

    // =========================
    // SAVE RESOURCE (SAFE)
    // =========================
    public Resource save(Resource r) {

        if (r == null) {
            throw new IllegalArgumentException("Resource cannot be null");
        }

        // optional safety checks
        Objects.requireNonNull(r.getType(), "Resource type required");

        return repo.save(r);
    }
}