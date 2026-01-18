/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 환경 변수에서 백엔드 URL 가져오기
// Docker Compose 사용 시: API_BASE_URL=http://backend:8080
// 로컬 개발 시: API_BASE_URL이 없으면 기본값 localhost:8080 사용
const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:8080'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Docker 컨테이너에서 외부 접근 허용
    port: 5173,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false
      },
      '/login': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false
      },
      '/signup': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
