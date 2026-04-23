package com.smartcampus.studentnotices;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudentNoticeStatusRepository extends MongoRepository<StudentNoticeStatus, String> {

    List<StudentNoticeStatus> findByStudentId(String studentId);

    Optional<StudentNoticeStatus> findByStudentIdAndNoticeId(String studentId, String noticeId);
}
