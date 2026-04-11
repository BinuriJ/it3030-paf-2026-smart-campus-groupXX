package com.booking.booking_system.repository;

import com.booking.booking_system.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserNameIgnoreCase(String userName);

    List<Booking> findByResourceId(String resourceId);

    // 🔥 used for auto-status updates
    List<Booking> findByEndTimeBeforeAndStatusIn(
            LocalDateTime time,
            List<String> status
    );
}