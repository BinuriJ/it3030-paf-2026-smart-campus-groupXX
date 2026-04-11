package com.booking.booking_system.repository;

import com.booking.booking_system.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByTypeAndAvailableTrue(String type);
}