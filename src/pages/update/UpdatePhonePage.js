// src/pages/UpdatePhonePage.js
import React, { useState } from 'react';
import './UpdatePhonePage.css';

function UpdatePhonePage() {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
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

  const handleVerifySms = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ phone, smsCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        setMessage('인증이 완료되었습니다.');
      } else setMessage(data.message || '인증 실패.');
    } catch (error) {
      console.error('Error:', error);
      setMessage('서버에 문제가 발생했습니다.');
    }
  };

  const handleChangePhone = async () => {
    if (!isVerified) {
      setMessage('인증을 먼저 완료해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/change-phone', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ newPhone: phone, smsCode }),
      });

      const data = await response.json();
      if (response.ok) setMessage('전화번호가 성공적으로 변경되었습니다.');
      else setMessage(data.message || '전화번호 변경에 실패했습니다.');
    } catch (error) {
      console.error('Error:', error);
      setMessage('서버에 문제가 발생했습니다.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">전화번호 변경</h1>
      <form className="form">
        <div className="input-group">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호 입력"
            className="input"
          />
          <button onClick={handleSendSms} className="button">인증번호 발송</button>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            placeholder="인증번호 입력"
            className="input"
          />
          <button onClick={handleVerifySms} className="button">인증번호 확인</button>
        </div>

        <button onClick={handleChangePhone} className="submit-button">전화번호 변경</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default UpdatePhonePage;
