package com.smartcampus.repository;

import com.smartcampus.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByResourceIdAndDate(Long resourceId, LocalDate date);

    List<TimeSlot> findByResourceId(Long resourceId);

    @Query("SELECT ts FROM TimeSlot ts WHERE ts.resource.id = :resourceId AND ts.date BETWEEN :startDate AND :endDate ORDER BY ts.date, ts.startTime")
    List<TimeSlot> findByResourceIdAndDateRange(@Param("resourceId") Long resourceId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    List<TimeSlot> findByStatus(TimeSlot.SlotStatus status);
}