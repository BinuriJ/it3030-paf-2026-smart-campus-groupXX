package com.booking.booking_system.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String name;     // R101
    private String type;     // Room, Lab, Auditorium
    private int capacity;
    private boolean available = true;
}