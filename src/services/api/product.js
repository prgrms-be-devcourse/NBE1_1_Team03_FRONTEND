import axiosInstance from '../config/axios';

// API 함수들
export const fetchProduct = (id) => 
  axiosInstance.get(`/api/products/${id}`);

export const fetchPoints = (userId) => 
  axiosInstance.get(`/api/points/${userId}`);

export const purchaseProduct = (userId, productId) => 
  axiosInstance.post(`/api/payment`, { userId, productId }); 