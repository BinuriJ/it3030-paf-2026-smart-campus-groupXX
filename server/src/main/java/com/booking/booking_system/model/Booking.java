package com.booking.booking_system.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String resourceType;   // Lab, Room, etc.
    private String resourceId;      // L202, R101

    private String userName;        // u1002
    private String role;            // LECTURER / STUDENT

    private String purpose;
    private int participants;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status = "PENDING";

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}