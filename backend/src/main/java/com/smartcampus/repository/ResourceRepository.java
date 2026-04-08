package com.smartcampus.repository;

import com.smartcampus.entity.ResourceEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResourceRepository extends JpaRepository<ResourceEntity, Long> {

    @Query("SELECT r FROM ResourceEntity r " +
           "WHERE (:type IS NULL OR LOWER(r.type) LIKE LOWER(CONCAT('%', :type, '%'))) " +
           "AND (:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:minCapacity IS NULL OR r.capacity >= :minCapacity) " +
           "ORDER BY r.name ASC")
    List<ResourceEntity> search(@Param("type") String type,
                                @Param("location") String location,
                                @Param("minCapacity") Integer minCapacity);
}