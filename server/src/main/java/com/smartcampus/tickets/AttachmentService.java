package com.smartcampus.tickets;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final TicketRepository ticketRepository;

    private final String uploadDir = "uploads/";

    public Ticket uploadAttachments(String ticketId, List<MultipartFile> files) throws IOException {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // max 3 attachments
        if (ticket.getAttachments() != null && ticket.getAttachments().size() + files.size() > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed per ticket");
        }

        // create upload folder if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
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