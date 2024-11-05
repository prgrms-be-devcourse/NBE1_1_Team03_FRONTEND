import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Container = styled.div`
  padding: 2%; 
  max-width: 90%; 
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 1rem; 
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; 
  height: 100vh; 
`;

const Header = styled.h1`
  font-size: 5vw; 
  margin: 0;
`;

const Address = styled.p`
  font-size: 4vw; 
  color: #555;
`;

const ImageSlider = styled(Slider)`
  margin: 3% 0; 
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
`;

const Image = styled.img`
  width: 100%;
  height: auto; 
  max-height: 25vh; 
  object-fit: contain;
  border-radius: 0.5rem; 
`;

const InfoSection = styled.div`
  margin: 3% 0; 
  font-weight: bold;
  background-color: #e0e0e0;
  padding: 2%; 
  border-radius: 0.5rem;
`;

const InfoItemContainer = styled.div`
  display: flex;
  margin: 1% 0;
  align-items: center; 
`;

const InfoTitle = styled.div`
  font-weight: normal;
  color: #88B0E4;
  margin-right: 2%;
  white-space: nowrap;
`;

const InfoItem = styled.div`
  margin: 1% 0;
  font-weight: normal;
  color: black;
`;

const CommentTitle = styled.h2`
  margin: 2% 0;
  font-size: 4vw;
`;

const CommentSection = styled.div`
  margin: 2% 0;
  background-color: #e0e0e0;
  padding: 2%;
  max-height: 30vh;
  overflow-y: auto;
  flex-grow: 1;
`;

const Comment = styled.div`
  margin: 1% 0;
  padding: 1% 0;
  border-bottom: 1px solid #ccc;
`;

const CommentHeader = styled.div`
  font-weight: bold;
  color: #333;
`;

const CommentDeleteButton = styled.button`
  background-color: #ff4d4d; 
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.5vw;
  padding: 0.5% 1%;
  
  &:hover {
    background-color: #ff1a1a;
  }
`;

const CommentInputSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2%;
  padding: 2%;
`;

const CommentInput = styled.input`
  padding: 2%;
  flex-grow: 1;
  margin-right: 2%;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 2.5vw;
`;

const RegisterButton = styled.button`
  padding: 1% 2%;
  background-color: #87ceeb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 2vw;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2% 0;
`;

const DeleteButton = styled.button`
  flex: 1; 
  padding: 1.5% 0; 
  background-color: #ff4d4d; 
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 2vw;
  margin-right: 1%; 
  min-width: 120px; 

  &:hover {
    background-color: #ff1a1a;
  }

  &:last-child {
    margin-right: 0; 
  }
`;

const EditButton = styled(DeleteButton)`
  background-color: #87ceeb; 
  
  &:hover {
    background-color: #5bc0de; 
  }
`;

const Board = () => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [boardData, setBoardData] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('accessToken');

  const fetchComments = useCallback(async () => {
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
  }, [boardId, token]);

  const fetchBoardData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        setBoardData(response.data.data);
        fetchComments(); 
      } else {
        console.error('게시글 데이터 조회 오류:', response.data.message);
      }
    } catch (error) {
      console.error('데이터 로딩 중 오류 발생:', error);
    }
  }, [boardId, fetchComments, token]);

  const deleteBoard = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        alert(response.data.message);
        navigate('/boardList');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('에러 발생');
    } 
  }

  const addComment = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/comments`, {
        boardId,
        content: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 201) {
        setNewComment('');
        fetchComments();
      } else {
        console.error('댓글 생성 오류:', response.data.message);
      }
    } catch (error) {
      console.error('댓글 추가 중 오류 발생:', error);
    }
  };

  const delteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        fetchComments();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('에러 발생');
    } 
  }

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  const settings = {
    dots: true,
    infinite: boardData.boardImgs && boardData.boardImgs.length > 1, // 여러 장일 때만 슬라이드 가능
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container>
      <Header>{boardData.roadNameAddress || '주소를 불러오는 중...'}</Header>
      <Address>{boardData.detailedAddress || '상세주소를 불러오는 중...'}</Address>
      <ImageSlider {...settings}>
        {boardData.boardImgs && boardData.boardImgs.length > 0 ? (
          boardData.boardImgs.map((img, index) => (
            <ImageBox key={index}>
              <Image src={img.boardImgUrl} alt={`게시글 이미지 ${index + 1}`} />
            </ImageBox>
          ))
        ) : (
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
            {comment.isAuthor && (
              <CommentDeleteButton onClick={() => delteComment(comment.id)}> 삭제 </CommentDeleteButton>
            )}
          </Comment>
        )) : (
          <Comment>댓글이 없습니다.</Comment>
        )}
      </CommentSection>

      <CommentInputSection>
        <CommentInput 
          type="text" 
          placeholder="댓글 내용" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
        />
        <RegisterButton onClick={addComment}>등록</RegisterButton>
      </CommentInputSection>

      <ButtonContainer>
        {boardData.isAuthor && ( 
          <>
            <DeleteButton onClick={deleteBoard}> 게시글 삭제하기 </DeleteButton>
            <EditButton onClick={() => navigate(`/boardmodify/${boardId}`)}> 게시글 수정하기 </EditButton>
          </>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default Board;