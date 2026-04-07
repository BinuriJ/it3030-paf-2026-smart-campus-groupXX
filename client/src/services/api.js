import axios from "axios";

const API = "http://localhost:8080/api/bookings";

// CREATE
export const createBooking = (data) => axios.post(API, data);

// GET ALL
export const getBookings = () => axios.get(API);

// UPDATE STATUS
export const updateBooking = (id, status) =>
    axios.put(`${API} / ${id}, { status }`);

// DELETE
export const deleteBooking = (id) =>
    axios.delete(`${API} / ${id}`);

// SUGGESTIONS
export const getSuggestions = (resourceId, startTime, endTime) =>
    axios.get(`${API} / suggest, {
        params: { resourceId, startTime, endTime },
    }`);
