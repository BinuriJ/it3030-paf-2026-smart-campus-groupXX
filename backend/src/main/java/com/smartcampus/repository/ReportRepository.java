package com.smartcampus.repository;

import com.smartcampus.entity.ReportEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReportRepository extends MongoRepository<ReportEntity, String> {
    List<ReportEntity> findByResourceId(String resourceId);
    List<ReportEntity> findByStatus(String status);
}