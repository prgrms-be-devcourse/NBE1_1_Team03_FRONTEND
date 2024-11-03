// src/services/ProductService.js
import productAxios from '../ProductAxios';

export const fetchUserPoints = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const response = await productAxios.get('/api/points/user');
      return response.data.data.point;
    }
    return 0;
  } catch (error) {
    console.error("포인트 조회 오류:", error);
    throw new Error('포인트를 불러오는 중 문제가 발생했습니다.');
  }
};

export const fetchProducts = async (page, size = 5) => {
  try {
    const response = await productAxios.get(`/api/products?page=${page}&size=${size}`);
    return response.data.data;
  } catch (error) {
    console.error("상품 조회 오류:", error);
    throw new Error('상품 목록을 불러오는 중 문제가 발생했습니다.');
  }
};
