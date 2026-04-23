package com.smartcampus.repository;

import com.smartcampus.entity.TimeSlot;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface TimeSlotRepository extends MongoRepository<TimeSlot, String> {
    List<TimeSlot> findByResourceIdAndDate(String resourceId, LocalDate date);
    List<TimeSlot> findByResourceId(String resourceId);
    List<TimeSlot> findByStatus(TimeSlot.SlotStatus status);
}