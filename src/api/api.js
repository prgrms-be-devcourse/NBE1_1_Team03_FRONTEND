import axios from "axios";

const API_BASE_URL = window.location.hostname === 'localhost'
  ? "http://localhost:8080"
  : "http://10.0.2.2:8080";

// 포인트 조회 API
export const fetchPoints = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/points/${userId}`);
    return response.data.data.point;
  } catch (error) {
    console.error("포인트 조회 오류:", error);
    throw error;
  }
};

// 상품 목록 조회 API
export const fetchProducts = async (page, size = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products?page=${page}&size=${size}`);
    return response.data.data;
  } catch (error) {
    console.error("상품 조회 오류:", error);
    throw error;
  }
};

// 특정 상품 조회 API
export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("상품 조회 오류:", error);
    throw error;
  }
};

// 상품 구매 API
export const handlePurchase = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/payment`, {
      userId,
      productId,
    });
    return response.data.data.point;
  } catch (error) {
    console.error("결제 오류:", error);
    throw error;
  }
};
