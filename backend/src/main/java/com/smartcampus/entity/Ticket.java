package com.smartcampus.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// TICKET ENTITY-> Represents a maintenance/incident ticket in MongoDB
// Maps to the "tickets" collection in the smartcampus database

@Data
@Document(collection = "tickets")
public class Ticket {

    @Id   // MongoDB auto-generated unique document ID
    private String id;

    // Title of the ticket - what the issue is -> @NotBlank triggers backend validation - cannot be empty or whitespace
    @NotBlank(message = "Title is required")
    private String title;

    // Category of the issue - EQUIPMENT, ELECTRICAL, PLUMBING, FURNITURE, IT, OTHER 
    @NotBlank(message = "Category is required")
    private String category;

    // Detailed description of the issue - optional field
    private String description;

    // Priority level - LOW, MEDIUM, HIGH
    @NotBlank(message = "Priority is required")
    private String priority;

    // Current status of the ticket
    private String status;

    // Where the issue is located
    @NotBlank(message = "Location is required")
    private String location;

    // Contact email of the person who reported the issue
    @NotBlank(message = "Contact details are required")
    private String contactDetails;

    private String createdBy;// Email of the student/lecturer who created the ticket
    private String assignedTo;// Email of the technician assigned to fix the issue
    private String rejectionReason;// Reason provided by admin when rejecting a ticket
    private String resolutionNotes;// Notes written by technician explaining how the issue was resolved

    // List of uploaded image filenames stored in uploads/ folder
    private List<String> attachments = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;// Timestamp when the ticket was created
    private LocalDateTime updatedAt;// Timestamp of the last update to the ticket
    // SERVICE LEVEL TIMER FIELDS
    private LocalDateTime firstResponseAt;// Timestamp when the ticket first moved out of OPEN status
    private LocalDateTime resolvedAt;// Timestamp when the ticket was marked RESOLVED or CLOSED
    private Long timeToFirstResponseMinutes;// Minutes between createdAt and firstResponseAt
    private Long timeToResolutionMinutes;// Minutes between createdAt and firstResponseAt
}