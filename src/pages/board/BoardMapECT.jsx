import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from 'styled-components';
import searchIcon from '../../assets/images/search-icon.png';

const Screen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2%;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 90%;
  position: relative;
  margin-bottom: 20px;
`;

const SearchIcon = styled.img`
  position: absolute;
  width: 5%;
  height: auto;
  left: 2%;
  pointer-events: none;
`;

const Input = styled.input`
  flex: 1;
  padding: 2% 12% 2% 10%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 3vw;

  @media (max-width: 600px) {
    font-size: 4vw;
    padding: 2% 8% 2% 8%;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 2%;
  background-color: transparent;
  border: none;
  color: #007bff;
  font-weight: bold;
  font-size: 4vw;
  cursor: pointer;
  transition: color 0.3s;

  &.clicked {
    color: blue;
  }

  @media (max-width: 600px) {
    font-size: 5vw;
  }
`;

const KakaoMap = styled(Map)`
  width: 100%;
  height: 600px;

  @media (max-width: 600px) {
    height: 65vh;
  }
`;

const MarkerInfoContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1.6rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function BoardMapECT() {
  const [searchWord, setSearchWord] = useState('');
  const [currentPosition, setCurrentPosition] = useState({ lat: 37.52647571, lng: 126.89747396 });
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentPosition(newPosition);
            fetchNearbyTrashcans(newPosition.lat, newPosition.lng);
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }
    };

    fetchCurrentPosition();
  }, []);

  const fetchNearbyTrashcans = async (latitude, longitude) => {
    try {
      const response = await fetch(`http://localhost:8080/api/trashcan/getNearByTrashcans?latitude=${latitude}&longitude=${longitude}`);
      if (response.ok) {
        const result = await response.json();
        if (result.code === 200 && Array.isArray(result.data)) {
          setMarkers(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching trashcan data:", error);
    }
  };

  const handleSearch = async () => {
    const button = document.querySelector('.search-button');
    button.classList.add('clicked');

    setTimeout(() => {
      button.classList.remove('clicked');
    }, 300);

    try {
      const response = await fetch(`http://localhost:8080/api/trashcan/search?word=${searchWord}`);
      if (response.ok) {
        const result = await response.json();
        if (result.code === 200 && Array.isArray(result.data)) {
          setMarkers(result.data);
          if (result.data.length > 0) {
            const firstMarker = result.data[0];
            setCurrentPosition({ lat: firstMarker.latitude, lng: firstMarker.longitude });
          }
        }
      }
    } catch (error) {
      console.error("Error searching trashcan data:", error);
    }
  };

  const handleSubmit = () => {
    if (selectedMarker) {
      const locationData = {
        trashcanId: selectedMarker.id,
        latitude: selectedMarker.latitude,
        longitude: selectedMarker.longitude,
        roadNameAddress: selectedMarker.roadNameAddress || '주소 없음',
        detailedAddress: selectedMarker.detailedAddress || '주소 없음',

      };
      navigate('/boardcreate', { state: locationData });
    } else {
      alert('마커를 선택해 주세요.');
    }
  };

  return (
    <Screen>
      <Container>
        <SearchBar>
          <SearchIcon src={searchIcon} alt="검색 아이콘" />
          <Input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="검색어를 입력하세요"
          />
          <SearchButton onClick={handleSearch} className="search-button">
            검색
          </SearchButton>
        </SearchBar>

        <KakaoMap center={currentPosition} level={3}>
          {markers.map((marker) => (
            <MapMarker
              key={marker.id}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 24, height: 35 },
              }}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}
        </KakaoMap>

        {selectedMarker && (
          <MarkerInfoContainer>
            <div>위도: {selectedMarker.latitude}</div>
            <div>경도: {selectedMarker.longitude}</div>
            <div>도로명 주소: {selectedMarker.roadNameAddress || '주소 없음'}</div>
            <div>상세 주소: {selectedMarker.detailedAddress || '주소 없음'}</div>
            <SubmitButton onClick={handleSubmit}>위치 선택 완료</SubmitButton>
          </MarkerInfoContainer>
        )}
      </Container>
    </Screen>
  );
}

export default BoardMapECT;