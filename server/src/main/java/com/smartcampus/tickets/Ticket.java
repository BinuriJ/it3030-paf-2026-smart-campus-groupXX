package com.smartcampus.tickets;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
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

    private List<String> attachments;

    @CreatedDate
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}