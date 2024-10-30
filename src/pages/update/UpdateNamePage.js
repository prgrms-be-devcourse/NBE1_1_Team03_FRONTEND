// src/pages/UpdateNamePage.js
import React, { useState } from 'react';
import './UpdateNamePage.css';

function UpdateNamePage() {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/change-nickname', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ newNickname: nickname }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('닉네임이 성공적으로 변경되었습니다.');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || '닉네임 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('오류가 발생했습니다. 다시 시도해주세요.');
    }
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
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit" className="button">닉네임 변경</button>
      </form>
    </div>
  );
}

export default UpdateNamePage;
