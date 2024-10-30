import React, { useState } from 'react';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 여부

  // 인증번호 발송 핸들러
  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
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

  // 인증번호 확인 핸들러
  const handleVerifySms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, smsCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        setMessage('인증이 완료되었습니다.');
      } else {
        setMessage(data.message || '인증 실패.');
      }
    } catch (error) {
      setMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
      console.error('Error:', error);
    }
  };

  // 회원가입 핸들러
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      setMessage('전화번호 인증을 완료해주세요.');
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
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.errors || {});
      } else {
        alert('회원가입 성공!');
        setErrorMessage({});
      }
    } catch (error) {
      setErrorMessage({ global: '서버에 문제가 발생했습니다.' });
    }
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
          <button type="button" onClick={handleVerifySms} className="verify-button">
            인증번호 확인
          </button>
        </div>
        {message && <p className="message">{message}</p>}

        <button type="submit" className="submit-button">
          회원 가입
        </button>

        {errorMessage.global && <p className="error">{errorMessage.global}</p>}
      </form>
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