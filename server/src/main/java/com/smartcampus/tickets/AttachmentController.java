package com.smartcampus.tickets;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    // POST /api/tickets/{ticketId}/attachments — upload images (max 3)
    @PostMapping
    public ResponseEntity<Ticket> uploadAttachments(
            @PathVariable String ticketId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        return ResponseEntity.ok(attachmentService.uploadAttachments(ticketId, files));
    }
}