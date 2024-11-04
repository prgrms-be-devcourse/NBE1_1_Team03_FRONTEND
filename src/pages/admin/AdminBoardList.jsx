import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import axios from 'axios';

const H1 = styled.h2`
    color: black;
    font-size: 24px;
`;

const Container = styled.div`
    padding: 20px;
    background-color: #f5f5f5; 
    padding-bottom: 80px;

    @media (max-width: 768px) {
      padding: 10px;
    }
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: #D9D9D9;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 10px 5px;
  flex: 1;
  cursor: pointer;
  margin: 0 5px;
  min-width: 80px;

  ${(props) => props.isSelected && css`
    background-color: #4C4C4C;
    color: white;
  `}

  &:hover {
    background-color: #4C4C4C;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 8px 5px;
    font-size: 14px;
  }
`;

const ButtonImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const AdditionalButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const AdditionalButton = styled.button`
  background-color: #D9D9D9;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  flex: 1;
  cursor: pointer;
  margin-right: 5px;
  min-width: 120px;

  ${(props) => props.isSelected && css`
    background-color: #4C4C4C;
    color: white;
  `}

  &:hover {
    background-color: #4C4C4C;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 14px;
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

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 15px;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const Description = styled.div`
  flex: 1;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  position: absolute; 
  bottom: 60px; 
  left: 0;
  right: 0;
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

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f5f5; 
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const AdminBoardList = () => {
  const navigate = useNavigate();
  const [boardCategory, setBoardCategory] = useState('ADD'); 
  const [trashCategory, setTrashCategory] = useState('NORMAL'); 
  const [approvalStatus, setApprovalStatus] = useState('REVIEWING'); 
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('accessToken');

  const fetchItems = useCallback(async (page = 0) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/boards`, {
        params: {
          board_category: boardCategory,
          trash_category: trashCategory,
          approval_status: approvalStatus,
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
  }, [boardCategory, trashCategory, approvalStatus, token]);

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

  const handleApprovalChange = (status) => {
    setApprovalStatus(status);
    fetchItems();
  };

  const handlePageChange = (page) => {
    fetchItems(page);
  };

  const handleItemClick = (item) => {
    const { id } = item;
    if (boardCategory === 'MODIFY') {
      navigate(`/admin/modifyBoard/${id}`);
    } else {
      navigate(`/admin/ectBoard/${id}`);
    }
  };

  return (
    <Container>
      <H1>어드민 전용 게시글 목록</H1>
      
      <Header>
        <Button 
          onClick={() => handleTrashChange('NORMAL')}
          isSelected={trashCategory === 'NORMAL'}>
          <ButtonImage src="/images/trashcan.png" alt="일반 쓰레기통" />
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

      <AdditionalButtons>
        <AdditionalButton 
          onClick={() => handleApprovalChange('REVIEWING')}
          isSelected={approvalStatus === 'REVIEWING'}>
          리뷰 중
        </AdditionalButton>
        <AdditionalButton 
          onClick={() => handleApprovalChange('APPROVED')}
          isSelected={approvalStatus === 'APPROVED'}>
          승인됨
        </AdditionalButton>
        <AdditionalButton 
          onClick={() => handleApprovalChange('REJECTED')}
          isSelected={approvalStatus === 'REJECTED'}>
          거부됨
        </AdditionalButton>
      </AdditionalButtons>

      <ItemList>
        {items.map((item) => (
          <Item key={item.id} onClick={() => handleItemClick(item)}> 
            <Image src={item.boardFirstImgUrl} alt="게시글 이미지" />
            <Description>
              <h4>{item.roadNameAddress}</h4>
              <p>{item.detailedAddress}</p>
            </Description>
          </Item>
        ))}
      </ItemList>

      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <PageButton key={index} onClick={() => handlePageChange(index)}>
            {index + 1}
          </PageButton>
        ))}
      </Pagination>

      <Footer>
        <Button onClick={() => navigate('/main')}>메인</Button>
        <Button onClick={() => navigate('/boardList')} isSelected={true}>게시판</Button>
        <Button onClick={() => navigate('/products')}>상품</Button>
        <Button onClick={() => navigate('/mypage')}>마이</Button>
      </Footer>
    </Container>
  );
};

export default AdminBoardList;