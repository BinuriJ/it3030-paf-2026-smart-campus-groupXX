package com.smartcampus.notices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // CREATE notice
    @PostMapping
    public Notice createNotice(@RequestBody Notice notice) {
        return noticeService.createNotice(notice);
    }

    // GET all notices
    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeService.getAllNotices();
    }

    @GetMapping("/search")
    public List<Notice> searchNotices(@RequestParam String keyword) {
        return noticeService.searchNotices(keyword);
    }

    @PutMapping("/{id}")
    public Notice updateNotice(@PathVariable String id, @RequestBody Notice notice) {
        return noticeService.updateNotice(id, notice);
    }

    @DeleteMapping("/{id}")
    public void deleteNotice(@PathVariable String id) {
        noticeService.deleteNotice(id);
    }
}
