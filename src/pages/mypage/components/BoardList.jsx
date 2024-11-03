// src/components/BoardList.jsx
import React from 'react';
import './BoardList.css'; // 필요한 스타일이 있다면 추가

const BoardList = ({ boards }) => (
  <div className="horizontal-scroll-container">
    <h2>게시판 목록</h2>
    <div className="scrollable-list">
      {boards.length > 0 ? (
        boards.map((board, index) => (
          <div key={index} className="card">
            <div className="product-image-container">
              <img src={board.boardFirstImgUrl} alt="Board" className="product-image" />
            </div>
            <div className="card-info">
              <h3>{board.roadNameAddress}</h3>
              <p>{board.detailedAddress}</p>
            </div>
          </div>
        ))
      ) : (
        <p>게시판 항목이 없습니다.</p>
      )}
    </div>
  </div>
);

export default BoardList;
