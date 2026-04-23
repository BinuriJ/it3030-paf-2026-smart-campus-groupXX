package com.smartcampus.repository;

import com.smartcampus.entity.ResourceEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResourceRepository extends MongoRepository<ResourceEntity, String> {
}