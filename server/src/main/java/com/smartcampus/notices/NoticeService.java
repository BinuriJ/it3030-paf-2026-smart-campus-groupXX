package com.smartcampus.notices;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        if (notice.getCreatedAt() == null) {
            notice.setCreatedAt(new Date());
        }
        if (notice.getTargetGroup() == null || notice.getTargetGroup().isBlank()) {
            notice.setTargetGroup("ALL");
        }

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

    public Notice updateNotice(String id, Notice updatedNotice) {
        Notice existingNotice = noticeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notice not found"));

        existingNotice.setTitle(updatedNotice.getTitle());
        existingNotice.setMessage(updatedNotice.getMessage());
        if (updatedNotice.getTargetGroup() != null && !updatedNotice.getTargetGroup().isBlank()) {
            existingNotice.setTargetGroup(updatedNotice.getTargetGroup());
        }

        return noticeRepository.save(existingNotice);
    }

    public void deleteNotice(String id) {
        if (!noticeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Notice not found");
        }
        noticeRepository.deleteById(id);
    }
}
