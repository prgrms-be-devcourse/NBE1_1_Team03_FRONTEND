import { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useNavigate } from 'react-router-dom';
import './Main.css';
import searchIcon from '../../assets/images/search-icon.png';
import BottomNavigation from '../../components/common/navigation/BottomNavigation';

function Main() {
  const navigate = useNavigate();
  const [searchWord, setSearchWord] = useState('');
  const [currentPosition, setCurrentPosition] = useState({ lat: 37.52647571, lng: 126.89747396 });
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchCurrentPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }
    };

    fetchCurrentPosition();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/trashcan/search?word=${searchWord}`);
      const result = await response.json();
      if (result.code === 200) {
        setMarkers(result.data);
      }
    } catch (error) {
      console.error("Error fetching trashcan data:", error);
    }
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
            placeholder="검색어를 입력하세요"
          />
          <button onClick={handleSearch} className="search-button">
            검색
          </button>
        </div>

        <Map
          center={currentPosition}
          style={{ width: '100%', height: '600px' }}
          level={3}
        >
          {markers.map((marker) => (
            <MapMarker
              key={marker.id}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 24, height: 35 },
              }}
            />
          ))}
        </Map>

        <div 
          className="bulletin-button"
          onClick={() => navigate('/board')}
        >
          게시판 가기
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}

export default Main; 