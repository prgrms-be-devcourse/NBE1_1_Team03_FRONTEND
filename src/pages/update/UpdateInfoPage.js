import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateInfoPage.css';

function UpdateInfoPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">tester</h1>
      <p className="subtitle">ID: test12345@gmail.com</p>
      <div className="button-container">
        <button onClick={() => navigate('/update-name')} className="button">
          닉네임 변경 <span className="arrow">✔️</span>
        </button>
        <button onClick={() => navigate('/confirm-password?next=update-phone')} className="button">
          휴대폰 번호 변경 <span className="arrow">✔️</span>
        </button>
        <button onClick={() => navigate('/update-password')} className="button">
          비밀번호 변경 <span className="arrow">✔️</span>
        </button>
      </div>
    </div>
  );
}

export default UpdateInfoPage;
