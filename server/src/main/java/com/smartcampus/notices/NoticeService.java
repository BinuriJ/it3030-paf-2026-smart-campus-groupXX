package com.smartcampus.notices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcampus.notifications.Notification;
import com.smartcampus.notifications.NotificationService;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private NotificationService notificationService;

    // CREATE notice + trigger notification
    public Notice createNotice(Notice notice) {

        Notice savedNotice = noticeRepository.save(notice);

        // 🔔 CREATE NOTIFICATION
        Notification notification = new Notification(
                "123", // TEMP user (we fix later)
                "New Notice: " + notice.getTitle(),
                "NOTICE"
        );

        notificationService.createNotification(notification);

        return savedNotice;
    }

    // GET all notices
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }
}