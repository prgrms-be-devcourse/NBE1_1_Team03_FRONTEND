// Main.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import './Main.css';
import searchIcon from '../../assets/images/search-icon.png';
import BottomNavigation from '../../components/common/navigation/BottomNavigation';

function Main() {
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

  const goToDetail = (id) => {
    navigate(`/trashcan-detail/${id}`);
  };

  return (
    <div className="screen">
      <div className="container">
        <div className="search-bar">
          <img src={searchIcon} alt="검색 아이콘" className="search-icon" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="검색어를 입력하세요"
          />
          <button onClick={handleSearch} className="search-button">
            검색
          </button>
        </div>

        <Map center={currentPosition} style={{ width: '100%', height: '600px' }} level={3}>
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
          {selectedMarker && (
            <CustomOverlayMap
              position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
              yAnchor={1}
            >
              <div style={{ padding: '5px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
                <button onClick={() => goToDetail(selectedMarker.id)} className="detail-button">
                  상세보기
                </button>
              </div>
            </CustomOverlayMap>
          )}
        </Map>

        <div className="bulletin-button" onClick={() => navigate('/board')}>
          게시판 가기
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}

export default Main;
