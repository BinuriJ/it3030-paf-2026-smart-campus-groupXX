package com.smartcampus.controllers;

import com.smartcampus.entity.ResourceBookingModel;
import com.smartcampus.services.ResourceServiceBooking;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resource-booking")
@CrossOrigin
public class ResourceControllerBooking {

    private final ResourceServiceBooking service;

    public ResourceControllerBooking(ResourceServiceBooking service) {
        this.service = service;
    }

    @GetMapping
    public List<ResourceBookingModel> getAll() {
        return service.getAll();
    }

    @GetMapping("/type/{type}")
    public List<ResourceBookingModel> getByType(@PathVariable String type) {
        return service.getByType(type);
    }

    @PostMapping
    public ResourceBookingModel create(@RequestBody ResourceBookingModel r) {
        return service.save(r);
    }
}