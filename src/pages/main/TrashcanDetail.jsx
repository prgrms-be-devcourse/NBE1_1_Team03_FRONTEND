import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TrashcanDetail = () => {
    const { trashcanId } = useParams();
    const [trashcanData, setTrashcanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrashcanDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/trashcan/getTrashcan/${trashcanId}`);
                setTrashcanData(response.data.data); // Accessing 'data' from the response
                setLoading(false);
            } catch (err) {
                setError('쓰레기통 정보를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchTrashcanDetails();
    }, [trashcanId]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>쓰레기통 상세 정보</h1>
            <img src={trashcanData.trashcanImgUrl} alt="쓰레기통" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            <div>
                <p>도로명 주소: {trashcanData.roadNameAddress}</p>
                <p>상세 주소: {trashcanData.detailedAddress || '정보 없음'}</p>
                <p>쓰레기 분류: {trashcanData.trashCategory}</p>
                <p>상태: {trashcanData.trashcanStatus}</p>
            </div>
        </div>
    );
};

export default TrashcanDetail;
