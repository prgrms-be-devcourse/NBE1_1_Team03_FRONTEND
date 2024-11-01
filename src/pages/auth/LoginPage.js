// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const accessToken = response.headers.get("access");

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          navigate('/'); 
        } else {
          setErrorMessage('토큰을 가져올 수 없습니다. 서버를 확인해주세요.');
        }
      } else {
        setErrorMessage('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">SSCANNER</h1>
      <form onSubmit={handleLogin} className="form">
        <div className="input-group">
          <label className="label">아이디</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디 입력(이메일 형식)"
            className="input"
            required
          />
        </div>
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
        <button type="submit" className="submit-button">로그인</button>
        <button
          type="button"
          className="signup-button"
          onClick={() => navigate('/sign-up')}
        >
          회원 가입
        </button>
        <div className="link-container">
          <span className="link" onClick={() => navigate('/find-id')}>아이디 찾기</span>
          <span className="divider">|</span>
          <span className="link" onClick={() => navigate('/find-password')}>비밀번호 찾기</span>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
