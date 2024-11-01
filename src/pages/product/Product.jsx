import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';  // Swiper CSS 임포트
import "./Product.css";
import { useNavigate } from 'react-router-dom';
import BottomNavigation from "../../components/common/navigation/BottomNavigation";
import { fetchPoints, fetchProducts } from '../../services/api/product';

export const Product = () => {
  const [points, setPoints] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // 포인트 API 호출
  useEffect(() => {
    const getPoints = async () => {
      try {
        const response = await fetchPoints();
        console.log(response.data);  // 포인트 응답 로그
        setPoints(response.data.data.point);
      } catch (error) {
        console.error("포인트 조회 오류:", error);
      }
    };

    getPoints();
  }, []);

  // 상품 API 호출
  const getProducts = async (page) => {
    try {
      const response = await fetchProducts(page);
      console.log(response.data);  // 상품 응답 로그
      const { products, totalPages } = response.data.data;
      console.log("상품 데이터:", products); // 상품 배열에 있는 데이터를 확인
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
  
      {/* 상품 리스트 컨테이너 */}
      <div className="product-list-container">
        <div className="product-list">
          {products.map((product) => {
            console.log(`상품 ID ${product.productId}의 이미지 URLs:`, product.imgUrls); // 디버깅용 로그

            return (
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
                            console.error(`상품 ID ${product.productId}의 이미지 로드 실패:`, url);
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
          })}
        </div>
      </div>
  
      {/* 페이지네이션 */}
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
