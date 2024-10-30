import axios from 'axios';

// 기본 설정
export const API_BASE_URL = window.location.hostname === 'localhost'
  ? "http://localhost:8080"
  : "http://10.0.2.2:8080";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 보내기 전 수행할 작업
    // 예: 토큰 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터 가공
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 인증 에러 처리
          break;
        case 404:
          // Not Found 에러 처리
          break;
        case 500:
          // 서버 에러 처리
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 