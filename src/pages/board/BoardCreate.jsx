import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: 1px solid #87ceeb;
  background: transparent;
  color: #87ceeb;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  margin: 0 5px;
  &:hover {
    background: #87ceeb;
    color: white;
  }
`;

const AddressSection = styled.div`
  background-color: #e0e0e0;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const ImagePlaceholder = styled.div`
  height: 150px;
  border: 2px dashed #87ceeb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
`;

const PlusImg = styled.div`
  font-size: 30px; 
  color: #87ceeb;
  margin-top: 5px; 
`;

const SectionTitle = styled.p`
  font-weight: bold;
`;

const DescriptionSection = styled.div`
  margin-bottom: 20px;
`;

const DetailButton = styled(Button)`
  width: 95%;
  background: #87ceeb;
  color: white;
`;

const BoardCreate = () => {
  return (
    <Container>
      <Title>신고 작성 페이지</Title>

      <SectionTitle>게시글 유형을 선택해주세요.</SectionTitle>
      <ButtonContainer>
        <Button>신규 등록</Button>
        <Button>수정</Button>
        <Button>삭제</Button>
      </ButtonContainer>
      
      <AddressSection>
        <p>여기를 누르면 지도가 나옵니다. 지도에 마커를 찍어 장소를 추가해 주세요.</p>
      </AddressSection>
      
      <ImagePlaceholder>
        사진을 추가해 주세요.
        <PlusImg>+</PlusImg>
        </ImagePlaceholder>
      
      <SectionTitle>쓰레기통 상태를 선택해 주세요.</SectionTitle>
      <ButtonContainer>
          <Button>거의 안참</Button>
          <Button>중간</Button>
          <Button>꽉참</Button>
      </ButtonContainer>
      
      <DescriptionSection>
        <SectionTitle>쓰레기통 특이사항을 작성해 주세요.</SectionTitle>
        <textarea rows="4" style={{ width: '93%', borderRadius: '5px', border: '1px solid #ccc', padding: '10px' }} />
      </DescriptionSection>
      
      <DetailButton>쓰레기통 제보</DetailButton>
    </Container>
  );
};

export default BoardCreate;