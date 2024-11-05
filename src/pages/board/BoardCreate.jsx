import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
  background: ${({ selected }) => (selected ? '#87ceeb' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : '#87ceeb')};
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
  cursor: pointer; 
`;

const ImagePlaceholder = styled.div`
  border: 2px dashed #87ceeb;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  color: #333;
  margin-bottom: 20px;
  position: relative;
  max-height: 150px;
  overflow-y: auto;
`;

const PlusImg = styled.div`
  font-size: 30px; 
  color: #87ceeb;
  margin-left: 10px;
  cursor: pointer;
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

const InfoSection = styled.div`
  margin-bottom: 20px;
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
`;

const FileInput = styled.input`
  margin-right: 10px;
`;

const BoardCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trashcanId, latitude, longitude, roadNameAddress, detailedAddress } = location.state || {};

  const [files, setFiles] = useState([]);
  const [significant, setSignificant] = useState("");
  const [trashCategory, setTrashCategory] = useState("NORMAL");
  const [updatedTrashcanStatus, setUpdatedTrashcanStatus] = useState("FULL");
  const [boardCategory, setBoardCategory] = useState("");

  const token = localStorage.getItem('accessToken');

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const addFileInput = () => {
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.multiple = true;
    newInput.onchange = handleFileChange;
    newInput.style.margin = '5px 0';
    document.getElementById('file-inputs').appendChild(newInput);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append('data', new Blob([JSON.stringify({
      boardCategory,
      significant,
      trashcanId,
      latitude,
      longitude,
      roadNameAddress,
      detailedAddress,
      trashCategory,
      updatedTrashcanStatus
    })], { type: 'application/json' }));

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:8080/api/boards', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      navigate('/boardList');
    } catch (error) {
      alert('제출 실패!');
    }
  };

  
  const handleAddressClick = () => {
    if (boardCategory === "ADD") {
      navigate('/boardmap');
    } else {
      navigate('/boardmap-ect');
    }
  };

  return (
    <Container>
      <Title>신고 작성 페이지</Title>

      <SectionTitle>게시글 유형을 선택해주세요.</SectionTitle>
      <ButtonContainer>
        <Button onClick={() => setBoardCategory("ADD")} selected={boardCategory === "ADD"}>신규 등록</Button>
        <Button onClick={() => setBoardCategory("MODIFY")} selected={boardCategory === "MODIFY"}>수정</Button>
        <Button onClick={() => setBoardCategory("REMOVE")} selected={boardCategory === "REMOVE"}>삭제</Button>
      </ButtonContainer>
      
      <AddressSection onClick={handleAddressClick}>
        <p>여기를 누르면 지도가 나오니 마커를 찍어주세요. </p>
      </AddressSection>

      <InfoSection>
        <SectionTitle>선택된 위치 정보</SectionTitle>
        <p>도로명 주소: {roadNameAddress || '주소 없음'}</p>
        <p>지번 주소: {detailedAddress || '주소 없음'}</p>
        <p>위도: {latitude || '정보 없음'}</p>
        <p>경도: {longitude || '정보 없음'}</p>
      </InfoSection>

      <ImagePlaceholder>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: '0' }}>사진을 추가해 주세요.</p> 
          <PlusImg onClick={addFileInput}>+</PlusImg> 
        </div>
        <div id="file-inputs">
          <FileInput type="file" multiple onChange={handleFileChange} />
          {files.map((file, index) => (
            <p key={index}>{file.name}</p>
          ))}
        </div>
      </ImagePlaceholder>

      <SectionTitle>쓰레기통 유형을 선택해 주세요.</SectionTitle>
      <ButtonContainer>
        <Button onClick={() => setTrashCategory("NORMAL")} selected={trashCategory === "NORMAL"}>일반 쓰레기통</Button>
        <Button onClick={() => setTrashCategory("CIGARETTE")} selected={trashCategory === "CIGARETTE"}>재떨이</Button>
      </ButtonContainer>

      <SectionTitle>쓰레기통 상태를 선택해 주세요.</SectionTitle>
      <ButtonContainer>
        <Button onClick={() => setUpdatedTrashcanStatus("EMPTY")} selected={updatedTrashcanStatus === "EMPTY"}>비어 있음</Button>
        <Button onClick={() => setUpdatedTrashcanStatus("INTERMEDIATE")} selected={updatedTrashcanStatus === "INTERMEDIATE"}>중간</Button>
        <Button onClick={() => setUpdatedTrashcanStatus("FULL")} selected={updatedTrashcanStatus === "FULL"}>꽉참</Button>
      </ButtonContainer>

      <DescriptionSection>
        <SectionTitle>쓰레기통 특이사항을 작성해 주세요.</SectionTitle>
        <textarea
          rows="4"
          style={{ width: '93%', borderRadius: '5px', border: '1px solid #ccc', padding: '10px' }}
          value={significant}
          onChange={(e) => setSignificant(e.target.value)}
        />
      </DescriptionSection>

      <DetailButton onClick={handleSubmit}>쓰레기통 제보</DetailButton>
    </Container>
  );
};

export default BoardCreate;