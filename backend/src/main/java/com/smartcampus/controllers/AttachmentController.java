package com.smartcampus.controllers;

import com.smartcampus.entity.Ticket;
import com.smartcampus.services.AttachmentService;
import com.smartcampus.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

// ATTACHMENT CONTROLLER-> Handles image file uploads for maintenance tickets

@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments") 
@RequiredArgsConstructor
public class AttachmentController {

    // AttachmentService handles the file validation and storage logic
    private final AttachmentService attachmentService;

    // POST /api/tickets/{ticketId}/attachments — upload images (max 3)
    // @PathVariable ticketId: the MongoDB ID of the ticket
    // @RequestParam files: list of image files from the multipart form
    @PostMapping
    public ResponseEntity<Ticket> uploadAttachments(
            @PathVariable String ticketId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        return ResponseEntity.ok(attachmentService.uploadAttachments(ticketId, files));
    }
}