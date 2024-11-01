import axiosInstance from '../config/axios';

// API 관련 로직 분리
export const fetchPoints = () => axiosInstance.get(`/api/points/user`);

export const fetchProducts = (page) => axiosInstance.get(`/api/products?page=${page}&size=5`);