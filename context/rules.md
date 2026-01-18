# React 개발 규칙 (작업 참고용)

## 🎯 프로젝트 특성
- **공장 데이터 입력 및 시각화 중심**: 통계, 그래프 위주의 대시보드
- **Spring Boot + React 조합**: Spring Boot API와 연동
- **최신 문법 유지, 오버스펙 제거**: 필요한 기능만 구현

---

## 🔄 개발 워크플로우

### 개발 프로세스
1. **페이지 단위 작업**
   - 한 번에 하나의 페이지만 개발
   - 해당 페이지의 모든 컴포넌트는 분리하여 작성
   - 컴포넌트 분리 완료 후 확인 받기

2. **API 연동 및 데이터 검증**
   - 디자인에 맞게 API 요청 연동
   - 실제 데이터 출력 및 동작 확인
   - 데이터 표시가 정상인지 확인 후 승인 받기

3. **단계별 검증 후 진행**
   - 위 2단계 완료 후 다음 페이지/기능으로 진행
   - 각 단계에서 문제를 조기에 발견하고 수정

**💡 이 워크플로우를 통해 안정적이고 체계적인 개발이 가능합니다.**

---

## 기술 스택

### 핵심 도구
- **React 18**: 함수 컴포넌트 + Hooks
- **Vite**: 빌드 도구 (빠른 개발 서버, HMR)
- **Tailwind CSS**: 스타일링
- **JavaScript만 사용** (TypeScript 사용 안 함)

### 상태 관리 및 데이터 페칭
- **Zustand**: 전역 상태 관리 (로그인 상태 등)
- **React Query (TanStack Query)**: 서버 데이터 페칭 및 캐싱

### 데이터 시각화
- **Chart.js**: 통계 그래프 시각화
  - 막대 그래프: 공정별/부품별 NG 비율
  - 라인 그래프: 기간별 추세 분석

### 라우팅
- **React Router**: 페이지 라우팅

---

## 개발 패턴

### 서버 데이터 관리 - React Query 사용
```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['dailyProduction', date],
  queryFn: () => api.getDailyProduction(date)
});
```

### 전역 상태 관리 - Zustand 사용
```javascript
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}));
```

### URL 파라미터 및 네비게이션
- `useParams`: URL 파라미터 읽기
- `useNavigate`: 페이지 이동

### ⚠️ useEffect는 최소한으로 사용
- React Query가 대부분의 데이터 페칭을 처리
- 브리지 역할이나 특수한 사이드 이펙트 처리 시에만 사용

---

## 프로젝트 구조

```
src/
├── components/        # 재사용 가능한 컴포넌트
│   ├── charts/        # 그래프 컴포넌트
│   └── forms/         # 입력 폼 컴포넌트
├── pages/             # 페이지 컴포넌트
├── stores/            # Zustand 스토어 (userStore.js)
├── api/               # API 클라이언트 (client.js - axios)
├── hooks/             # 커스텀 훅
├── utils/             # 유틸리티 함수
├── App.jsx
└── main.jsx
```

---

## Spring Boot API 연동

### 프록시 설정 (vite.config.js)
```javascript
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

### API 클라이언트 (src/api/client.js)
```javascript
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

---

## 개발 원칙

### ✅ 최신 문법 유지
- 함수 컴포넌트 + Hooks 사용
- ES6+ 문법 사용 (화살표 함수, 구조 분해 할당, 템플릿 리터럴 등)
- React Query 최신 버전 사용 (TanStack Query v5)

### ❌ 오버스펙 제거
- 불필요한 라이브러리 추가 금지: 필요한 기능만 설치
- 과도한 추상화 방지: 단순한 기능은 직접 구현
- TypeScript 미사용: JavaScript로 충분
- 복잡한 상태 관리 피하기: React Query + Zustand만으로 충분
- 불필요한 그래프 타입 제외: 막대/라인 그래프만 사용

### 📊 데이터 중심 설계
- 공장 데이터 입력/조회: 일별 OK/NG 기록
- 통계 시각화: 공정별/부품별 NG 비율
- 대시보드: 실시간 데이터 표시 및 그래프

---

## 코드 스타일

### 컴포넌트 작성
- 함수 컴포넌트 사용 (화살표 함수 권장)
- 파일명: PascalCase (예: `Dashboard.jsx`, `DataInput.jsx`)
- 컴포넌트명: PascalCase

### 스타일링
- Tailwind CSS 유틸리티 클래스 사용
- 인라인 스타일 최소화
- CSS 파일 대신 Tailwind 클래스 사용

### 파일 확장자
- React 컴포넌트: `.jsx`
- 일반 JavaScript: `.js`

---

## 주요 라이브러리 사용법

### React Query (TanStack Query)
```javascript
// 데이터 조회
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction
});

// 데이터 수정
const mutation = useMutation({
  mutationFn: updateFunction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] });
  }
});
```

### Zustand
```javascript
// 스토어 사용
const { user, setUser, logout } = useUserStore();
```

### React Router
```javascript
// 라우팅
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/input" element={<DataInput />} />
</Routes>

// 네비게이션
const navigate = useNavigate();
navigate('/dashboard');
```

### Chart.js (react-chartjs-2)
```javascript
import { Bar } from 'react-chartjs-2';

<Bar data={chartData} options={chartOptions} />
```

---

## 체크리스트 (개발 시 확인)

### 초기 설정 완료 확인
- [x] Vite로 React 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] React Router 설정
- [x] React Query 설정
- [x] Zustand 설치 및 스토어 생성
- [x] 프록시 설정 (Spring Boot API)
- [x] Chart.js 설치

---

## 참고 자료

- **Vite**: https://vitejs.dev/
- **React Query**: https://tanstack.com/query/latest
- **Zustand**: https://zustand-demo.pmnd.rs/
- **Tailwind CSS**: https://tailwindcss.com/
- **Chart.js**: https://www.chartjs.org/
- **React Router**: https://reactrouter.com/

---

**💡 작업 시 이 규칙을 참고하여 일관된 코드 스타일과 패턴을 유지하세요!**
