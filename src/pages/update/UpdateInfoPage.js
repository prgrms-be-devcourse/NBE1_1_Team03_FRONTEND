import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateInfoPage.css';

function UpdateInfoPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login'); 
    } else {
      // 사용자 정보 가져오기
      fetch('http://localhost:8080/api/users/my-page', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            setNickname(data.data.nickname);
            setEmail(data.data.email);
          } else {
            console.error('사용자 정보를 불러오는 데 실패했습니다.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [navigate]);

  return (
    <div className="container">
      <h1 className="title">User: {nickname || '사용자 닉네임'}</h1>
      <p className="subtitle">ID: {email || '사용자 이메일'}</p>
      <div className="button-container">
        <button onClick={() => navigate('/update-name')} className="button">
          닉네임 변경 <span className="arrow">✔️</span>
        </button>
        <button onClick={() => navigate('/confirm-password?next=update-phone')} className="button">
          휴대폰 번호 변경 <span className="arrow">✔️</span>
        </button>
        <button onClick={() => navigate('/update-password')} className="button">
          비밀번호 변경 <span className="arrow">✔️</span>
        </button>
        <button onClick={() => navigate('/confirm-password?next=delete-account')} className="button">
          회원 탈퇴 <span className="arrow">⚠️</span>
        </button>
      </div>
    </div>
  );
}

export default UpdateInfoPage;
