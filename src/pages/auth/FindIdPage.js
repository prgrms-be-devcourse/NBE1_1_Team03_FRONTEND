import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindIdPage.css';

function FindIdPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/send-for-registered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNum: phone }),
      });

      const data = await response.json();
      setMessage(response.ok ? '인증번호가 발송되었습니다.' : data.message || '인증번호 발송에 실패했습니다.');
    } catch (error) {
      setMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
      console.error('Error:', error);
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
        setShowModal(true);
      } else {
        setMessage(data.message || '아이디 찾기에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <div className="container">
      <h1 className="title">아이디 찾기</h1>
      <form className="form">
        <div className="verify-input-group">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호 입력"
            className="input"
          />
          <button type="button" onClick={handleSendSms} className="verify-button">
            인증번호 발송
          </button>
        </div>
        <div className="verify-input-group">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호 입력"
            className="input"
          />
          <button type="button" onClick={handleFindId} className="verify-button">
            인증번호 확인
          </button>
        </div>
        {message && <p className="message">{message}</p>}
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>찾은 아이디: {email}</p>
            <button onClick={closeModal} className="close-button">확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindIdPage;
