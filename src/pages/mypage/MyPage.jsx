// src/pages/product/MyPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserInfo,
  fetchUserPoints,
  fetchUserGifticons,
  fetchUserBoards
} from './services/MyPageService';
import './MyPage.css';
import BoardList from './components/BoardList';
import GifticonList from './components/GifticonList';
import UserInfo from './components/UserInfo';
import BottomNavigation from '../../components/common/navigation/BottomNavigation';

const MyPage = () => {
  const [userPoint, setUserPoint] = useState(0);
  const [userInfo, setUserInfo] = useState({ email: '', phone: '', nickname: '' });
  const [gifticons, setGifticons] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [userInfo, userPoint, gifticons, boards] = await Promise.all([
          fetchUserInfo(),
          fetchUserPoints(),
          fetchUserGifticons(),
          fetchUserBoards()
        ]);

        setUserInfo(userInfo);
        setUserPoint(userPoint);
        setGifticons(gifticons);
        setBoards(boards);
      } catch (error) {
        setError('데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="screen">
      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          <div className="header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1>보유 포인트</h1>
              <span className="point">{userPoint}</span>
            </div>
            <div className="button-group">
              <button className="action-button" onClick={() => navigate('/update')}>정보 수정</button>
              <button className="action-button" onClick={() => navigate('/chatbot')}>챗봇</button>
            </div>
          </div>

          <UserInfo userInfo={userInfo} />
          <BoardList boards={boards} />
          <GifticonList gifticons={gifticons} />
          <BottomNavigation />
        </>
      )}
    </div>
  );
};

export default MyPage;
