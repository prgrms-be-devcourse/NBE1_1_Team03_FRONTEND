import axiosInstance from '../config/axios';

// 상품 정보와 포인트를 가져오는 함수
export const fetchProductAndPoints = async (productId) => {
  try {
    const [productResponse, pointsResponse] = await Promise.all([
      axiosInstance.get(`/api/products/${productId}`),
      axiosInstance.get(`/api/points/user`)
    ]);
    return {
      product: productResponse.data.data,
      points: pointsResponse.data.data.point
    };
  } catch (error) {
    console.error("데이터 조회 오류:", error);
    throw error;
  }
};

// 상품 구매 함수
export const purchaseProduct = async (productId) => {
  try {
    const response = await axiosInstance.post(`/api/payment`, {
      productId
    });
    return response.data.data.point;
  } catch (error) {
    console.error("결제 오류:", error);
    throw error;
  }
}; 