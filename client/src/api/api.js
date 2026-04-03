import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const createTicket = (ticketData) => 
    API.post('/tickets', ticketData);

export const getAllTickets = () => 
    API.get('/tickets');

export const getMyTickets = (email) => 
    API.get(`/tickets/my?createdBy=${email}`);

export const getAssignedTickets = (email) => 
    API.get(`/tickets/assigned?assignedTo=${email}`);

export const getTicketById = (id) => 
    API.get(`/tickets/${id}`);

export const updateTicketStatus = (id, status, reason) => 
    API.put(`/tickets/${id}/status?status=${status}${reason ? `&reason=${reason}` : ''}`);

export const assignTechnician = (id, technicianId) => 
    API.put(`/tickets/${id}/assign?technicianId=${technicianId}`);

export const addResolutionNotes = (id, notes) => 
    API.put(`/tickets/${id}/resolve?notes=${notes}`);

export const deleteTicket = (id) => 
    API.delete(`/tickets/${id}`);

export const getTicketStats = (id) => 
    API.get(`/tickets/${id}/stats`);

export const addComment = (ticketId, commentData) => 
    API.post(`/tickets/${ticketId}/comments`, commentData);

export const getComments = (ticketId) => 
    API.get(`/tickets/${ticketId}/comments`);

export const editComment = (ticketId, commentId, content, requestedBy) => 
    API.put(`/tickets/${ticketId}/comments/${commentId}?content=${content}&requestedBy=${requestedBy}`);

export const deleteComment = (ticketId, commentId, requestedBy) => 
    API.delete(`/tickets/${ticketId}/comments/${commentId}?requestedBy=${requestedBy}`);

export const uploadAttachments = (ticketId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return API.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};