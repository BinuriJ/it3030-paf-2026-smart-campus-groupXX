package com.smartcampus.notices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin
public class NoticeAdminController {

    @Autowired
    private NoticeAdminService noticeService;

    // CREATE notice
    @PostMapping
    public AppNotice createNotice(@RequestBody AppNotice notice) {
        return noticeService.createNotice(notice);
    }

    // GET all notices
    @GetMapping
    public List<AppNotice> getAllNotices() {
        return noticeService.getAllNotices();
    }

    @GetMapping("/search")
    public List<AppNotice> searchNotices(@RequestParam String keyword) {
        return noticeService.searchNotices(keyword);
    }

    @PutMapping("/{id}")
    public AppNotice updateNotice(@PathVariable String id, @RequestBody AppNotice notice) {
        return noticeService.updateNotice(id, notice);
    }

    @DeleteMapping("/{id}")
    public void deleteNotice(@PathVariable String id) {
        noticeService.deleteNotice(id);
    }
}
