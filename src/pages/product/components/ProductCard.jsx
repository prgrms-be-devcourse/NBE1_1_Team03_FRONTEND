// src/components/product/ProductCard.jsx
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.productId}`)}>
      <Swiper spaceBetween={0} slidesPerView={1} className="product-image-container" width={80}>
        {product.imgUrls.map((url, index) => (
          <SwiperSlide key={index} style={{ width: '80px', height: '80px' }}>
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
        <h2>{product.productName}</h2>
        <p>{product.price ? `${product.price.toLocaleString()} 원` : "가격 정보 없음"}</p>
      </div>
    </div>
  );
};

export default ProductCard;
