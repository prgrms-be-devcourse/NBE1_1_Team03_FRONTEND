// src/components/GifticonList.jsx
import React from 'react';
import './GifticonList.css'; // 필요한 스타일이 있다면 추가

const GifticonList = ({ gifticons }) => (
  <div className="horizontal-scroll-container">
    <h2>상품 목록</h2>
    <div className="scrollable-list">
      {gifticons.length > 0 ? (
        gifticons.map((gifticon, index) => (
          <div key={index} className="card">
            <div className="product-image-container">
              <img src={gifticon.productImageUrl} alt="Product" className="product-image" />
            </div>
            <img src={gifticon.barcodeImageUrl} alt="Barcode" className="barcode-image" />
            <div className="card-info">
              <h3>{gifticon.productName}</h3>
            </div>
          </div>
        ))
      ) : (
        <p>기프티콘이 없습니다.</p>
      )}
    </div>
  </div>
);

export default GifticonList;
