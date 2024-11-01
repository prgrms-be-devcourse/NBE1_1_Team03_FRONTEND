import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdatePasswordPage.css';

function UpdatePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowModal(true);
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const closeModalAndNavigate = () => {
    setShowModal(false);
    navigate('/mypage');
  };

  return (
    <div className="container">
      <h1 className="title">비밀번호 변경</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label className="label">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호 입력"
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label className="label">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 입력"
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label className="label">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="input"
            required
          />
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button type="submit" className="button">비밀번호 변경</button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>비밀번호 변경이 완료되었습니다!</p>
            <button onClick={closeModalAndNavigate} className="close-button">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePasswordPage;
