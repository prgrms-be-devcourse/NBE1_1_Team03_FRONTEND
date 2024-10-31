import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const MapContainer = styled.div`
  width: 100%;
  height: 60vh; 
`;

const ResultContainer = styled.div`
  margin-top: 2%;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9; 
  padding: 2%; 
  border-radius: 0.5rem; 
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.1); 
`;

const LandAddress = styled.h2`
  font-size: 2.4rem; 
  margin: 0;
  color: #333; 
  font-weight: bold; 
`;

const RoadAddress = styled.p`
  font-size: 1.6rem; 
  margin: 0.5rem 0;
  color: #666; 
`;

const Coordinates = styled.p`
  font-size: 1.4rem;
  margin: 0.5rem 0;
  color: #999; 
`;

const Button = styled.button`
  position: fixed; 
  bottom: 20px; 
  left: 50%;
  transform: translateX(-50%); 
  padding: 1% 2%;
  font-size: 1.6rem;
  color: white;
  background-color: #007bff; 
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3; 
  }
`;

const BoardMap = () => {
  const [result, setResult] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); 
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!window.kakao) {
      console.error('Kakao map script not loaded');
      return;
    }

    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);
      mapRef.current = mapInstance;

      const initialMarker = new window.kakao.maps.Marker({
        position: mapInstance.getCenter(),
      });
      initialMarker.setMap(mapInstance);
      markerRef.current = initialMarker;

      geocoderRef.current = new window.kakao.maps.services.Geocoder();

      window.kakao.maps.event.addListener(mapInstance, 'click', function(mouseEvent) {
        const latlng = mouseEvent.latLng;
        initialMarker.setPosition(latlng);

        const lat = latlng.getLat();
        const lng = latlng.getLng();

        geocoderRef.current.coord2Address(lng, lat, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const roadNameAddress = result[0].road_address ? result[0].road_address.address_name : ''; 
            const detailedAddress = result[0].address.address_name;

            setResult(
              <div>
                <LandAddress>{detailedAddress}</LandAddress>
                <RoadAddress>도로명 주소: {roadNameAddress || '주소 없음'}</RoadAddress> 
                <Coordinates>위도: {lat}</Coordinates>
                <Coordinates>경도: {lng}</Coordinates>
              </div>
            );

            setSelectedLocation({
              detailedAddress,
              roadNameAddress,
              latitude: lat,
              longitude: lng,
            });
          } else {
            setResult(
              <div>위도: {lat}, 경도: {lng} - 주소를 찾을 수 없습니다.</div>
            );
          }
        });
      });
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);

  const handleSubmit = () => {
    if (selectedLocation) {
      navigate('/boardcreate', { state: selectedLocation }); 
    } else {
      alert('위치를 선택해 주세요.');
    }
  };

  return (
    <div>
      <MapContainer id="map"></MapContainer>
      <ResultContainer id="clickLatlng">{result}</ResultContainer>
      <Button onClick={handleSubmit}>위치 선택 완료</Button>
    </div>
  );
};

export default BoardMap;