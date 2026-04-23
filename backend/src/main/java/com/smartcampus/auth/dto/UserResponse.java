package com.smartcampus.auth.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRole;

public record UserResponse(
    @JsonProperty("_id") String id,
    String fullName,
    String email,
    UserRole role,
    String address,
    String phone,
    String department,
    String studentId,
    String academicYear,
    Integer age,
    String orgName,
    String adminType,
    String staffId,
    String specialization,
    Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            user.getAddress(),
            user.getPhone(),
            user.getDepartment(),
            user.getStudentId(),
            user.getAcademicYear(),
            user.getAge(),
            user.getOrgName(),
            user.getAdminType(),
            user.getStaffId(),
            user.getSpecialization(),
            user.getCreatedAt()
        );
    }
}
