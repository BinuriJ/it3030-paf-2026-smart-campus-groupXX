package com.smartcampus.auth;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.auth.dto.AuthResponse;
import com.smartcampus.auth.dto.LoginRequest;
import com.smartcampus.auth.dto.RegisterRequest;
import com.smartcampus.auth.dto.UserResponse;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import com.smartcampus.user.UserRole;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        UserRole role = parseRole(request.getRole());
        validateCommonFields(request.getFullName(), request.getEmail(), request.getPassword(), request.getAddress(), request.getPhone());
        validateRoleSpecificFields(role, request);

        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setAddress(request.getAddress().trim());
        user.setPhone(request.getPhone().trim());
        user.setDepartment(trimToNull(request.getDepartment()));
        user.setStudentId(trimToNull(request.getStudentId()));
        user.setAcademicYear(trimToNull(request.getAcademicYear()));
        user.setAge(request.getAge());
        user.setOrgName(trimToNull(request.getOrgName()));
        user.setAdminType(trimToNull(request.getAdminType()));
        user.setStaffId(trimToNull(request.getStaffId()));
        user.setSpecialization(trimToNull(request.getSpecialization()));
        user.setCreatedAt(Instant.now());

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        requireText(request.getEmail(), "Email is required");
        requireText(request.getPassword(), "Password is required");

        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return UserResponse.from(user);
    }

    public String handleGoogleLogin(String email, String fullName) {
        requireText(email, "Google account email is missing");

        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
            .orElseGet(() -> createGoogleUser(normalizedEmail, fullName));

        return jwtUtil.generateToken(user);
    }

    private User createGoogleUser(String email, String fullName) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(trimToNull(fullName) != null ? fullName.trim() : email.substring(0, email.indexOf("@")));
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole(UserRole.STUDENT);
        user.setCreatedAt(Instant.now());
        return userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return new AuthResponse(jwtUtil.generateToken(user), UserResponse.from(user));
    }

    private void validateCommonFields(String fullName, String email, String password, String address, String phone) {
        requireText(fullName, "Full name is required");
        requireText(email, "Email is required");
        requireText(password, "Password is required");
        requireText(address, "Address is required");
        requireText(phone, "Phone is required");
    }

    private void validateRoleSpecificFields(UserRole role, RegisterRequest request) {
        switch (role) {
            case STUDENT -> {
                requireText(request.getDepartment(), "Department is required for students");
                requireText(request.getStudentId(), "Student ID is required for students");
                requireText(request.getAcademicYear(), "Academic year is required for students");
                if (request.getAge() == null || request.getAge() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Age is required for students");
                }
            }
            case ADMIN -> {
                requireText(request.getOrgName(), "Organization name is required for admins");
                requireText(request.getAdminType(), "Admin type is required for admins");
            }
            case LECTURER -> {
                requireText(request.getDepartment(), "Department is required for lecturers");
                requireText(request.getStaffId(), "Staff ID is required for lecturers");
                requireText(request.getSpecialization(), "Specialization is required for lecturers");
            }
        }
    }

    private UserRole parseRole(String role) {
        requireText(role, "Role is required");
        try {
            return UserRole.valueOf(role.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private void requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}
