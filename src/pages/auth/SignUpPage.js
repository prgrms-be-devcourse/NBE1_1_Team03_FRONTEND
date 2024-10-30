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
      setMessage('서��에 문제가 발생했습니다. 다시 시도해주세요.');
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
    <div style={styles.container}>
      <h1 style={styles.title}>SSCANNER</h1>
      <form onSubmit={handleSignUp} style={styles.form}>
        {/* 이메일 입력 */}
        <InputGroup
          label="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디 입력(이메일 형식)"
        />
        {errorMessage.email && <p style={styles.error}>{errorMessage.email}</p>}

        {/* 비밀번호 입력 */}
        <InputGroup
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        {errorMessage.password && <p style={styles.error}>{errorMessage.password}</p>}

        {/* 비밀번호 확인 */}
        <InputGroup
          label="비밀번호 확인"
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          placeholder="비밀번호 확인"
        />
        {errorMessage.passwordCheck && <p style={styles.error}>{errorMessage.passwordCheck}</p>}

        {/* 닉네임 입력 */}
        <InputGroup
          label="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
        />
        {errorMessage.nickname && <p style={styles.error}>{errorMessage.nickname}</p>}

        {/* 전화번호 입력 및 인증번호 발송 */}
        <div style={styles.inputGroup}>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호 입력"
            style={styles.input}
          />
          <button type="button" onClick={handleSendSms} style={styles.smallButton}>
            인증번호 발송
          </button>
        </div>
        {errorMessage.phone && <p style={styles.error}>{errorMessage.phone}</p>}

        {/* 인증번호 입력 및 확인 */}
        <div style={styles.inputGroup}>
          <input
            type="text"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            placeholder="인증번호 입력"
            style={styles.input}
          />
          <button type="button" onClick={handleVerifySms} style={styles.smallButton}>
            인증번호 확인
          </button>
        </div>
        {message && <p style={styles.message}>{message}</p>}

        {/* 회원가입 버튼 */}
        <button type="submit" style={styles.submitButton}>
          회원 가입
        </button>

        {/* 전역 오류 메시지 */}
        {errorMessage.global && <p style={styles.error}>{errorMessage.global}</p>}
      </form>
    </div>
  );
}

const InputGroup = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={styles.input}
      required
    />
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F8F8FA',
  },
  title: {
    fontSize: '150px',
    fontWeight: '700',
    marginBottom: '30px',
  },
  form: {
    width: '80%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
  smallButton: {
    marginTop: '5px',
    alignSelf: 'flex-end',
    padding: '10px 20px',
    backgroundColor: '#D9D9D9',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  submitButton: {
    width: '100%',
    padding: '20px',
    fontSize: '24px',
    backgroundColor: '#BDBDBD',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  message: {
    marginTop: '10px',
    fontSize: '14px',
    color: 'red',
  },
  error: {
    color: 'red',
    marginTop: '5px',
  },
};

export default SignUpPage;
