// src/pages/product/Product.jsx
import React, { useEffect, useState, useCallback } from "react";
import 'swiper/css';
import "./Product.css";
import BottomNavigation from "../../components/common/navigation/BottomNavigation";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/Pagination";
import { fetchUserPoints, fetchProducts } from './services/ProductService';

const Product = () => {
  const [points, setPoints] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPoints = async () => {
    try {
      const points = await fetchUserPoints();
      setPoints(points);
    } catch (error) {
      setError(error.message);
    }
  };

  const loadProducts = useCallback(async (page) => {
    setLoading(true);
    try {
      const { products, totalPages } = await fetchProducts(page);
      setProducts(products);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPoints();
  }, []);

  useEffect(() => {
    loadProducts(currentPage);
  }, [loadProducts, currentPage]);

  return (
    <div className="screen">
      <div className="header">
        <h1>
          보유 포인트 <span className="point">{points}</span>
        </h1>
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="product-list-container">
          <div className="product-list">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <BottomNavigation />
    </div>
  );
};

export default Product;
