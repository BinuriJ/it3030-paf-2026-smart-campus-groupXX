package com.smartcampus.studentnotices.dto;

public class UnreadNoticeCountResponse {

    private final long count;

    public UnreadNoticeCountResponse(long count) {
        this.count = count;
    }

    public long getCount() {
        return count;
    }
}
