import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdatePhonePage.css';

function UpdatePhonePage() {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();

  // 인증번호 발송 요청
  const handleSendSms = async () => {
    try {
      const response = await fetch('http://localhost:8080/sms/send1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ phoneNum: phone }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('인증번호가 발송되었습니다.');
        setIsVerified(true);
      } else {
        setMessage(data.message || '인증번호 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 전화번호 변경 요청 (인증 코드 포함)
  const handleChangePhone = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      setMessage('전화번호 인증을 완료해주세요.');
      return;
    }

    if (!smsCode || smsCode.trim() === '') {
      setMessage('인증번호가 비어 있습니다. 인증번호를 입력해주세요.');
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

      if (response.ok) {
        setShowModal(true); // 전화번호 변경 성공 시 모달 표시
        setIsVerified(false);
      } else {
        const data = await response.json();
        setMessage(data.message || '전화번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('서버에 문제가 발생했습니다.');
    }
  };

  // 모달 닫기 핸들러 및 마이페이지로 이동
  const closeModalAndNavigate = () => {
    setShowModal(false);
    navigate('/mypage');
  };

  return (
    <div className="container">
      <h1 className="title">전화번호 변경</h1>
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
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            placeholder="인증번호 입력"
            className="input"
          />
        </div>

        <button type="button" onClick={handleChangePhone} className="submit-button">
          전화번호 변경
        </button>
        {message && <p className="message">{message}</p>}
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>전화번호가 성공적으로 변경되었습니다!</p>
            <button onClick={closeModalAndNavigate} className="close-button">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePhonePage;
