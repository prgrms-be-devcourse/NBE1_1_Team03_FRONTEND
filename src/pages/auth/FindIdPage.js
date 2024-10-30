// src/pages/FindIdPage.js
import React, { useState } from 'react';
import './FindIdPage.css';

function FindIdPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (response.ok) setMessage('인증번호가 발송되었습니다.');
      else setMessage(data.message || '인증번호 발송에 실패했습니다.');
    } catch (error) {
      console.error('Error:', error);
      setMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleFindId = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/find-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmail(data.data.email);
        setMessage('아이디 찾기 성공!');
      } else setMessage(data.message || '아이디 찾기에 실패했습니다.');
    } catch (error) {
      console.error('Error:', error);
      setMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">아이디 찾기</h1>
      <form className="form">
        <div className="input-group">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호 입력"
            className="input"
          />
          <button type="button" onClick={handleSendSms} className="button">
            인증번호 발송
          </button>
        </div>
        <div className="input-group">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호 입력"
            className="input"
          />
          <button type="button" onClick={handleFindId} className="button">
            아이디 찾기
          </button>
        </div>
        {message && <p className="message">{message}</p>}
        {email && <p className="success">찾은 아이디: {email}</p>}
      </form>
    </div>
  );
}

export default FindIdPage;
