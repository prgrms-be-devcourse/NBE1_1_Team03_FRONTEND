import axios from 'axios';

const myPageAxios = axios.create({
  baseURL: 'http://localhost:8080',
});

// 요청 인터셉터
myPageAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (토큰 만료 시 갱신 로직 추가)
myPageAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰 갱신 로직 추가 (refresh token 사용)
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post('http://localhost:8080/refresh', {
            token: refreshToken,
          });
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          // 요청을 재시도
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error('토큰 갱신에 실패했습니다:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default myPageAxios;
