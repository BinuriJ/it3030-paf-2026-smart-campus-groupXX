package com.smartcampus.repository;

import com.smartcampus.entity.ResourceBookingModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepositoryBooking extends MongoRepository<ResourceBookingModel, String> {

    List<ResourceBookingModel> findByTypeAndAvailableTrue(String type);
}