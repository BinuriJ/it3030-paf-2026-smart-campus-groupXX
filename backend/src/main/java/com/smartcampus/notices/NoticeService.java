package com.smartcampus.notices;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

    // import com.smartcampus.notifications.Notification;
    // import com.smartcampus.notifications.NotificationService;
import com.smartcampus.user.UserRepository;
import com.smartcampus.email.EmailService;
import com.smartcampus.user.User;


import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    // @Autowired
    // private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    // CREATE notice + trigger notification
    public Notice createNotice(Notice notice) {

        System.out.println("CREATE NOTICE METHOD CALLED");
        
        if (notice.getCreatedAt() == null) {
            notice.setCreatedAt(new Date());
        }
        if (notice.getTargetGroup() == null || notice.getTargetGroup().isBlank()) {
            notice.setTargetGroup("ALL");
        }

        Notice savedNotice = noticeRepository.save(notice);

        // 🔔 CREATE NOTIFICATION
        /*
        Notification notification = new Notification(
                "123", // TEMP user (we fix later)
                "New Notice: " + notice.getTitle(),
                "NOTICE"
        );

        notificationService.createNotification(notification);
        */

        // 📧 SEND EMAIL TO ALL STUDENTS
try {

    System.out.println("EMAIL BLOCK RUNNING");

    List<User> students = userRepository.findByRole("STUDENT");

    for (User student : students) {
        System.out.println("Sending email to: " + student.getEmail());
        if (student.getEmail() != null) {
            emailService.sendNoticeEmail(
                    student.getEmail(),
                    savedNotice.getTitle(),
                    savedNotice.getMessage()
            );
        }
    }
} catch (Exception e) {
    System.out.println("Email sending failed: " + e.getMessage());
}

        return savedNotice;
    }

    // GET all notices
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    public List<Notice> searchNotices(String keyword) {
        return noticeRepository
                .findByTitleContainingIgnoreCaseOrMessageContainingIgnoreCase(keyword, keyword);
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
