import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/common/navigation/BottomNavigation';

const MyPage = () => {
  const [userPoint, setUserPoint] = useState(0);
  const [userInfo, setUserInfo] = useState({ email: '', phone: '', nickname: '' });
  const [gifticons, setGifticons] = useState([]);
  const navigate = useNavigate();

  // 유저 포인트 및 정보 불러오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/users/my-page')
      .then(response => {
        const data = response.data.data;
        setUserInfo({
          email: data.email,
          phone: data.phone,
          nickname: data.nickname
        });
      })
      .catch(error => {
        console.error('유저 정보 불러오기에 실패했습니다:', error);
      });

    axios.get('http://localhost:8080/api/points/user')
      .then(response => {
        setUserPoint(response.data.data.point);
      })
      .catch(error => {
        console.error('포인트 불러오기에 실패했습니다:', error);
      });
  }, []);

  // 기프티콘 목록 불러오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/gifticons/user')
      .then(response => {
        setGifticons(response.data.data);
      })
      .catch(error => {
        console.error('기프티콘 목록 불러오기에 실패했습니다:', error);
      });
  }, []);

    // 게시판 데이터 불러오기
    useEffect(() => {
      axios.get('http://localhost:8080/api/boards/my')
        .then(response => {
          setBoards(response.data.data.map(board => ({
            boardFirstImgUrl: board.boardFirstImgUrl,
            roadNameAddress: board.roadNameAddress,
            detailedAddress: board.detailedAddress
          })));
        })
        .catch(error => {
          console.error('게시판 정보 불러오기에 실패했습니다:', error);
        });
    }, []);

  return (
    <div className="screen">
      {/* 헤더 섹션 */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>보유 포인트</h1>
          <span className="point">{userPoint}</span>
        </div>
        <button className="edit-button" onClick={() => navigate('/update')}>정보 수정</button>
      </div>

      {/* 유저 정보 섹션 */}
      <div className="user-info">
        <div className="info-row">
          <span className="info-label">아이디</span>
          <span className="info-value">{userInfo.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">핸드폰 번호</span>
          <span className="info-value">{userInfo.phone}</span>
        </div>
        <div className="info-row">
          <span className="info-label">닉네임</span>
          <span className="info-value">{userInfo.nickname}</span>
        </div>
      </div>

      {/* 게시판 섹션 */}
      <div className="horizontal-scroll-container">
        <h2>게시판 목록</h2>
        <div className="scrollable-list">
          {boards.map((board, index) => (
            <div key={index} className="card">
              <div className="product-image-container">
                <img
                  src={board.boardFirstImgUrl}
                  alt="Board"
                  className="product-image"
                />
              </div>
              <div className="card-info">
                <h3>{board.roadNameAddress}</h3>
                <p>{board.detailedAddress}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 기프티콘 리스트 */}
      <div className="horizontal-scroll-container">
        <h2>상품 목록</h2>
        <div className="scrollable-list">
          {gifticons.map((gifticon, index) => (
            <div key={index} className="card">
              <div className="product-image-container">
                <img
                  src={gifticon.productImageUrl}
                  alt="Product"
                  className="product-image"
                />
              </div>
              {/* 링크 이미지 표시 */}
              <img
                src={gifticon.barcodeImageUrl}
                alt="Barcode"
                className="barcode-image"
              />
              {/* h3 텍스트 */}
              <div className="card-info">
                <h3>{gifticon.productName}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default MyPage;
