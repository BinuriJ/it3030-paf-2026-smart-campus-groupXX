package com.smartcampus.controllers;

import com.smartcampus.dto.ResourceDto;
import com.smartcampus.dto.TimeSlotDto;
import com.smartcampus.services.ResourceService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resources")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ResourceController {

    private final ResourceService service;
    private static final String UPLOAD_DIR = "uploads/";

    public ResourceController(ResourceService service) {
        this.service = service;
        // Create uploads directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @GetMapping
    public ResponseEntity<List<ResourceDto>> getResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity) {
        return ResponseEntity.ok(service.findAll(type, location, minCapacity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getResource(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ResourceDto> createResource(@Valid @RequestBody ResourceDto dto) {
        ResourceDto created = service.create(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file to uploads directory
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL path
            String imageUrl = "/files/" + filename;
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDto> updateResource(@PathVariable Long id, @Valid @RequestBody ResourceDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Time slot endpoints
    @GetMapping("/{resourceId}/slots")
    public ResponseEntity<List<TimeSlotDto>> getTimeSlotsForResource(
            @PathVariable Long resourceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return ResponseEntity.ok(service.getTimeSlotsForResource(resourceId, date));
        } else {
            return ResponseEntity.ok(service.getTimeSlotsForResource(resourceId));
        }
    }
}