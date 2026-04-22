package com.smartcampus.controllers;

import com.smartcampus.entity.Ticket;
import com.smartcampus.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

// TICKET CONTROLLER->Main controller for all ticket CRUD and workflow operation

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    // TicketService handles all ticket business logic
    private final TicketService ticketService;

    // POST /api/tickets->Creates a new maintenance/incident ticket
    // @Valid triggers backend validation on all @NotBlank fields
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/tickets->Fetches all tickets from MongoDB
    // Used by Admin to view and manage all tickets across all users
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/{id}-> Fetches a single ticket by its MongoDB document ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // GET /api/tickets/{id}->Fetches a single ticket by its MongoDB document ID 
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(@RequestParam String createdBy) {
        return ResponseEntity.ok(ticketService.getTicketsByUser(createdBy));
    }

    // GET /api/tickets/assigned?assignedTo={email}->Fetches all tickets assigned to a specific technician
    // @RequestParam assignedTo: the technician's email address
    @GetMapping("/assigned")
    public ResponseEntity<List<Ticket>> getAssignedTickets(@RequestParam String assignedTo) {
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(assignedTo));
    }

     // PUT /api/tickets/{id}/status?status={status}&reason={reason}-> Updates the status of a ticket
    // @RequestParam status: new status value (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)
    // @RequestParam reason: optional - only required when status is REJECTED
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(ticketService.updateStatus(id, status, reason));
    }
    // PUT /api/tickets/{id}/assign?technicianId={email}-> Assigns a technician to a ticket
    // @RequestParam technicianId: the technician's email address
    // Backend automatically sets status to IN_PROGRESS on assignment
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }

    // PUT /api/tickets/{id}/resolve?notes={notes}-> Saves resolution notes added by the technician
    // @RequestParam notes: description of how the issue was fixed
    @PutMapping("/{id}/resolve")
    public ResponseEntity<Ticket> addResolutionNotes(
            @PathVariable String id,
            @RequestParam String notes) {
        return ResponseEntity.ok(ticketService.addResolutionNotes(id, notes));
    }

    // DELETE /api/tickets/{id}-> Permanently deletes a ticket and its comments from MongoDB
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/tickets/{id}/stats-> Returns service level timer data for a specific ticket
    // Innovation feature — tracks response and resolution times
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getTicketStats(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketStats(id));
    }
}