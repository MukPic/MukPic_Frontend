import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_ROOT_API}/v1`, // 기본 API 엔드포인트 설정
  timeout: 5000, // 타임아웃 설정 (선택 사항)
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 예제: 로컬스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답 그대로 반환
  (error) => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized - 로그인 필요");
      // 로그아웃 처리 및 리다이렉트 예제
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
