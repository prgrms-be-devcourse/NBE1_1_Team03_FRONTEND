import axios from 'axios';

// API 관련 로직 분리
export const API_BASE_URL = window.location.hostname === 'localhost'
  ? "http://localhost:8080"
  : "http://10.0.2.2:8080";

export const fetchProduct = (id) => axios.get(`${API_BASE_URL}/api/products/${id}`);
export const fetchPoints = (userId) => axios.get(`${API_BASE_URL}/api/points/${userId}`);
export const purchaseProduct = (userId, productId) => 
  axios.post(`${API_BASE_URL}/api/payment`, { userId, productId }); 