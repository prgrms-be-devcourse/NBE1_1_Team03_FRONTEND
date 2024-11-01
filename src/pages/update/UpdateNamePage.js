import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateNamePage.css';

function UpdateNamePage() {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nickname.trim()) {
      setErrorMessage('새 닉네임을 입력해주세요.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setErrorMessage('토큰이 없습니다. 다시 로그인해 주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/change-nickname', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ newNickname: nickname }),
      });

      if (response.ok) {
        setShowModal(true); 
        setNickname(''); 
      } else if (response.status === 401) {
        setErrorMessage('인증이 필요합니다. 다시 로그인해 주세요.');
      } else {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.message || '닉네임 변경에 실패했습니다.');
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
      <h1 className="title">닉네임 변경</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="새 닉네임 입력"
          className="input"
          required
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="button">닉네임 변경</button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>닉네임 변경이 완료되었습니다!</p>
            <button onClick={closeModalAndNavigate} className="close-button">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateNamePage;
