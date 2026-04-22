package com.smartcampus.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots")
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private ResourceEntity resource;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;

    private String bookedBy;
    private String bookingPurpose;

    public enum SlotStatus {
        AVAILABLE, BOOKED, MAINTENANCE, UNAVAILABLE
    }

    public TimeSlot() {}

    public TimeSlot(ResourceEntity resource, LocalDate date, LocalTime startTime, LocalTime endTime) {
        this.resource = resource;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = SlotStatus.AVAILABLE;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ResourceEntity getResource() { return resource; }
    public void setResource(ResourceEntity resource) { this.resource = resource; }

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