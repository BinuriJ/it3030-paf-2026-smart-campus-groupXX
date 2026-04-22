package com.smartcampus.repository;

import com.smartcampus.entity.BookingModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<BookingModel, String> {

    List<BookingModel> findByUserNameIgnoreCase(String userName);

    List<BookingModel> findByResourceId(String resourceId);

    // 🔥 used for auto-status updates
    List<BookingModel> findByEndTimeBeforeAndStatusIn(
            LocalDateTime time,
            List<String> status
    );
}