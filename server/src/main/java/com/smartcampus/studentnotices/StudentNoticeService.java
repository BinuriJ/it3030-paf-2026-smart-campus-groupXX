package com.smartcampus.studentnotices;

import com.smartcampus.notices.Notice;
import com.smartcampus.notices.NoticeRepository;
import com.smartcampus.studentnotices.dto.MarkNoticeSeenRequest;
import com.smartcampus.studentnotices.dto.StudentNoticeView;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StudentNoticeService {

    private final NoticeRepository noticeRepository;
    private final StudentNoticeStatusRepository studentNoticeStatusRepository;

    public StudentNoticeService(
        NoticeRepository noticeRepository,
        StudentNoticeStatusRepository studentNoticeStatusRepository
    ) {
        this.noticeRepository = noticeRepository;
        this.studentNoticeStatusRepository = studentNoticeStatusRepository;
    }

    public List<StudentNoticeView> getNoticesForStudent(String studentId) {
        validateStudentId(studentId);

        List<Notice> notices = noticeRepository.findAllByOrderByCreatedAtDesc();
        Map<String, StudentNoticeStatus> statusByNoticeId = studentNoticeStatusRepository.findByStudentId(studentId)
            .stream()
            .collect(Collectors.toMap(StudentNoticeStatus::getNoticeId, Function.identity(), (left, right) -> right));

        return notices.stream()
            .map(notice -> {
                StudentNoticeStatus status = statusByNoticeId.get(notice.getId());
                boolean seen = status != null && status.isSeen();
                Date seenAt = status != null ? status.getSeenAt() : null;

                return new StudentNoticeView(
                    notice.getId(),
                    notice.getTitle(),
                    notice.getMessage(),
                    notice.getTargetGroup(),
                    notice.getCreatedAt(),
                    seen,
                    seenAt
                );
            })
            .toList();
    }

    public long getUnreadCount(String studentId) {
        return getNoticesForStudent(studentId)
            .stream()
            .filter(notice -> !notice.isSeen())
            .count();
    }

    public StudentNoticeView markNoticeAsSeen(MarkNoticeSeenRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        validateStudentId(request.getStudentId());
        validateNoticeId(request.getNoticeId());

        Notice notice = noticeRepository.findById(request.getNoticeId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notice not found"));

        StudentNoticeStatus status = studentNoticeStatusRepository
            .findByStudentIdAndNoticeId(request.getStudentId(), request.getNoticeId())
            .orElseGet(StudentNoticeStatus::new);

        status.setStudentId(request.getStudentId());
        status.setNoticeId(request.getNoticeId());
        status.setSeen(true);
        if (status.getSeenAt() == null) {
            status.setSeenAt(new Date());
        }

        StudentNoticeStatus savedStatus = studentNoticeStatusRepository.save(status);

        return new StudentNoticeView(
            notice.getId(),
            notice.getTitle(),
            notice.getMessage(),
            notice.getTargetGroup(),
            notice.getCreatedAt(),
            true,
            savedStatus.getSeenAt()
        );
    }

    private void validateStudentId(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "studentId is required");
        }
    }

    private void validateNoticeId(String noticeId) {
        if (noticeId == null || noticeId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "noticeId is required");
        }
    }
}
