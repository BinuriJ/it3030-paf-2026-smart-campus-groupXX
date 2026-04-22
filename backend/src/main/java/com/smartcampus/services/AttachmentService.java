package com.smartcampus.services;

import com.smartcampus.entity.Ticket;
import com.smartcampus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

// ATTACHMENT SERVICE
// Handles image file upload logic for maintenance tickets
// Validates file type and count before saving to the server
// Files are stored in the uploads/ folder on the local server
// Filenames are saved in the ticket's attachments list in MongoDB

@Service
@RequiredArgsConstructor
public class AttachmentService {

    // TicketRepository used to fetch and update the ticket in MongoD
    private final TicketRepository ticketRepository;

    private final String uploadDir = "uploads/";// Directory where uploaded images are saved on the server

     // UPLOAD ATTACHMENTS->AttachmentController
         // @param ticketId: MongoDB ID of the ticket to attach images to
    // @param files: list of image files from the multipart form request
    public Ticket uploadAttachments(String ticketId, List<MultipartFile> files) throws IOException {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // max 3 attachments
        if (ticket.getAttachments() != null && ticket.getAttachments().size() + files.size() > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed per ticket");
        }

        // create upload folder if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {// Validate total attachment count does not exceed 3
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            // only allow images
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            // save file with unique name
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // add path to ticket
            ticket.getAttachments().add(filename);
        }

        return ticketRepository.save(ticket);
    }
}