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

## Docker를 사용한 전체 환경 실행

백엔드 서버와 프론트엔드를 Docker로 함께 실행할 수 있습니다.

### 1. 백엔드 레포지토리 클론

프로젝트 루트 디렉토리에서 다음 명령어로 백엔드를 클론합니다:

**PowerShell:**
```powershell
..\setup-backend.ps1
```

**또는 직접 클론:**
```bash
cd ..
git clone https://github.com/getinthere-private-job/q-track-backend.git
cd q-track-frontend
```

### 2. Docker Compose로 전체 환경 실행

```bash
docker-compose up --build
```

이 명령어는 다음 서비스들을 실행합니다:
- **백엔드 서버**: `http://localhost:8080`
- **프론트엔드**: `http://localhost:5173`
- **MySQL 데이터베이스**: `localhost:3306`

### 3. 개별 서비스 제어

```bash
# 모든 서비스 시작
docker-compose up

# 백그라운드에서 실행
docker-compose up -d

# 서비스 중지
docker-compose down

# 서비스 중지 및 볼륨 삭제
docker-compose down -v

# 로그 확인
docker-compose logs -f

# 특정 서비스만 재시작
docker-compose restart backend
```

### 4. Docker 없이 로컬 실행 (개발 모드)

백엔드와 데이터베이스만 Docker로 실행하고, 프론트엔드는 로컬에서 실행할 수도 있습니다:

```bash
# 백엔드와 DB만 실행
docker-compose up backend db

# 별도 터미널에서 프론트엔드 실행
npm start
```

## Spring Boot API 연동

프록시 설정이 `vite.config.js`에 구성되어 있어 `/api`로 시작하는 모든 요청은 자동으로 `http://localhost:8080`으로 전달됩니다.

## 개발 규칙

- **JavaScript 사용** (TypeScript 미사용)
- **함수 컴포넌트 + Hooks** 사용
- **React Query**로 서버 데이터 관리
- **Zustand**로 전역 상태 관리
- **최신 문법 유지, 오버스펙 제거**