package com.smartcampus.tickets;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    private String status;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Contact details are required")
    private String contactDetails;

    private String createdBy;
    private String assignedTo;
    private String rejectionReason;
    private String resolutionNotes;

    private List<String> attachments = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;
    private Long timeToFirstResponseMinutes;
    private Long timeToResolutionMinutes;
}