import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "./Product.css";
import { useNavigate } from 'react-router-dom';
import BottomNavigation from "../../components/common/navigation/BottomNavigation";
import productAxios from './ProductAxios';

// 포인트 조회 함수 (로그인된 사용자만 호출)
const fetchPoints = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const response = await productAxios.get('/api/points/user');
      return response.data.data.point; // 포인트 반환
    } else {
      return 0; // 로그인되지 않았으면 기본값 0 반환
    }
  } catch (error) {
    console.error("포인트 조회 오류:", error);
    return 0; // 오류 발생 시에도 0 반환
  }
};

// 상품 조회 함수 (로그인 여부와 상관없이 호출 가능)
const fetchProducts = (page) => productAxios.get(`/api/products?page=${page}&size=5`);

const Product = () => {
  const [points, setPoints] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const getPoints = async () => {
      const points = await fetchPoints();
      setPoints(points);
    };

    getPoints();
  }, []);

  const getProducts = async (page) => {
    try {
      const response = await fetchProducts(page);
      const { products, totalPages } = response.data.data;
      setProducts(products);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("상품 조회 오류:", error);
    }
  };

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="screen">
      <div className="header">
        <h1>
          보유 포인트 <span className="point">{points}</span>
        </h1>
      </div>

      <div className="product-list-container">
        <div className="product-list">
          {products.map((product) => (
            <div key={product.productId} className="product-card" onClick={() => navigate(`/product/${product.productId}`)}>
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                pagination={false}
                loop={false}
                className="product-image-container"
                direction="horizontal"
                width={80}
                initialSlide={0}
                watchOverflow={true}
              >
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
          ))}
        </div>
      </div>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => getProducts(currentPage - 1)}>
          이전
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={currentPage === page + 1 ? "active" : ""}
            onClick={() => getProducts(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => getProducts(currentPage + 1)}>
          다음
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Product;
