import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();


  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/send-for-unregistered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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


  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!smsCode || smsCode.trim() === '') {
      setMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          passwordCheck,
          nickname,
          phone,
          smsCode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.errors || {});
      } else {
        setErrorMessage({});
        setShowModal(true); 
      }
    } catch (error) {
      setErrorMessage({ global: '서버에 문제가 발생했습니다.' });
    }
  };

  const closeModalAndNavigate = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="title">SSCANNER</h1>
      <form onSubmit={handleSignUp} className="form">
        <InputGroup
          label="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디 입력(이메일 형식)"
        />
        {errorMessage.email && <p className="error">{errorMessage.email}</p>}

        <InputGroup
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        {errorMessage.password && <p className="error">{errorMessage.password}</p>}

        <InputGroup
          label="비밀번호 확인"
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          placeholder="비밀번호 확인"
        />
        {errorMessage.passwordCheck && <p className="error">{errorMessage.passwordCheck}</p>}

        <InputGroup
          label="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
        />
        {errorMessage.nickname && <p className="error">{errorMessage.nickname}</p>}

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
        {errorMessage.phone && <p className="error">{errorMessage.phone}</p>}

        <div className="verify-input-group">
          <input
            type="text"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            placeholder="인증번호 입력"
            className="input"
          />
        </div>
        {message && <p className="message">{message}</p>}

        <button type="submit" className="submit-button">
          회원 가입
        </button>

        {errorMessage.global && <p className="error">{errorMessage.global}</p>}
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>회원가입이 완료되었습니다!</p>
            <button onClick={closeModalAndNavigate} className="close-button">
              확인
            </button>
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

export default SignUpPage;
