import productAxios from '../../ProductAxios';

export const getPoints = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const response = await productAxios.get('/api/points/user');
      return response.data.data.point;
    }
    return 0;
  } catch (error) {
    console.error('포인트 조회 오류:', error);
    throw new Error('포인트 조회에 실패했습니다.');
  }
};

export const getProductDetails = async (productId) => {
  try {
    const response = await productAxios.get(`/api/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error('상품 상세 조회 오류:', error);
    throw new Error('상품 상세 조회에 실패했습니다.');
  }
};

export const purchaseProduct = async (productId) => {
  try {
    const response = await productAxios.post(`/api/payment`, {
      productId,
    });
    return response.data.data.point;
  } catch (error) {
    console.error('결제 오류:', error);
    throw new Error('결제에 실패했습니다.');
  }
};
