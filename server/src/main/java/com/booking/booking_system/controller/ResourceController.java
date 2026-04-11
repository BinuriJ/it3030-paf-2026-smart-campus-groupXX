package com.booking.booking_system.controller;

import com.booking.booking_system.model.Resource;
import com.booking.booking_system.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Resource> getAll() {
        return service.getAll();
    }

    @GetMapping("/type/{type}")
    public List<Resource> getByType(@PathVariable String type) {
        return service.getByType(type);
    }

    @PostMapping
    public Resource create(@RequestBody Resource r) {
        return service.save(r);
    }
}