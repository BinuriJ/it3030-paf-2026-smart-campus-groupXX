package com.booking.booking_system.repository;

import com.booking.booking_system.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByBookingDate(String bookingDate);
}