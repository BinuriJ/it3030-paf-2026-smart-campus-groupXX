package com.smartcampus.services;

import com.smartcampus.entity.Ticket;
import com.smartcampus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import java.time.Duration;

// TICKET SERVICE
// Core business logic layer for all ticket operations
// Called by TicketController to process requests
// Handles the full ticket lifecycle and service level timer logic
// Workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED (or REJECTED)
@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

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

    // Update ticket status + service level timer logic
    public Ticket updateStatus(String id, String newStatus, String reason) {
        Ticket ticket = getTicketById(id);

        String current = ticket.getStatus();
        if (current.equals("CLOSED") || current.equals("REJECTED")) {
            throw new RuntimeException("Cannot update a closed or rejected ticket");
        }

        // --- Service Level Timer logic ---

        // first response: when ticket moves away from OPEN for the first time
        if (current.equals("OPEN") && ticket.getFirstResponseAt() == null) {
            ticket.setFirstResponseAt(LocalDateTime.now());
            long minutes = Duration.between(ticket.getCreatedAt(), ticket.getFirstResponseAt()).toMinutes();
            ticket.setTimeToFirstResponseMinutes(minutes);
        }

        // resolution time: when ticket is RESOLVED or CLOSED
        if ((newStatus.equals("RESOLVED") || newStatus.equals("CLOSED"))
                && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
            long minutes = Duration.between(ticket.getCreatedAt(), ticket.getResolvedAt()).toMinutes();
            ticket.setTimeToResolutionMinutes(minutes);
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

        // service level timer — first response when technician is assigned
        if (ticket.getFirstResponseAt() == null) {
            ticket.setFirstResponseAt(LocalDateTime.now());
            long minutes = Duration.between(ticket.getCreatedAt(), ticket.getFirstResponseAt()).toMinutes();
            ticket.setTimeToFirstResponseMinutes(minutes);
        }

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

    // Get timer stats for a ticket
    public java.util.Map<String, Object> getTicketStats(String id) {
        Ticket ticket = getTicketById(id);
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("ticketId", ticket.getId());
        stats.put("status", ticket.getStatus());
        stats.put("createdAt", ticket.getCreatedAt());
        stats.put("firstResponseAt", ticket.getFirstResponseAt());
        stats.put("resolvedAt", ticket.getResolvedAt());
        stats.put("timeToFirstResponseMinutes", ticket.getTimeToFirstResponseMinutes());
        stats.put("timeToResolutionMinutes", ticket.getTimeToResolutionMinutes());
        return stats;
    }
}