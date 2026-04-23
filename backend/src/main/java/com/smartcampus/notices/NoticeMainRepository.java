package com.smartcampus.notices;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NoticeMainRepository extends MongoRepository<AppNotice, String> {

    List<AppNotice> findAllByOrderByCreatedAtDesc();

    List<AppNotice> findByTitleContainingIgnoreCaseOrMessageContainingIgnoreCase(String title, String message);
}
