import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './TrashcanDetail.css'; // CSS 파일 불러오기

function TrashcanDetail() {
    const location = useLocation();
    const { markerId } = location.state || {}; // 전달된 ID 가져오기
    const [trashcanInfo, setTrashcanInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrashcanInfo = async () => {
            if (markerId) {
                try {
                    const response = await fetch(`http://localhost:8080/api/trashcan/getTrashcan/${markerId}`);
                    if (response.ok) {
                        const result = await response.json();
                        if (result.code === 200) {
                            setTrashcanInfo(result.data); // 상세 정보 설정
                        }
                    }
                } catch (error) {
                    console.error("Error fetching trashcan info:", error);
                } finally {
                    setLoading(false); // 로딩 종료
                }
            }
        };

        fetchTrashcanInfo();
    }, [markerId]);

    if (loading) {
        return <div className="loading-message">Loading...</div>; // 로딩 중 메시지
    }

    if (!trashcanInfo) {
        return <div className="error-message">상세 정보를 찾을 수 없습니다.</div>; // 정보가 없는 경우
    }

    return (
        <div className="trashcan-detail-container">
            <div className="trashcan-detail-image">
                <img src={trashcanInfo.trashcanImgUrl} alt="쓰레기통" />
            </div>
            <div className="trashcan-detail-info">
                <h1>쓰레기통 상세 정보</h1>
                <p><strong>도로명 주소:</strong> {trashcanInfo.roadNameAddress}</p>
                <p><strong>상세 위치:</strong> {trashcanInfo.detailedAddress || '없음'}</p>
                <p><strong>쓰레기통 종류:</strong> {trashcanInfo.trashCategory}</p>
                <p><strong>쓰레기통 상태:</strong> {trashcanInfo.trashcanStatus}</p>
            </div>
        </div>
    );
}

export default TrashcanDetail;
