package com.smartcampus.notifications;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<AppNotification, String> {

    List<AppNotification> findByUserId(String userId);

}
