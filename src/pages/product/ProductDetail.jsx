import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productAxios from './ProductAxios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [points, setPoints] = useState(0);

  // 상품 정보와 포인트를 가져오는 함수
  const fetchProductAndPoints = async (productId) => {
    try {
      const [productResponse, pointsResponse] = await Promise.all([
        productAxios.get(`/api/products/${productId}`),
        (() => {
          const token = localStorage.getItem('accessToken');
          if (token) {
            return productAxios.get(`/api/points/user`);
          } else {
            return Promise.resolve({ data: { data: { point: 0 } } });
          }
        })()
      ]);
      return {
        product: productResponse.data.data,
        points: pointsResponse.data.data.point,
      };
    } catch (error) {
      console.error("데이터 조회 오류:", error);
      throw error;
    }
  };

  // 상품 구매 함수
  const purchaseProduct = async (productId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인해주세요.');
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    try {
      const response = await productAxios.post(`/api/payment`, {
        productId,
      });
      return response.data.data.point;
    } catch (error) {
      console.error("결제 오류:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadProductAndPoints = async () => {
      try {
        const { product, points } = await fetchProductAndPoints(id);
        setProduct(product);
        setPoints(points);
      } catch (error) {
        console.error("데이터 조회 오류:", error);
      }
    };
    loadProductAndPoints();
  }, [id]);

  const handlePurchase = async () => {
    try {
      const updatedPoints = await purchaseProduct(parseInt(id));
      if (updatedPoints !== undefined) {
        alert('결제가 완료되었습니다.');
        setPoints(updatedPoints);
        navigate('/products');
      }
    } catch (error) {
      console.error("결제 오류:", error);
      alert('결제에 실패했습니다.');
    }
  };

  if (!product) return <div className="loading">로딩 중...</div>;

  return (
    <div className="product-detail-container">
      <div className="points-display">
        보유 포인트 <span className="point-value">{points}</span>
      </div>
      
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="product-image-swiper"
      >
        {product.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img 
              src={url}
              alt={`${product.productName} ${index + 1}`}
              className="product-image"
              onError={(e) => {
                console.error(`상품 ID ${product.productId}의 이미지 로드 실패:`, url);
                e.target.src = 'https://via.placeholder.com/80x80.png?text=No+Image';
                e.target.style.objectFit = 'contain';
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="product-info">
        <h2 className="product-name">{product.productName}</h2>
        <p className="product-price">{product.price.toLocaleString()}원</p>
      </div>
      
      <button className="purchase-button" onClick={handlePurchase}>
        구매 하기
      </button>
    </div>
  );
};

export default ProductDetail;
