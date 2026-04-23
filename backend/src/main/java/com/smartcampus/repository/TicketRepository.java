package com.smartcampus.repository;

// TICKET REPOSITORY-> Data access layer for the tickets collection in MongoDB

import com.smartcampus.entity.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedBy(String createdBy);// findByCreatedBy
    List<Ticket> findByAssignedTo(String assignedTo);// findByAssignedTo
    List<Ticket> findByStatus(String status);//findByStatus
}