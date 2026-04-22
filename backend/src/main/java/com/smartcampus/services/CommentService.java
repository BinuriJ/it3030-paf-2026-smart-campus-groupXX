package com.smartcampus.services;

import com.smartcampus.entity.Comment;
import com.smartcampus.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;

// COMMENT SERVICE
// Business logic layer for all comment operations
// Called by CommentController to process requests
// Enforces comment ownership rules — only the creator can edit or delete

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;// CommentRepository handles all MongoDB operations for comments

    // Add a comment to a ticket
    public Comment addComment(String ticketId, Comment comment) {
        comment.setTicketId(ticketId);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Get all comments for a ticket
    public List<Comment> getCommentsByTicket(String ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    // Edit own comment — only owner can edit
    public Comment editComment(String commentId, String newContent, String requestedBy) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getCreatedBy().equals(requestedBy)) {// Ownership check
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setContent(newContent);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Delete own comment — only owner can delete
    public void deleteComment(String commentId, String requestedBy) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getCreatedBy().equals(requestedBy)) {// Ownership check
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.deleteById(commentId);
    }
}