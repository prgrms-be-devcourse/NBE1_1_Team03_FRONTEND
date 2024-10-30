import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import './ProductDetail.css';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? "http://localhost:8080"
  : "http://10.0.2.2:8080";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchProductAndPoints = async () => {
      try {
        const [productResponse, pointsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products/${id}`),
          axios.get(`${API_BASE_URL}/api/points/user1_id_123456`)
        ]);
        console.log('Product Response:', productResponse.data.data);  // 디버깅: 상품 데이터 확인
        console.log('이미지 URLs:', productResponse.data.data.imgUrls);  // 디버깅: 이미지 URLs 확인
        setProduct(productResponse.data.data);
        setPoints(pointsResponse.data.data.point);
      } catch (error) {
        console.error("데이터 조회 오류:", error);
      }
    };
    fetchProductAndPoints();
  }, [id]);
  

  const handlePurchase = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment`, {
        userId: "user1_id_123456",
        productId: parseInt(id)
      });
      alert('결제가 완료되었습니다.');
      setPoints(response.data.data.point);
      navigate('/products');
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
                console.error(`상품 ID ${product.productId}의 이미지 로드 실패:`, url); // 이미지 로드 실패 로그 출력
                e.target.src = 'https://via.placeholder.com/80x80.png?text=No+Image';
                e.target.style.objectFit = 'contain';
              }}
            />
          </SwiperSlide>
        ))}

      </Swiper>

      <div className="product-info">
        <h2 className="product-name">{product.productName}</h2>
        <p className="product-price">{product.price}원</p>
      </div>
      
      <button className="purchase-button" onClick={handlePurchase}>
        구매 하기
      </button>
    </div>
  );
};

export default ProductDetail;
