package com.smartcampus.repository;

// COMMENT REPOSITORY-> Data access layer for the comments collection in MongoDB

import com.smartcampus.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTicketId(String ticketId); // findByTicketId
    void deleteByTicketId(String ticketId);// deleteByTicketId
}