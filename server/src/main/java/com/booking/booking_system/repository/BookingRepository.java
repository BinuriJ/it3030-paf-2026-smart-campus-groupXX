package com.booking.booking_system.repository;

import com.booking.booking_system.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // =========================
    // GET BOOKINGS BY USER
    // =========================
    List<Booking> findByUserNameIgnoreCase(String userName);

    // =========================
    // GET BOOKINGS BY RESOURCE (FOR CONFLICT CHECK)
    // =========================
    List<Booking> findByResourceId(String resourceId);

    // =========================
    // OWNERSHIP CHECK (SAFE UPDATE/DELETE)
    // =========================
    boolean existsByIdAndUserNameIgnoreCase(String id, String userName);
}