package com.smartcampus.tickets;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // POST /api/tickets/{ticketId}/comments — add comment
    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable String ticketId,
            @RequestBody Comment comment) {
        Comment created = commentService.addComment(ticketId, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/tickets/{ticketId}/comments — get all comments
    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    // PUT /api/tickets/{ticketId}/comments/{commentId} — edit own comment
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable String commentId,
            @RequestParam String content,
            @RequestParam String requestedBy) {
        return ResponseEntity.ok(commentService.editComment(commentId, content, requestedBy));
    }

    // DELETE /api/tickets/{ticketId}/comments/{commentId} — delete own comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @RequestParam String requestedBy) {
        commentService.deleteComment(commentId, requestedBy);
        return ResponseEntity.noContent().build();
    }
}