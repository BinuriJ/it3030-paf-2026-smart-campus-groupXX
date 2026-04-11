package com.booking.booking_system.model;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    // =========================
    // RESOURCE DETAILS
    // =========================
    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    // =========================
    // USER DETAILS
    // =========================
    @NotBlank(message = "User name is required")
    private String userName;

    @NotBlank(message = "Role is required")
    private String role;

    // =========================
    // BOOKING DETAILS
    // =========================
    @NotBlank(message = "Purpose is required")
    private String purpose;

    @Min(value = 1, message = "Participants must be at least 1")
    private int participants;

    // =========================
    // TIME SLOTS
    // =========================
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    // =========================
    // STATUS (USED FOR AVAILABILITY LOGIC)
    // =========================
    private String status = "PENDING";

    // =========================
    // OPTIONAL (RECOMMENDED FOR FUTURE UPGRADE)
    // =========================

    // helps if you later add admin approval workflow
    private String approvedBy;

    private LocalDateTime createdAt = LocalDateTime.now();
}