package com.smartcampus.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "resources")
public class ResourceEntity {

    @Id
    private String id;

    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String availabilityWindow;
    private String status;
    private String imageUrl;

    private LocalDate availableFrom;
    private LocalDate availableTo;

    // In Mongo we keep TimeSlots in a separate collection and query them by resourceId
    // to avoid massive document growth or mapping complexities.

    public ResourceEntity() {
    }

    public ResourceEntity(String name, String type, Integer capacity, String location,
                         String availabilityWindow, String status, String imageUrl,
                         LocalDate availableFrom, LocalDate availableTo) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.availabilityWindow = availabilityWindow;
        this.status = status;
        this.imageUrl = imageUrl;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAvailabilityWindow() { return availabilityWindow; }
    public void setAvailabilityWindow(String availabilityWindow) { this.availabilityWindow = availabilityWindow; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDate getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDate availableFrom) { this.availableFrom = availableFrom; }

    public LocalDate getAvailableTo() { return availableTo; }
    public void setAvailableTo(LocalDate availableTo) { this.availableTo = availableTo; }
}