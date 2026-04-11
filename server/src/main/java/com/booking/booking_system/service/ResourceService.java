package com.booking.booking_system.service;

import com.booking.booking_system.model.Resource;
import com.booking.booking_system.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) {
        this.repo = repo;
    }

    public List<Resource> getAll() {
        return repo.findAll();
    }

    public List<Resource> getByType(String type) {
        return repo.findByTypeAndAvailableTrue(type);
    }

    public Resource save(Resource r) {
        return repo.save(r);
    }
}