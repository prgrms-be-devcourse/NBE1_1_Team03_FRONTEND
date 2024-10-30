// src/pages/ConfirmPasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfirmPasswordPage.css';

function ConfirmPasswordPage() {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/confirm-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: password,
      });

      const data = await response.json();
      if (response.ok && data.code === 200) {
        navigate('/update-phone'); // 휴대폰 번호 변경 페이지로 이동
      } else {
        setErrorMessage('비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">본인 확인</h1>
      <form onSubmit={handlePasswordSubmit} className="form">
        <div className="input-group">
          <label className="label">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="input"
            required
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="button">인증 완료</button>
      </form>
    </div>
  );
}

export default ConfirmPasswordPage;
