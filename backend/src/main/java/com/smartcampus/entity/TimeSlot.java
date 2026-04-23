package com.smartcampus.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "time_slots")
public class TimeSlot {

    @Id
    private String id;

    private String resourceId;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private SlotStatus status;

    private String bookedBy;
    private String bookingPurpose;

    public enum SlotStatus {
        AVAILABLE, BOOKED, MAINTENANCE, UNAVAILABLE
    }

    public TimeSlot() {}

    public TimeSlot(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        this.resourceId = resourceId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = SlotStatus.AVAILABLE;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public SlotStatus getStatus() { return status; }
    public void setStatus(SlotStatus status) { this.status = status; }

    public String getBookedBy() { return bookedBy; }
    public void setBookedBy(String bookedBy) { this.bookedBy = bookedBy; }

    public String getBookingPurpose() { return bookingPurpose; }
    public void setBookingPurpose(String bookingPurpose) { this.bookingPurpose = bookingPurpose; }
}