# React 개발 규칙 및 기술 스택

## 🎯 프로젝트 특성
- **공장 데이터 입력 및 시각화 중심**: 통계, 그래프 위주의 대시보드
- **Spring Boot + React 조합**: Spring Boot API와 연동
- **Docker Compose 개발 환경**: 로컬 개발 단계에서 테스트
- **최신 문법 유지, 오버스펙 제거**: 필요한 기능만 구현

---

## 기술 스택

### 핵심 프레임워크 및 도구
- **React**: 웹 프론트엔드 프레임워크
- **Vite**: 빌드 도구 (빠른 개발 서버, HMR)
- **Tailwind CSS**: 유틸리티 CSS 프레임워크 (스타일링)
- **TypeScript**: 사용 안 함 (JavaScript만 사용)

### 상태 관리 및 데이터 페칭
- **Zustand**: 전역 상태 관리 (로그인 상태 등)
- **React Query (TanStack Query)**: 서버 데이터 페칭 및 캐싱

### 데이터 시각화
- **Chart.js** 또는 **Recharts**: 통계 그래프 시각화
  - 공정별 NG 비율 (막대 그래프)
  - 부품별 NG 비율 (막대 그래프)
  - 기간별 추세 분석 (라인 그래프)

### 라우팅
- **React Router**: 페이지 라우팅

### 개발 환경
- **Docker Compose**: Spring Boot + MySQL과 함께 로컬 개발 환경 구성
- **프록시 설정**: 개발 서버에서 Spring Boot API로 요청 전달

---

## 개발 패턴

### 서버 데이터 관리
- **React Query (`useQuery` / `useMutation`) 사용**
  - 데이터 페칭, 캐싱, 자동 리프레시
  - 로딩/에러 상태 자동 관리
  - 예시:
    ```javascript
    const { data, isLoading, error } = useQuery({
      queryKey: ['dailyProduction', date],
      queryFn: () => api.getDailyProduction(date)
    });
    ```

### 전역 상태 관리
- **Zustand Store 사용** (로그인 상태 등)
  - 예시:
    ```javascript
    const useUserStore = create((set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null })
    }));
    ```

### URL 파라미터 및 네비게이션
- **`useParams`**: URL 파라미터 읽기
- **`useNavigate`**: 페이지 이동

### 사이드 이펙트
- **`useEffect`는 최소한으로 사용**
  - React Query가 대부분의 데이터 페칭을 처리
  - 브리지 역할이나 특수한 사이드 이펙트 처리 시에만 사용

---

## 프로젝트 구조

```
q-track-frontend/
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── charts/        # 그래프 컴포넌트
│   │   └── forms/         # 입력 폼 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Dashboard.js
│   │   ├── DataInput.js
│   │   └── Statistics.js
│   ├── stores/            # Zustand 스토어
│   │   └── userStore.js
│   ├── api/               # API 클라이언트
│   │   └── client.js      # axios 인스턴스
│   ├── hooks/             # 커스텀 훅
│   ├── utils/             # 유틸리티 함수
│   ├── App.js
│   └── main.js
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Spring Boot API 연동

### 프록시 설정 (Vite)
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
```

### API 클라이언트 예시
```javascript
// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
```

### Docker Compose 개발 환경
- React 개발 서버: `localhost:5173` (Vite 기본 포트)
- Spring Boot API: `localhost:8080`
- MySQL: `localhost:3306`
- `docker-compose.yml`에서 모든 서비스 통합 관리

---

## 데이터 시각화 규칙

### 그래프 라이브러리 선택
- **Chart.js**: 간단한 그래프에 적합 (막대, 라인)
- **Recharts**: React와 더 잘 통합 (컴포넌트 방식)
- 프로젝트 특성에 맞게 선택 (오버스펙 방지)

### 그래프 타입
- **막대 그래프**: 공정별/부품별 NG 비율
- **라인 그래프**: 기간별 추세 분석
- **필요한 것만 구현** (파이, 도넛 등 불필요한 타입 제외)

---

## 개발 원칙

### ✅ 최신 문법 유지
- **함수 컴포넌트 + Hooks** 사용
- **ES6+ 문법** 사용 (화살표 함수, 구조 분해 할당, 템플릿 리터럴 등)
- **React Query 최신 버전** 사용 (TanStack Query v5)

### ❌ 오버스펙 제거
- **불필요한 라이브러리 추가 금지**: 필요한 기능만 설치
- **과도한 추상화 방지**: 단순한 기능은 직접 구현
- **TypeScript 미사용**: JavaScript로 충분한 경우 TypeScript 불필요
- **복잡한 상태 관리 피하기**: React Query + Zustand만으로 충분
- **불필요한 그래프 타입 제외**: 막대/라인 그래프만 사용

### 📊 데이터 중심 설계
- **공장 데이터 입력/조회**: 일별 OK/NG 기록
- **통계 시각화**: 공정별/부품별 NG 비율
- **대시보드**: 실시간 데이터 표시 및 그래프

---

## 체크리스트

### 초기 설정
- [ ] Vite로 React 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] React Router 설정
- [ ] React Query 설정
- [ ] Zustand 설치 및 스토어 생성
- [ ] 프록시 설정 (Spring Boot API)
- [ ] Chart.js 또는 Recharts 설치

### 개발 환경
- [ ] Docker Compose에 React 개발 서버 추가
- [ ] Spring Boot와 통신 테스트
- [ ] HMR (Hot Module Replacement) 동작 확인

### 기능 구현
- [ ] 데이터 입력 화면 (일별 OK/NG 기록)
- [ ] 대시보드 화면 (통계 표시)
- [ ] 그래프 시각화 (막대/라인 그래프)
- [ ] Spring Boot API 연동 확인

---

## 참고 자료
- **Vite 공식 문서**: https://vitejs.dev/
- **React Query 공식 문서**: https://tanstack.com/query/latest
- **Zustand 공식 문서**: https://zustand-demo.pmnd.rs/
- **Tailwind CSS 공식 문서**: https://tailwindcss.com/
- **Chart.js 공식 문서**: https://www.chartjs.org/
- **Recharts 공식 문서**: https://recharts.org/
