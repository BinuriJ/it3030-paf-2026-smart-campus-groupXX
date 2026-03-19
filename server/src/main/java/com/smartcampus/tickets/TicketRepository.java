package com.smartcampus.tickets;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedBy(String createdBy);
    List<Ticket> findByAssignedTo(String assignedTo);
    List<Ticket> findByStatus(String status);
}