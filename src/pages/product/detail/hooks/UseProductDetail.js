// src/hooks/useProductDetail.js
import { useState, useEffect, useCallback } from 'react';
import { getPoints, getProductDetails } from '../services/ProductDetailService';

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProductAndPoints = useCallback(async () => {
    setLoading(true);
    try {
      const productData = await getProductDetails(productId);
      const userPoints = await getPoints();
      setProduct(productData);
      setPoints(userPoints);
    } catch (error) {
      setError('데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductAndPoints();
  }, [fetchProductAndPoints]);

  return { product, points, loading, error, setPoints };
};

export default useProductDetail;
