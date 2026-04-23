package com.smartcampus.config;

import java.time.Instant;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import com.smartcampus.user.UserRole;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmailIgnoreCase("123@gmail.com")) {
            User student = new User();
            student.setFullName("Test Student");
            student.setEmail("123@gmail.com");
            student.setPassword(passwordEncoder.encode("password123"));
            student.setRole(UserRole.STUDENT);
            student.setAddress("123 Test Street");
            student.setPhone("0712345678");
            student.setDepartment("IT");
            student.setStudentId("IT123456");
            student.setAcademicYear("Year 3");
            student.setAge(21);
            student.setCreatedAt(Instant.now());
            userRepository.save(student);
            System.out.println("Seeded test student: 123@gmail.com | password: password123");
        }

        if (!userRepository.existsByEmailIgnoreCase("admin@gmail.com")) {
            User admin = new User();
            admin.setFullName("System Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            admin.setAddress("Admin HQ Campus");
            admin.setPhone("0776543210");
            admin.setOrgName("Smart Campus");
            admin.setAdminType("Super Admin");
            admin.setCreatedAt(Instant.now());
            userRepository.save(admin);
            System.out.println("Seeded test admin: admin@gmail.com | password: admin123");
        }
    }
}
