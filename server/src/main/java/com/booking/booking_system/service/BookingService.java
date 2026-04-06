package com.booking.booking_system.service;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repo;

    public Booking createBooking(Booking booking) {

        List<Booking> existing = repo.findByBookingDate(booking.getBookingDate());

        for (Booking b : existing) {
            if (b.getStartTime().equals(booking.getStartTime())) {
                throw new RuntimeException("Time slot already booked! Try another time.");
            }
        }

        return repo.save(booking);
    }

    public List<Booking> getAll() {
        return repo.findAll();
    }

    public Booking update(String id, Booking newBooking) {
        newBooking.setId(id);
        return repo.save(newBooking);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}