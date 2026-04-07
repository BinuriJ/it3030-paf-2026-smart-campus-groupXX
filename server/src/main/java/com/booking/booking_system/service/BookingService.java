package com.booking.booking_system.service;

import com.booking.booking_system.model.Booking;
import com.booking.booking_system.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repository;

    @Autowired
    private NotificationService notificationService;

    public Booking create(Booking booking) {

        List<Booking> existing = repository.findByResourceId(booking.getResourceId());

        for (Booking b : existing) {
            if (booking.getStartTime().isBefore(b.getEndTime()) &&
                    booking.getEndTime().isAfter(b.getStartTime())) {

                throw new RuntimeException("Time slot unavailable");
            }
        }

        Booking saved = repository.save(booking);

        notificationService.save("Booking created for " + booking.getResourceId(), booking.getUserName());

        return saved;
    }

    public List<Booking> getAll() {
        autoCompleteBookings();
        return repository.findAll();
    }

    public Booking updateStatus(String id, String status) {
        Booking b = repository.findById(id).orElseThrow();
        b.setStatus(status);

        notificationService.save("Booking " + status, b.getUserName());

        return repository.save(b);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public List<String> suggest() {
        List<String> list = new ArrayList<>();
        list.add("10:00 - 11:00");
        list.add("12:00 - 01:00");
        return list;
    }

    public void autoCompleteBookings() {

        List<Booking> bookings = repository.findAll();

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        for (Booking b : bookings) {

            boolean pastDate = b.getBookingDate().isBefore(today);

            boolean sameDayPassed = b.getBookingDate().isEqual(today) &&
                    b.getEndTime().isBefore(now);

            if ((pastDate || sameDayPassed) &&
                    !b.getStatus().equals("COMPLETED")) {

                b.setStatus("COMPLETED");
                repository.save(b);
            }
        }
    }
}
