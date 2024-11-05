import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateInfoPage.css';

function UpdateInfoPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 회원 탈퇴 모달 상태
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 상태

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    } else {
      // 사용자 정보 가져오기
      fetch('http://localhost:8080/api/users/my-page', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            setNickname(data.data.nickname);
            setEmail(data.data.email);
          } else {
            console.error('사용자 정보를 불러오는 데 실패했습니다.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [navigate]);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 로컬 저장소에서 토큰 삭제
    setShowLogoutModal(true); // 로그아웃 완료 모달 표시
  };

  // 회원 탈퇴 처리 함수
  const handleDeleteAccount = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    // 회원 탈퇴 요청 (소프트 딜리트)
    fetch('http://localhost:8080/api/users/delete', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          // 서버에서 탈퇴 처리가 성공적으로 이루어졌다면
          // 로컬 스토리지에서 액세스 토큰 삭제
          localStorage.removeItem('accessToken');
          setShowDeleteModal(true); // 회원 탈퇴 완료 모달 표시
        } else {
          console.error('회원 탈퇴 처리에 실패했습니다.', data.message);
          alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
      })
      .catch((error) => {
        console.error('탈퇴 요청 중 오류 발생:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  // 탈퇴 완료 후 모달에서 '확인' 버튼 클릭 시 로그인 페이지로 이동
  const closeDeleteModalAndNavigate = () => {
    setShowDeleteModal(false);
    navigate('/login'); // 로그인 페이지로 이동
  };

  // 로그아웃 모달 닫고 메인 페이지로 이동
  const closeLogoutModalAndNavigate = () => {
    setShowLogoutModal(false);
    navigate('/main'); // 메인 페이지로 이동
  };

  return (
    <div className="container">
      <h1 className="title"> {nickname || '사용자 닉네임'}</h1>
      <p className="subtitle">ID: {email || '사용자 이메일'}</p>
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
        <button onClick={handleLogout} className="button logout-button">
          로그아웃 <span className="arrow">✔️</span>
        </button>
        <button onClick={handleDeleteAccount} className="button">
          회원 탈퇴 <span className="arrow">⚠️</span>
        </button>
      </div>

      {/* 회원 탈퇴 완료 모달 */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>회원 탈퇴가 완료되었습니다!</p>
            <button onClick={closeDeleteModalAndNavigate} className="close-button">
              확인
            </button>
          </div>
        </div>
      )}

      {/* 로그아웃 완료 모달 */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>로그아웃이 완료되었습니다!</p>
            <button onClick={closeLogoutModalAndNavigate} className="close-button">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateInfoPage;
