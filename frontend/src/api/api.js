// Axios instance configured with the Spring Boot backend base URL
// All API calls use this instance so the base URL is defined in one place
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8081/api',
});

// Add a request interceptor to attach the JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// TICKET ENDPOINTS

// POST /api/tickets->Creates a new ticket in MongoDB
export const createTicket = (ticketData) => 
    API.post('/tickets', ticketData);

//GET /api/tickets->Fetches all tickets from MongoDB - used by Admin view
export const getAllTickets = () => 
    API.get('/tickets');

//GET /api/tickets/my?createdBy={email}->Fetches only tickets created by a specific student
export const getMyTickets = (email) => 
    API.get(`/tickets/my?createdBy=${email}`);

// GET /api/tickets/assigned?assignedTo={email}->Fetches only tickets assigned to a specific technician->TechnicianTickets
export const getAssignedTickets = (email) => 
    API.get(`/tickets/assigned?assignedTo=${email}`);

// GET /api/tickets/{id}->Fetches a single ticket by its MongoDB ID
export const getTicketById = (id) => 
    API.get(`/tickets/${id}`);

// PUT /api/tickets/{id}/status?status={status}&reason={reason}->Updates ticket status - OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
export const updateTicketStatus = (id, status, reason) => 
    API.put(`/tickets/${id}/status?status=${status}${reason ? `&reason=${reason}` : ''}`);

//PUT /api/tickets/{id}/assign?technicianId={email}->Assigns a technician to a ticket
// Backend also automatically sets status to IN_PROGRESS on assignment
export const assignTechnician = (id, technicianId) => 
    API.put(`/tickets/${id}/assign?technicianId=${technicianId}`);

// PUT /api/tickets/{id}/resolve?notes={notes}->saves resolution notes written by the technician
export const addResolutionNotes = (id, notes) => 
    API.put(`/tickets/${id}/resolve?notes=${notes}`);

// DELETE /api/tickets/{id}->Permanently deletes a ticket from MongoDB
// Only admin can delete tickets
export const deleteTicket = (id) => 
    API.delete(`/tickets/${id}`);

//// GET /api/tickets/{id}/stats->Fetches service level timer data for a ticket-> Returns timeToFirstResponseMinutes and timeToResolutionMinutes
// Innovation feature - tracks how quickly issues are handled
export const getTicketStats = (id) => 
    API.get(`/tickets/${id}/stats`);

// COMMENT ENDPOINTS

// POST /api/tickets/{ticketId}/comments->Adds a new comment to a ticket
export const addComment = (ticketId, commentData) => 
    API.post(`/tickets/${ticketId}/comments`, commentData);

// GET /api/tickets/{ticketId}/comments-> Fetches all comments for a specific ticket
export const getComments = (ticketId) => 
    API.get(`/tickets/${ticketId}/comments`);

// PUT /api/tickets/{ticketId}/comments/{commentId}?content={content}&requestedBy={email}
// Edits an existing comment
// Ownership rule: only the comment creator can edit it
export const editComment = (ticketId, commentId, content, requestedBy) => 
    API.put(`/tickets/${ticketId}/comments/${commentId}?content=${content}&requestedBy=${requestedBy}`);

// DELETE /api/tickets/{ticketId}/comments/{commentId}?requestedBy={email}-> Deletes a comment permanently
// Ownership rule: only the comment creator can delete it
// Backend validates requestedBy matches comment's createdBy
export const deleteComment = (ticketId, commentId, requestedBy) => 
    API.delete(`/tickets/${ticketId}/comments/${commentId}?requestedBy=${requestedBy}`);

// ATTACHMENT ENDPOINTS
// POST /api/tickets/{ticketId}/attachments-> Uploads up to 3 image files as evidence for a ticket
// Backend validates file type (image/* only) and count (max 3)
export const uploadAttachments = (ticketId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return API.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};