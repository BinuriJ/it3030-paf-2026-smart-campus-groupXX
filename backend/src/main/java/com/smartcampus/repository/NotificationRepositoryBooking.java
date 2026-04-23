package com.smartcampus.repository;

import com.smartcampus.entity.NotificationBookingModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepositoryBooking extends MongoRepository<NotificationBookingModel, String> {
}