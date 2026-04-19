package com.smartcampus.notices;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NoticeRepository extends MongoRepository<Notice, String> {

    List<Notice> findAllByOrderByCreatedAtDesc();

    List<Notice> findByTitleContainingIgnoreCaseOrMessageContainingIgnoreCase(String title, String message);
}
