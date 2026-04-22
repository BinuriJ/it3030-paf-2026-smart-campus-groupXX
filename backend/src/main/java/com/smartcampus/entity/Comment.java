package com.smartcampus.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

// COMMENT ENTITY
// Represents a comment on a maintenance ticket in MongoDB

@Data
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String ticketId;      // which ticket this comment belongs to
    private String content;       // the comment text
    private String createdBy;     // user email or ID who wrote it
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}