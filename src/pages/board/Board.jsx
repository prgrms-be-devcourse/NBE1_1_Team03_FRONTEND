import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const Address = styled.p`
  font-size: 16px;
  color: #555;
`;

const ImageSlider = styled(Slider)`
  margin: 20px 0;
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
`;

const Image = styled.img`
  width: 100%; /* 너비를 100%로 설정하여 슬라이드 크기에 맞춤 */
  height: 150px; /* 고정된 높이 설정 */
  object-fit: contain; /* 비율을 유지하면서 잘림 방지 */
  border-radius: 5px;
`;

const InfoSection = styled.div`
  margin: 20px 0;
  font-weight: bold;
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
`;

const InfoItemContainer = styled.div`
  display: flex;
  margin: 5px 0;
  align-items: center; 
`;

const InfoTitle = styled.div`
  font-weight: normal;
  color: #88B0E4;
  margin-right: 15px;
  white-space: nowrap;
`;

const InfoItem = styled.div`
  margin: 5px 0;
  font-weight: normal;
  color: black;
`;

const CommentTitle = styled.h2`
  margin: 20px 0 10px; /* 위쪽 마진과 아래쪽 마진 설정 */
`;

const CommentSection = styled.div`
  margin: 20px 0;
  background-color: #e0e0e0;
  padding: 10px;
  max-height: 200px; /* 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 가능 */
`;

const Comment = styled.div`
  margin: 10px 0;
  padding: 5px 0;
  border-bottom: 1px solid #ccc; /* 구분선 */
`;

const CommentHeader = styled.div`
  font-weight: bold;
  color: #333;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterInput = styled.input`
  padding: 10px;
  flex-grow: 1;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const RegisterButton = styled.button`
  padding: 10px 20px;
  background-color: #87ceeb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Board = () => {
  const [boardData, setBoardData] = useState({});
  const [comments, setComments] = useState([]);
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImVtYWlsIjoiaHVuaWwxMjM0QGdtYWlsLmNvbSIsImF1dGhvcml0eSI6IkFETUlOIiwiaWF0IjoxNzMwMjQ4NTY2LCJleHAiOjE3MzAyNTA1NjZ9.UZ2pYOJUwOTpf-bagPofldJ15UqpusXs205Nzd3zs1U'; // 여기에 실제 토큰을 입력하세요
  const boardId = 19; // 게시판 ID

  // 데이터 fetching
  const fetchBoardData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        setBoardData(response.data.data);
        fetchComments(); // 댓글 조회 함수 호출
      } else {
        console.error('게시글 데이터 조회 오류:', response.data.message);
      }
    } catch (error) {
      console.error('데이터 로딩 중 오류 발생:', error);
    }
  };

  // 댓글 fetching
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        setComments(response.data.data);
      } else {
        console.error('댓글 데이터 조회 오류:', response.data.message);
      }
    } catch (error) {
      console.error('댓글 로딩 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  // 슬라이드 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container>
      <Header>{boardData.roadNameAddress || '주소를 불러오는 중...'}</Header>
      <Address>{boardData.detailedAddress || '상세주소를 불러오는 중...'}</Address>
      <ImageSlider {...settings}>
        {boardData.boardImgs ? boardData.boardImgs.map((img, index) => (
          <ImageBox key={index}>
            <Image src={img.boardImgUrl} alt={`게시글 이미지 ${index + 1}`} />
          </ImageBox>
        )) : (
          <ImageBox>
            <Image src="placeholder1.jpg" alt="사진 1" />
          </ImageBox>
        )}
      </ImageSlider>

      <InfoSection>
        게시글 정보
        <InfoItemContainer>
          <InfoTitle>게시글 유형</InfoTitle> 
          <InfoItem>{boardData.boardCategory || '정보를 불러오는 중...'}</InfoItem>
        </InfoItemContainer>
        <InfoItemContainer>
          <InfoTitle>쓰레기통 상태</InfoTitle> 
          <InfoItem>{boardData.updatedTrashcanStatus || '정보를 불러오는 중...'}</InfoItem>
        </InfoItemContainer>
        <InfoItemContainer>
          <InfoTitle>특이 사항</InfoTitle>  
          <InfoItem>{boardData.significant || '정보를 불러오는 중...'}</InfoItem>
        </InfoItemContainer>
      </InfoSection>

      <CommentTitle>댓글</CommentTitle>
      <CommentSection>
        {comments.length > 0 ? comments.map(comment => (
          <Comment key={comment.id}>
            <CommentHeader>
              {comment.nickname} ({comment.authority})
            </CommentHeader>
            <div>{comment.content}</div>
          </Comment>
        )) : (
          <Comment>댓글이 없습니다.</Comment>
        )}
      </CommentSection>

      <Footer>
        <FooterInput type="text" placeholder="댓글 내용" />
        <RegisterButton>등록</RegisterButton>
      </Footer>
    </Container>
  );
};

export default Board;