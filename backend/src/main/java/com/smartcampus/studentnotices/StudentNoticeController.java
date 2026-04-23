package com.smartcampus.studentnotices;

import com.smartcampus.studentnotices.dto.MarkNoticeSeenRequest;
import com.smartcampus.studentnotices.dto.StudentNoticeView;
import com.smartcampus.studentnotices.dto.UnreadNoticeCountResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/notices")
@CrossOrigin
public class StudentNoticeController {

    private final StudentNoticeService studentNoticeService;

    public StudentNoticeController(StudentNoticeService studentNoticeService) {
        this.studentNoticeService = studentNoticeService;
    }

    @GetMapping("/unread-count/{studentId}")
    public UnreadNoticeCountResponse getUnreadCount(@PathVariable String studentId) {
        return new UnreadNoticeCountResponse(studentNoticeService.getUnreadCount(studentId));
    }

    @GetMapping("/{studentId}")
    public List<StudentNoticeView> getNoticesForStudent(@PathVariable String studentId) {
        return studentNoticeService.getNoticesForStudent(studentId);
    }

    @PutMapping("/mark-seen")
    public StudentNoticeView markNoticeAsSeen(@RequestBody MarkNoticeSeenRequest request) {
        return studentNoticeService.markNoticeAsSeen(request);
    }
}
