import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Container = styled.div`
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
    padding-bottom: 100px; 
`;

const Title = styled.h1`
    font-size: 24px;
    margin: 0;
`;

const Address = styled.p`
    font-size: 14px;
    color: #666;
`;

const ImageSlider = styled(Slider)`
    margin: 20px 0;
`;

const ImageBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e0e0e0;
    cursor: pointer;
    border: ${props => (props.isSelected ? '3px solid #87ceeb' : 'none')};
`;

const Image = styled.img`
    width: 100%;
    height: auto;
    max-height: 30vh;
    object-fit: contain;
    border-radius: 0.5rem;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    margin: 10px 0;
`;

const InfoSection = styled.div`
    margin: 20px 0;
    font-weight: bold;
    background-color: #e0e0e0;
    padding: 10px;
    border-radius: 0.5rem;
`;

const InfoItemContainer = styled.div`
    display: flex;
    margin: 5px 0;
    align-items: center;
`;

const InfoTitle = styled.div`
    font-weight: normal;
    color: #88B0E4;
    margin-right: 10px;
    white-space: nowrap;
`;

const InfoItem = styled.div`
    margin: 5px 0;
    font-weight: normal;
    color: black;
`;

const PointsContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
`;

const PointsInput = styled.input`
    width: 40px;
    padding: 5px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    flex: 1;
    min-width: 80px;
    background-color: #87ceeb;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;

    &:hover {
        background-color: #6bc6e7;
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f9f9f9; 
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const Spacer = styled.div`
    width: 10px;
`;

const AdminEctBoard = () => {
    const { boardId } = useParams();
    const [boardData, setBoardData] = useState(null);
    const [points, setPoints] = useState('');
    const [chosenImgUrl, setChosenImgUrl] = useState(null); 
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImVtYWlsIjoiaHVuaWwxMjM0QGdtYWlsLmNvbSIsImF1dGhvcml0eSI6IkFETUlOIiwiaWF0IjoxNzMwNDY2NTI1LCJleHAiOjE3MzA0Njg1MjV9.ZlJ40Z_iVK5MGvH9gZ-5eFUwthJErnGKwke71PCJxig';

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/admin/boards/ect/${boardId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.code === 200) {
                    setBoardData(response.data.data);
                } else {
                    console.error('데이터 조회 오류:', response.data.message);
                }
            } catch (error) {
                console.error('API 요청 중 오류 발생:', error);
            }
        };

        fetchBoardData();
    }, [boardId, token]);

    if (!boardData) {
        return <div>로딩 중...</div>; 
    }

    const getBoardCategory = (category) => {
        switch (category) {
            case 'ADD':
                return '추가 게시글';
            case 'MODIFY':
                return '수정 게시글';
            case 'REMOVE':
                return '삭제 게시글';
            default:
                return '정보를 불러오는 중...';
        }
    };

    const getTrashCategory = (category) => {
        switch (category) {
            case 'NORMAL':
                return '일반 쓰레기통';
            case 'CIGARETTE':
                return '재떨이';
            default:
                return '정보를 불러오는 중...';
        }
    };

    const getTrashcanStatus = (status) => {
        switch (status) {
            case 'EMPTY':
                return '비어있음';
            case 'INTERMEDIATE':
                return '중간';
            case 'FULL':
                return '꽉 참';
            default:
                return '정보를 불러오는 중...';
        }
    };

    const handlePointAllocation = async () => {
        if (!points) {
            alert('포인트 수를 입력해주세요.');
            return;
        }
        
        try {
            const response = await axios.post(`http://localhost:8080/api/admin/points/${boardId}`, {
                point: parseInt(points), 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.code === 200) {
                alert('포인트 지급 완료!!');
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error('포인트 지급 중 오류 발생:', error);
        }
    };

    const handleApproval = async (approvalStatus) => {
        if (!chosenImgUrl) {
            alert('이미지를 선택해주세요.');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:8080/api/admin/boards/${boardId}`, {
                chosenImgUrl,
                approvalStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.code === 200) {
                alert('요청이 성공적으로 처리되었습니다.');
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error('PATCH 요청 중 오류 발생:', error);
        }
    };

    return (
        <Container>
            <Title>{boardData.roadNameAddress || '고덕로 80길 99'}</Title>
            <Address>{boardData.detailedAddress || '상세 주소 : 고덕센트럴아이파크 후문'}</Address>
            <SectionTitle>게시글 사진들</SectionTitle>
            <ImageSlider {...{ dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 }}>
                {boardData.images.map((img, index) => (
                    <ImageBox 
                        key={index} 
                        onClick={() => setChosenImgUrl(img.boardImgUrl)}
                        isSelected={chosenImgUrl === img.boardImgUrl}>
                        <Image src={img.boardImgUrl} alt={`게시글 이미지 ${index + 1}`} />
                    </ImageBox>
                ))}
            </ImageSlider>

        <SectionTitle>게시글 쓰레기통 정보</SectionTitle>
            <InfoSection>
                <InfoItemContainer>
                    <InfoTitle>게시글 유형</InfoTitle>
                    <InfoItem>{getBoardCategory(boardData.boardCategory)}</InfoItem>
                </InfoItemContainer>
                
                <InfoItemContainer>
                    <InfoTitle>쓰레기통 유형</InfoTitle>
                    <InfoItem>{getTrashCategory(boardData.trashCategory)}</InfoItem>
                </InfoItemContainer>
        
                <InfoItemContainer>
                    <InfoTitle>쓰레기통 상태</InfoTitle>
                    <InfoItem>{getTrashcanStatus(boardData.trashcanStatus)}</InfoItem>
                </InfoItemContainer>
            </InfoSection>

        <SectionTitle>특이사항</SectionTitle>
            <InfoSection>
                <InfoItem>{boardData.significant || '정보를 불러오는 중...'}</InfoItem>
            </InfoSection>

        <PointsContainer>
            <PointsInput 
                type="number" 
                value={points} 
                onChange={(e) => setPoints(e.target.value)} 
                placeholder="포인트 수" /> Points <Spacer />
            <Button onClick={handlePointAllocation}>지급</Button>
        </PointsContainer>

        <Footer>
            <Button onClick={() => handleApproval('APPROVED')}>반영</Button>
            <Spacer />
            <Button onClick={() => handleApproval('REJECTED')}>기각</Button>
        </Footer>
        </Container>
    );
};

export default AdminEctBoard;