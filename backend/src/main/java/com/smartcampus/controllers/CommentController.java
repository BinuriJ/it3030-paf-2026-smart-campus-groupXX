package com.smartcampus.controllers;

import com.smartcampus.entity.Comment;
import com.smartcampus.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

// COMMENT CONTROLLER->Handles all comment operations for maintenance tickets    

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {

    // CommentService handles all comment business logic
    private final CommentService commentService;

    // POST /api/tickets/{ticketId}/comments-> Adds a new comment to a specific ticket
    // @PathVariable ticketId: the MongoDB ID of the ticket
    // @RequestBody comment: comment object containing content and createdBy
    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable String ticketId,
            @RequestBody Comment comment) {
        Comment created = commentService.addComment(ticketId, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

       // GET /api/tickets/{ticketId}/comments-> Fetches all comments for a specific ticket
    // @PathVariable ticketId: the MongoDB ID of the ticket
    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    // PUT /api/tickets/{ticketId}/comments/{commentId}-> Edits an existing comment
    // @PathVariable commentId: the MongoDB ID of the comment to edit
    // @RequestParam content: the new comment text
    // @RequestParam requestedBy: email of the person requesting the edit
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable String commentId,
            @RequestParam String content,
            @RequestParam String requestedBy) {
        return ResponseEntity.ok(commentService.editComment(commentId, content, requestedBy));
    }

    // DELETE /api/tickets/{ticketId}/comments/{commentId}-> Permanently deletes a comment from MongoDB
    // @PathVariable commentId: the MongoDB ID of the comment to delete
    // @RequestParam requestedBy: email of the person requesting deletion
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @RequestParam String requestedBy) {
        commentService.deleteComment(commentId, requestedBy);
        return ResponseEntity.noContent().build();
    }
}