package com.booking.booking_system.service;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    public Booking save(Booking b) {
        return repo.save(b);
    }

    public List<Booking> getAll() {
        return repo.findAll();
    }

    public List<Booking> getByUser(String userName) {
        return repo.findByUserName(userName);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}