package com.smartcampus.tickets;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // POST /api/tickets — create a ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/tickets — get all tickets (admin)
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/{id} — get single ticket
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // GET /api/tickets/my?createdBy=email — get my tickets
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(@RequestParam String createdBy) {
        return ResponseEntity.ok(ticketService.getTicketsByUser(createdBy));
    }

    // GET /api/tickets/assigned?assignedTo=email — get technician tickets
    @GetMapping("/assigned")
    public ResponseEntity<List<Ticket>> getAssignedTickets(@RequestParam String assignedTo) {
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(assignedTo));
    }

    // PUT /api/tickets/{id}/status — update status
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(ticketService.updateStatus(id, status, reason));
    }

    // PUT /api/tickets/{id}/assign — assign technician
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }

    // PUT /api/tickets/{id}/resolve — add resolution notes
    @PutMapping("/{id}/resolve")
    public ResponseEntity<Ticket> addResolutionNotes(
            @PathVariable String id,
            @RequestParam String notes) {
        return ResponseEntity.ok(ticketService.addResolutionNotes(id, notes));
    }

    // DELETE /api/tickets/{id} — delete ticket (admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/tickets/{id}/stats — service level timer stats
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getTicketStats(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketStats(id));
    }
}