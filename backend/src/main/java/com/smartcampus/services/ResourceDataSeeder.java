package com.smartcampus.services;

import com.smartcampus.entity.ResourceEntity;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class ResourceDataSeeder implements CommandLineRunner {

    private final ResourceRepository repository;

    public ResourceDataSeeder(ResourceRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate nextMonth = today.plusMonths(1);

        repository.save(new ResourceEntity(
                "Lecture Hall A1",
                "Lecture Hall",
                120,
                "Engineering Block",
                "08:00-18:00",
                "ACTIVE",
                "/images/lecture-hall.svg",
                today,
                nextMonth));
        repository.save(new ResourceEntity(
                "Innovation Lab 2",
                "Lab",
                36,
                "Science Wing",
                "09:00-17:00",
                "ACTIVE",
                "/images/lab.svg",
                today,
                nextMonth));
        repository.save(new ResourceEntity(
                "Portable Projector P-07",
                "Equipment",
                1,
                "Media Centre",
                "08:30-16:30",
                "OUT_OF_SERVICE",
                "/images/projector.svg",
                today,
                nextMonth));
        repository.save(new ResourceEntity(
                "Meeting Room M4",
                "Meeting Room",
                12,
                "Administration Building",
                "08:00-20:00",
                "ACTIVE",
                "/images/meeting-room.svg",
                today,
                nextMonth));
    }
}