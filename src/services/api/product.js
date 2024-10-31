import axiosInstance from '../config/axios';

// API 관련 로직 분리
export const fetchProduct = (id) => axiosInstance.get(`/api/products/${id}`);
export const fetchPoints = (userId) => axiosInstance.get(`/api/points/${userId}`);
export const purchaseProduct = (userId, productId) => 
  axiosInstance.post(`/api/payment`, { userId, productId });

export const fetchProducts = (page) => axiosInstance.get(`/api/products?page=${page}&size=5`);