package com.smartcampus.services;

import com.smartcampus.dto.ResourceDto;
import com.smartcampus.dto.TimeSlotDto;
import com.smartcampus.entity.ResourceEntity;
import com.smartcampus.entity.TimeSlot;
import com.smartcampus.exceptions.ResourceNotFoundException;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.TimeSlotRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceService {

    private final ResourceRepository repository;
    private final TimeSlotRepository timeSlotRepository;

    public ResourceService(ResourceRepository repository, TimeSlotRepository timeSlotRepository) {
        this.repository = repository;
        this.timeSlotRepository = timeSlotRepository;
    }

    public List<ResourceDto> findAll(String type, String location, Integer minCapacity) {
        return repository.search(type, location, minCapacity)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ResourceDto findById(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
    }

    public ResourceDto create(ResourceDto dto) {
        ResourceEntity entity = new ResourceEntity(
                dto.getName(),
                dto.getType(),
                dto.getCapacity(),
                dto.getLocation(),
                dto.getAvailabilityWindow(),
                dto.getStatus(),
                dto.getImageUrl(),
                dto.getAvailableFrom(),
                dto.getAvailableTo());

        ResourceEntity savedEntity = repository.save(entity);

        // Automatically create time slots from 8am to 5pm for the date range
        createTimeSlotsForResource(savedEntity);

        return toDto(savedEntity);
    }

    public ResourceDto update(Long id, ResourceDto dto) {
        ResourceEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
        entity.setName(dto.getName());
        entity.setType(dto.getType());
        entity.setCapacity(dto.getCapacity());
        entity.setLocation(dto.getLocation());
        entity.setAvailabilityWindow(dto.getAvailabilityWindow());
        entity.setStatus(dto.getStatus());
        entity.setImageUrl(dto.getImageUrl());
        entity.setAvailableFrom(dto.getAvailableFrom());
        entity.setAvailableTo(dto.getAvailableTo());
        return toDto(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id " + id);
        }
        repository.deleteById(id);
    }

    public List<TimeSlotDto> getTimeSlotsForResource(Long resourceId, LocalDate date) {
        return timeSlotRepository.findByResourceIdAndDate(resourceId, date)
                .stream()
                .map(this::toTimeSlotDto)
                .toList();
    }

    public List<TimeSlotDto> getTimeSlotsForResource(Long resourceId) {
        return timeSlotRepository.findByResourceId(resourceId)
                .stream()
                .map(this::toTimeSlotDto)
                .toList();
    }

    private void createTimeSlotsForResource(ResourceEntity resource) {
        LocalDate currentDate = resource.getAvailableFrom();
        LocalDate endDate = resource.getAvailableTo();

        while (!currentDate.isAfter(endDate)) {
            // Create hourly slots from 8am to 5pm (8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00)
            for (int hour = 8; hour <= 17; hour++) {
                LocalTime startTime = LocalTime.of(hour, 0);
                LocalTime endTime = LocalTime.of(hour + 1, 0);

                TimeSlot timeSlot = new TimeSlot(resource, currentDate, startTime, endTime);
                timeSlotRepository.save(timeSlot);
            }
            currentDate = currentDate.plusDays(1);
        }
    }

    private ResourceDto toDto(ResourceEntity entity) {
        ResourceDto dto = new ResourceDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setType(entity.getType());
        dto.setCapacity(entity.getCapacity());
        dto.setLocation(entity.getLocation());
        dto.setAvailabilityWindow(entity.getAvailabilityWindow());
        dto.setStatus(entity.getStatus());
        dto.setImageUrl(entity.getImageUrl());
        dto.setAvailableFrom(entity.getAvailableFrom());
        dto.setAvailableTo(entity.getAvailableTo());
        return dto;
    }

    private TimeSlotDto toTimeSlotDto(TimeSlot entity) {
        TimeSlotDto dto = new TimeSlotDto();
        dto.setId(entity.getId());
        dto.setResourceId(entity.getResource().getId());
        dto.setDate(entity.getDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setStatus(entity.getStatus().toString());
        dto.setBookedBy(entity.getBookedBy());
        dto.setBookingPurpose(entity.getBookingPurpose());
        return dto;
    }
}