// src/pages/product/ProductDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductDetail from './hooks/UseProductDetail';
import { purchaseProduct } from './services/ProductDetailService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import './ProductDetail.css';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import CustomButton from './components/CustomButton';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, points, loading, error, setPoints } = useProductDetail(id);

  const handlePurchase = async () => {
    try {
      const updatedPoints = await purchaseProduct(parseInt(id));
      setPoints(updatedPoints);
      alert('결제가 완료되었습니다.');
      navigate('/products');
    } catch (error) {
      alert('결제에 실패했습니다.');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

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

      <CustomButton onClick={handlePurchase}>구매 하기</CustomButton>
    </div>
  );
};

export default ProductDetail;
