import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createBooking = async (bookingData) => {
  const response = await API.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async (userName) => {
  const response = await API.get(`/bookings/my?userName=${encodeURIComponent(userName)}`);
  return response.data;
};

export const getAllBookingsAdmin = async () => {
  const response = await API.get("/bookings/admin/all");
  return response.data;
};

export const updateBookingStatusAdmin = async (id, status, adminName, reason) => {
  const response = await API.put(`/bookings/admin/status/${id}?status=${status}&adminName=${encodeURIComponent(adminName)}&reason=${encodeURIComponent(reason || '')}`);
  return response.data;
};

export default API;