package com.smartcampus.tickets;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    // Create a new ticket
    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Get all tickets (admin)
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get single ticket by ID
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    // Get tickets by user
    public List<Ticket> getTicketsByUser(String createdBy) {
        return ticketRepository.findByCreatedBy(createdBy);
    }

    // Get tickets assigned to technician
    public List<Ticket> getTicketsByTechnician(String assignedTo) {
        return ticketRepository.findByAssignedTo(assignedTo);
    }

    // Update ticket status
    public Ticket updateStatus(String id, String newStatus, String reason) {
        Ticket ticket = getTicketById(id);

        String current = ticket.getStatus();
        if (current.equals("CLOSED") || current.equals("REJECTED")) {
            throw new RuntimeException("Cannot update a closed or rejected ticket");
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (newStatus.equals("REJECTED") && reason != null) {
            ticket.setRejectionReason(reason);
        }

        return ticketRepository.save(ticket);
    }

    // Assign technician
    public Ticket assignTechnician(String id, String technicianId) {
        Ticket ticket = getTicketById(id);
        ticket.setAssignedTo(technicianId);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Add resolution notes
    public Ticket addResolutionNotes(String id, String notes) {
        Ticket ticket = getTicketById(id);
        ticket.setResolutionNotes(notes);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Delete ticket (admin only)
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}