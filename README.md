# Q-Track Frontend

Q-Track 프로젝트의 React 프론트엔드 애플리케이션입니다.

## 기술 스택

- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅
- **React Query (TanStack Query)** - 서버 데이터 페칭 및 캐싱
- **Zustand** - 전역 상태 관리
- **Chart.js** - 데이터 시각화
- **Axios** - HTTP 클라이언트

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 프로젝트 구조

```
q-track-frontend/
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── charts/        # 그래프 컴포넌트
│   │   └── forms/         # 입력 폼 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── stores/            # Zustand 스토어
│   ├── api/               # API 클라이언트
│   ├── hooks/             # 커스텀 훅
│   ├── utils/             # 유틸리티 함수
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Spring Boot API 연동

프록시 설정이 `vite.config.js`에 구성되어 있어 `/api`로 시작하는 모든 요청은 자동으로 `http://localhost:8080`으로 전달됩니다.

## 개발 규칙

- **JavaScript 사용** (TypeScript 미사용)
- **함수 컴포넌트 + Hooks** 사용
- **React Query**로 서버 데이터 관리
- **Zustand**로 전역 상태 관리
- **최신 문법 유지, 오버스펙 제거**