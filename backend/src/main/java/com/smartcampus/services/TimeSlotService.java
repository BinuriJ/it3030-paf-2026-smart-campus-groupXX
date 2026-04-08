package com.smartcampus.services;

import com.smartcampus.dto.TimeSlotDto;
import com.smartcampus.entity.TimeSlot;
import com.smartcampus.exceptions.ResourceNotFoundException;
import com.smartcampus.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TimeSlotService {

    private final TimeSlotRepository repository;

    public TimeSlotService(TimeSlotRepository repository) {
        this.repository = repository;
    }

    public List<TimeSlotDto> findAll() {
        return repository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public TimeSlotDto findById(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found with id " + id));
    }

    public TimeSlotDto bookSlot(Long slotId, String studentName, String purpose) {
        TimeSlot slot = repository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found with id " + slotId));

        if (slot.getStatus() != TimeSlot.SlotStatus.AVAILABLE) {
            throw new IllegalStateException("Time slot is not available for booking");
        }

        slot.setStatus(TimeSlot.SlotStatus.BOOKED);
        slot.setBookedBy(studentName);
        slot.setBookingPurpose(purpose);

        return toDto(repository.save(slot));
    }

    public TimeSlotDto cancelBooking(Long slotId) {
        TimeSlot slot = repository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found with id " + slotId));

        if (slot.getStatus() != TimeSlot.SlotStatus.BOOKED) {
            throw new IllegalStateException("Time slot is not booked");
        }

        slot.setStatus(TimeSlot.SlotStatus.AVAILABLE);
        slot.setBookedBy(null);
        slot.setBookingPurpose(null);

        return toDto(repository.save(slot));
    }

    public TimeSlotDto updateSlotStatus(Long slotId, TimeSlot.SlotStatus status) {
        TimeSlot slot = repository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found with id " + slotId));

        slot.setStatus(status);
        return toDto(repository.save(slot));
    }

    public List<TimeSlotDto> findAvailableSlots() {
        return repository.findByStatus(TimeSlot.SlotStatus.AVAILABLE).stream()
                .map(this::toDto)
                .toList();
    }

    public List<TimeSlotDto> findBookedSlots() {
        return repository.findByStatus(TimeSlot.SlotStatus.BOOKED).stream()
                .map(this::toDto)
                .toList();
    }

    private TimeSlotDto toDto(TimeSlot entity) {
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