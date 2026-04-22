package com.smartcampus.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "resources")
public class ResourceBookingModel {

    @Id
    private String id;

    private String name;     // R101
    private String type;     // Room, Lab, Auditorium
    private int capacity;
    private boolean available = true;
}