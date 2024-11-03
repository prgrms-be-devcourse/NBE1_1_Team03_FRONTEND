// src/components/UserInfo.jsx
import React from 'react';
import './UserInfo.css'; // 필요한 스타일이 있다면 추가

const UserInfo = ({ userInfo }) => (
  <div className="user-info">
    <div className="info-row">
      <span className="info-label">아이디</span>
      <span className="info-value">{userInfo.email}</span>
    </div>
    <div className="info-row">
      <span className="info-label">핸드폰 번호</span>
      <span className="info-value">{userInfo.phone}</span>
    </div>
    <div className="info-row">
      <span className="info-label">닉네임</span>
      <span className="info-value">{userInfo.nickname}</span>
    </div>
  </div>
);

export default UserInfo;
