import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindPasswordPage.css';

function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/send1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNum: phone }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('인증번호가 발송되었습니다.');
      } else {
        setMessage(data.message || '인증번호 발송에 실패했습니다.');
      }
    } catch (error) {
      setMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
      console.error('Error:', error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!smsCode || smsCode.trim() === '') {
      setMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          code: smsCode,
          newPassword
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowModal(true); 
      } else {
        setErrorMessage(data.errors || {});
        setMessage(data.message || '비밀번호 재설정 실패.');
      }
    } catch (error) {
      setErrorMessage({ global: '서버에 문제가 발생했습니다.' });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/login'); 
  };

  return (
    <div className="container">
      <h1 className="title">비밀번호 찾기</h1>
      <form onSubmit={handlePasswordReset} className="form">
        <InputGroup
          label="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디 입력(이메일 형식)"
        />
        {errorMessage.email && <p className="error">{errorMessage.email}</p>}

        <InputGroup
          label="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호 입력"
        />
        <button type="button" onClick={handleSendSms} className="verify-button">
          인증번호 발송
        </button>
        {errorMessage.phone && <p className="error">{errorMessage.phone}</p>}

        <InputGroup
          label="인증번호"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value)}
          placeholder="인증번호 입력"
        />
        {message && <p className="message">{message}</p>}

        <InputGroup
          label="새 비밀번호"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호 입력"
        />
        {errorMessage.newPassword && <p className="error">{errorMessage.newPassword}</p>}

        <button type="submit" className="submit-button">
          비밀번호 재설정
        </button>

        {errorMessage.global && <p className="error">{errorMessage.global}</p>}
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>비밀번호 재설정이 완료되었습니다!</p>
            <button onClick={closeModal} className="close-button">확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

const InputGroup = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="input-group">
    <label className="label">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input"
      required
    />
  </div>
);

export default PasswordResetPage;

