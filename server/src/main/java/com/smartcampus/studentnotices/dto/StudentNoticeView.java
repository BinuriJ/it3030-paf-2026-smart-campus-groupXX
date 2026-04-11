package com.smartcampus.studentnotices.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class StudentNoticeView {

    @JsonProperty("_id")
    private final String id;
    private final String title;
    private final String message;
    private final String description;
    private final String targetGroup;
    private final Date createdAt;
    private final boolean seen;
    private final Date seenAt;

    public StudentNoticeView(
        String id,
        String title,
        String message,
        String targetGroup,
        Date createdAt,
        boolean seen,
        Date seenAt
    ) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.description = message;
        this.targetGroup = targetGroup;
        this.createdAt = createdAt;
        this.seen = seen;
        this.seenAt = seenAt;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getDescription() {
        return description;
    }

    public String getTargetGroup() {
        return targetGroup;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public boolean isSeen() {
        return seen;
    }

    public Date getSeenAt() {
        return seenAt;
    }
}
