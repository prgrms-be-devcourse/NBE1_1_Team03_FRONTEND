import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import BottomNavigation from '../../components/common/navigation/BottomNavigation';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const H1 = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Header = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const AdditionalButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${({ isSelected }) => (isSelected ? '#3498db' : '#ccc')};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#2980b9' : '#aaa')};
  }
`;

const ButtonImage = styled.img`
  width: 20px;
  height: 20px;
`;

const AdditionalButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ isSelected }) => (isSelected ? '#3498db' : '#ccc')}; 
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#2980b9' : '#aaa')};
  }
`;


const AddButton = styled.button`
  background-color: #FFA500;
  color: black;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 20px;
  top: 20px;

  &:hover {
    background-color: #FF8C00;
  }

  @media (max-width: 360px) {
    width: 35px;
    height: 35px;
  }
`;

const AdminButton = styled.button`
  background-color: #D9D9D9;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  margin-right: 5px;
  min-width: 120px;

  &:hover {
    background-color: #4C4C4C;
    color: white;
  }

  @media (max-width: 360px) {
    padding: 8px 10px;
    font-size: 14px;
    width: 100%; /* Full width on small screens */
    margin: 5px 0; /* Add margin for spacing */
  }
`;

const ItemList = styled.div`
  margin-bottom: 20px;
`;

const Item = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer; 
  
  @media (max-width: 360px) {
    padding: 10px;
    flex-direction: column; /* Stack image and description on small screens */
    align-items: flex-start; /* Align items to the start */
  }
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 15px;

  @media (max-width: 360px) {
    width: 50px;
    height: 50px;
    margin-bottom: 10px; /* Add margin for spacing */
  }
`;

const Description = styled.div`
  flex: 1;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px; 
  position: relative; 
  bottom: 10px; 
`;

const PageButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 360px) {
    font-size: 14px;
  }
`;

const BoardList = () => {
  const navigate = useNavigate();
  const [boardCategory, setBoardCategory] = useState('ADD'); 
  const [trashCategory, setTrashCategory] = useState('NORMAL'); 
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const token = localStorage.getItem('accessToken');

  const fetchItems = useCallback(async (page = 0) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/boards`, {
        params: {
          board_category: boardCategory,
          trash_category: trashCategory,
          page: page,
          size: 5
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.code === 200) {
        setItems(response.data.data.boardList.content);
        setTotalPages(response.data.data.boardList.totalPages);
      } else {
        console.error(response.data.message); 
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error); 
    }
  }, [boardCategory, trashCategory, token]);

  useEffect(() => {
    fetchItems(); 
  }, [fetchItems]);

  const handleCategoryChange = (category) => {
    setBoardCategory(category);
    fetchItems();
  };

  const handleTrashChange = (category) => {
    setTrashCategory(category);
    fetchItems();
  };

  const handlePageChange = (page) => {
    fetchItems(page);
  };

  return (
    <Container>
      <H1>게시글 목록</H1>
      
      <Header>
        <Button 
          onClick={() => handleTrashChange('NORMAL')}
          isSelected={trashCategory === 'NORMAL'}>
          <ButtonImage src= "/images/trashcan.png" alt="일반 쓰레기통" />
          일반 쓰레기통
        </Button>
        <Button 
          onClick={() => handleTrashChange('CIGARETTE')}
          isSelected={trashCategory === 'CIGARETTE'}>
          <ButtonImage src="/images/smoke.png" alt="재떨이" />
          재떨이
        </Button>
      </Header>

      <AdditionalButtons>
        <AdditionalButton 
          onClick={() => handleCategoryChange('ADD')}
          isSelected={boardCategory === 'ADD'}>
          추가 게시글
        </AdditionalButton>
        <AdditionalButton 
          onClick={() => handleCategoryChange('MODIFY')}
          isSelected={boardCategory === 'MODIFY'}>
          수정 게시글
        </AdditionalButton>
        <AdditionalButton 
          onClick={() => handleCategoryChange('REMOVE')}
          isSelected={boardCategory === 'REMOVE'}>
          삭제 게시글
        </AdditionalButton>
      </AdditionalButtons>

      <ItemList>
        {items.map((item) => (
          <Item key={item.id} onClick={() => navigate(`/board/${item.id}`)}> 
            <Image src={item.boardFirstImgUrl} alt="게시글 이미지" />
            <Description>
              <h4>{item.roadNameAddress}</h4>
              <p>{item.detailedAddress}</p>
            </Description>
          </Item>
        ))} 

        <AddButton onClick={() => navigate('/boardcreate')}>
          <ButtonImage src="/images/pencil.png" alt="write" />
        </AddButton>
      </ItemList>

      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <PageButton key={index} onClick={() => handlePageChange(index)}>
            {index + 1}
          </PageButton>
        ))}
      </Pagination>

      <AdminButton onClick={() => navigate('/admin/boardList')}>
          관리자 페이지로 이동하기
      </AdminButton>   
      
      <BottomNavigation/>
    </Container>
  );
};

export default BoardList;