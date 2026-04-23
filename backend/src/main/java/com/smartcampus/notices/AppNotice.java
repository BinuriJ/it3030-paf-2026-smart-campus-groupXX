package com.smartcampus.notices;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "notices")
public class AppNotice {

    @Id
    @JsonProperty("_id")
    private String id;

    private String title;
    private String message;
    private String targetGroup; // ALL / COURSE_A / etc
    private Date createdAt;

    public AppNotice() {}

    public AppNotice(String title, String message, String targetGroup) {
        this.title = title;
        this.message = message;
        this.targetGroup = targetGroup;
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTargetGroup() { return targetGroup; }
    public void setTargetGroup(String targetGroup) { this.targetGroup = targetGroup; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
