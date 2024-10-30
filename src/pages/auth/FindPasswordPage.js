import React, { useState } from 'react';
import './FindPasswordPage.css';

function FindPasswordPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (response.ok) setMessage('인증번호가 발송되었습니다.');
      else setErrorMessage(data.message || '인증번호 발송에 실패했습니다.');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('서버에 문제가 발생했습니다.');
    }
  };

  const handleVerifySms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await response.json();
      if (response.ok) setIsVerified(true);
      else setErrorMessage(data.message || '인증 실패.');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('서버에 문제가 발생했습니다.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      setErrorMessage('먼저 인증을 완료해주세요.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, code, newPassword }),
      });
      const data = await response.json();
      if (response.ok) setMessage('비밀번호가 성공적으로 변경되었습니다.');
      else setErrorMessage(data.message || '비밀번호 변경에 실패했습니다.');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('서버에 문제가 발생했습니다.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">비밀번호 찾기</h1>
      <form onSubmit={handleResetPassword} className="form">
        <InputGroup
          label="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디 입력"
        />
        <InputGroup
          label="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호 입력"
          hasButton
          buttonText="인증번호 발송"
          onButtonClick={handleSendSms}
        />
        <InputGroup
          label="인증번호"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="인증번호 입력"
          hasButton
          buttonText="인증번호 확인"
          onButtonClick={handleVerifySms}
        />
        <InputGroup
          label="새 비밀번호"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호 입력"
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit" className="submit-button">비밀번호 재설정</button>
      </form>
    </div>
  );
}

const InputGroup = ({ label, value, onChange, placeholder, type = 'text', hasButton, buttonText, onButtonClick }) => (
  <div className="input-group">
    <label className="label">{label}</label>
    <div className="input-wrapper">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
      />
      {hasButton && (
        <button type="button" onClick={onButtonClick} className="verify-button">
          {buttonText}
        </button>
      )}
    </div>
  </div>
);

export default FindPasswordPage;
