package com.smartcampus.tickets;

import jakarta.validation.Valid;
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

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(@RequestParam String createdBy) {
        return ResponseEntity.ok(ticketService.getTicketsByUser(createdBy));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<Ticket>> getAssignedTickets(@RequestParam String assignedTo) {
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(assignedTo));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(ticketService.updateStatus(id, status, reason));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Ticket> addResolutionNotes(
            @PathVariable String id,
            @RequestParam String notes) {
        return ResponseEntity.ok(ticketService.addResolutionNotes(id, notes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getTicketStats(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketStats(id));
    }
}