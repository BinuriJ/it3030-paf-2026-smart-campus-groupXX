package com.smartcampus.tickets;

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

    private String title;
    private String category;
    private String description;
    private String priority;
    private String status;
    private String location;
    private String contactDetails;

    private String createdBy;
    private String assignedTo;

    private String rejectionReason;
    private String resolutionNotes;

    private List<String> attachments = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // --- Service Level Timer fields ---
    private LocalDateTime firstResponseAt;    // when status first changed from OPEN
    private LocalDateTime resolvedAt;         // when status changed to RESOLVED/CLOSED

    private Long timeToFirstResponseMinutes;  // calculated: firstResponseAt - createdAt
    private Long timeToResolutionMinutes;     // calculated: resolvedAt - createdAt
}