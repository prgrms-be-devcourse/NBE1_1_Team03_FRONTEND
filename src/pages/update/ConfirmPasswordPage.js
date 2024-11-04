import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConfirmPasswordPage.css';

function ConfirmPasswordPage() {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get('next') || '/';

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/confirm-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: password,
      });

      const data = await response.json();
      if (response.ok && data.code === 200) {
        if (nextPath === 'update-phone') {
          navigate('/update-phone');
        } else if (nextPath === 'delete-account') {
          // 회원 탈퇴 요청 보내기
          const deleteResponse = await fetch('http://localhost:8080/api/users/delete', {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          if (deleteResponse.ok) {
            setShowModal(true); // 회원 탈퇴 성공 시 모달 표시
          } else {
            setErrorMessage('회원 탈퇴에 실패했습니다.');
          }
        }
      } else {
        setErrorMessage('비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const closeModalAndNavigate = () => {
    setShowModal(false);
    navigate('/main'); // 모달 닫기 후 메인 페이지로 이동
  };

  return (
    <div className="container">
      <h1 className="title">본인 확인</h1>
      <form onSubmit={handlePasswordSubmit} className="form">
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
        <button type="submit" className="button">인증 완료</button>
      </form>

      {/* 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>회원 탈퇴가 완료되었습니다!</p>
            <button onClick={closeModalAndNavigate} className="close-button">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmPasswordPage;
