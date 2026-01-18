# Phase 1 완료 내용 정리

**Q-Track 프론트엔드 Phase 1 개발 완료 내역**

---

## 📌 Phase 1 개발 완료 요약

Phase 1에서 React 프론트엔드의 기본 기능과 백엔드 API 연동을 완료했습니다.
다음 내용은 Phase 1에서 구현된 모든 기능과 컴포넌트를 정리한 문서입니다.

---

## ✅ Step 1: 인증 및 기본 라우팅

### 1-1. 로그인/회원가입 페이지 ✅ 완료

**구현 파일:**
- `src/pages/LoginPage.jsx` - 로그인 페이지
- `src/components/forms/LoginForm.jsx` - 로그인 폼 컴포넌트
- `src/pages/SignupPage.jsx` - 회원가입 페이지
- `src/components/forms/SignupForm.jsx` - 회원가입 폼 컴포넌트

**구현 내용:**
- ✅ 로그인 폼 (username, password)
- ✅ 회원가입 폼 (username, password, role)
- ✅ 폼 유효성 검사
- ✅ `POST /login` API 연동 (baseURL 오버라이드로 `/login` 직접 호출)
- ✅ `POST /signup` API 연동 (baseURL 오버라이드로 `/signup` 직접 호출)
- ✅ 로그인 성공 시 토큰 저장 및 사용자 정보 저장
- ✅ 에러 메시지 표시
- ✅ 로그인 페이지 기본값 설정 (`testmanager`, `password123`)

**특이사항:**
- Vite proxy 설정에 `/login`, `/signup` 엔드포인트 추가 (`vite.config.js`)
- `LoginForm`, `SignupForm`에서 `baseURL: ''` 오버라이드로 `/api` 프리픽스 없이 직접 호출

### 1-2. 라우팅 설정 ✅ 완료

**구현 파일:**
- `src/App.jsx` - 메인 라우팅 설정
- `src/components/ProtectedRoute.jsx` - 인증 보호 라우트

**구현 내용:**
- ✅ `/login` → LoginPage
- ✅ `/signup` → SignupPage
- ✅ `/dashboard` → Dashboard (ProtectedRoute)
- ✅ `/` → Dashboard (ProtectedRoute)
- ✅ `/data-input` → DataInput (ProtectedRoute)
- ✅ `/items` → ItemsPage (ProtectedRoute)
- ✅ `/quality-records` → QualityRecordsPage (ProtectedRoute)
- ✅ ProtectedRoute 컴포넌트 (토큰/사용자 정보 확인)

### 1-3. 사용자 상태 관리 ✅ 완료

**구현 파일:**
- `src/stores/userStore.js` - Zustand 상태 관리

**구현 내용:**
- ✅ `setUser()` - 사용자 정보 저장
- ✅ `setToken()` - 토큰 저장 (localStorage 자동 동기화)
- ✅ `logout()` - 로그아웃 (토큰 및 사용자 정보 삭제)
- ✅ `loadToken()` - localStorage에서 토큰 및 사용자 정보 로드

---

## ✅ Step 2: 기본 레이아웃 및 네비게이션

### 2-1. 레이아웃 컴포넌트 ✅ 완료

**구현 파일:**
- `src/components/Layout.jsx` - 공통 레이아웃 컴포넌트
- `src/components/Header.jsx` - 헤더 컴포넌트
- `src/components/Sidebar.jsx` - 사이드바 네비게이션

**구현 내용:**
- ✅ Layout 컴포넌트 (모든 페이지에서 공통 사용)
- ✅ Header 컴포넌트
  - Q-Track 로고 (클릭 시 `/`로 이동)
  - 사용자 정보 표시 (username, role)
  - 로그아웃 버튼 (버튼 스타일 적용)
- ✅ Sidebar 컴포넌트
  - 버튼 스타일 메뉴 아이템
  - 활성 상태 스타일 (`bg-slate-800 text-white`)
  - 비활성 상태 스타일 (`bg-white text-gray-700 border-2`)
  - 권한별 메뉴 표시 (USER, MANAGER, ADMIN)
- ✅ 페이지 제목 영역 (`text-lg font-semibold`)
- ✅ 메인 콘텐츠 영역 (`p-6 bg-gray-50`)
- ✅ 고정 헤더 및 사이드바 (`fixed`, `top-16`, `ml-60`)

**메뉴 항목:**
- 대시보드 (`/dashboard`)
- 데이터 입력 (`/data-input`) - USER, MANAGER, ADMIN
- 품질 기록 (`/quality-records`) - MANAGER, ADMIN
- 부품 관리 (`/items`) - MANAGER, ADMIN

---

## ✅ Step 3: API 함수 작성

### 3-1. API Client 설정 ✅ 완료

**구현 파일:**
- `src/api/client.js` - Axios API Client

**구현 내용:**
- ✅ Axios 인스턴스 생성 (`baseURL: '/api'`)
- ✅ 요청 인터셉터: JWT 토큰 자동 추가 (`Authorization: Bearer {token}`)
- ✅ 응답 인터셉터: 401 에러 처리 (토큰 삭제 및 로그인 페이지 리다이렉트)

### 3-2. API 함수 구현 ✅ 완료

**구현 파일:**
- `src/api/dailyProductionApi.js` - 일별 생산 데이터 API
- `src/api/qualityRecordApi.js` - 품질 기록 API
- `src/api/itemApi.js` - 부품 관리 API
- `src/api/processApi.js` - 공정 API
- `src/api/systemCodeApi.js` - 시스템 코드 API
- `src/api/statisticsApi.js` - 통계 API

**구현 내용:**

#### 일별 생산 데이터 API (`dailyProductionApi.js`)
- ✅ `getDailyProductions(params)` - 목록 조회
- ✅ `getDailyProduction(id)` - 상세 조회
- ✅ `createDailyProduction(data)` - 생성
- ✅ `updateDailyProduction(id, data)` - 수정
- ✅ `deleteDailyProduction(id)` - 삭제

#### 품질 기록 API (`qualityRecordApi.js`)
- ✅ `getQualityRecords(params)` - 목록 조회
- ✅ `getQualityRecord(id)` - 상세 조회
- ✅ `createQualityRecord(data)` - 생성
- ✅ `updateQualityRecord(id, data)` - 수정
- ✅ `deleteQualityRecord(id)` - 삭제
- ✅ `evaluateQualityRecord(id, data)` - 평가 (PUT `/api/quality-records/{id}/evaluate`)
- ✅ `getEvaluationRequired()` - 평가 필요 목록 조회

#### 부품 관리 API (`itemApi.js`)
- ✅ `getItems()` - 목록 조회
- ✅ `getItem(id)` - 상세 조회
- ✅ `createItem(data)` - 생성
- ✅ `updateItem(id, data)` - 수정
- ✅ `deleteItem(id)` - 삭제

#### 공정 API (`processApi.js`)
- ✅ `getProcesses()` - 목록 조회

#### 시스템 코드 API (`systemCodeApi.js`)
- ✅ `getSystemCodes(codeGroup)` - 시스템 코드 조회

#### 통계 API (`statisticsApi.js`)
- ✅ `getStatisticsByProcess(params)` - 공정별 통계 (날짜 범위 파라미터 지원)
- ✅ `getStatisticsByItem(params)` - 부품별 통계 (날짜 범위 파라미터 지원)

### 3-3. React Query Hooks ✅ 완료

**구현 파일:**
- `src/hooks/useDailyProductions.js` - 일별 생산 데이터 훅
- `src/hooks/useQualityRecords.js` - 품질 기록 훅
- `src/hooks/useItems.js` - 부품 관리 훅
- `src/hooks/useProcesses.js` - 공정 훅
- `src/hooks/useSystemCodes.js` - 시스템 코드 훅
- `src/hooks/useStatistics.js` - 통계 훅

**구현 내용:**
- ✅ 모든 조회 API에 대한 `useQuery` 훅
- ✅ 모든 수정/생성/삭제 API에 대한 `useMutation` 훅
- ✅ 캐시 무효화 (`invalidateQueries`) 설정
- ✅ `staleTime` 설정 (2분 또는 10분)

---

## ✅ Step 4: 일별 생산 데이터 입력/조회

### 4-1. 일별 생산 데이터 입력 폼 ✅ 완료

**구현 파일:**
- `src/components/forms/DailyProductionForm.jsx`

**구현 내용:**
- ✅ 부품 선택 (드롭다운)
- ✅ 생산일 선택 (`react-datepicker` 사용, 한국어 로케일)
  - 월/년도 드롭다운 지원
- ✅ 총 생산량 입력
- ✅ 폼 유효성 검사
- ✅ 생성/수정 기능
- ✅ API 에러 처리 및 메시지 표시
- ✅ 권한 확인 (USER, MANAGER, ADMIN)

### 4-2. 일별 생산 데이터 목록 ✅ 완료

**구현 파일:**
- `src/components/DailyProductionList.jsx`

**구현 내용:**
- ✅ 테이블 형태 목록 표시
- ✅ 필터링 기능 (프론트엔드)
  - 부품 필터
  - 시작 날짜 필터 (`react-datepicker`)
  - 종료 날짜 필터 (`react-datepicker`)
- ✅ 정렬 기능 (프론트엔드)
  - 생산일 정렬 (기본 내림차순)
  - 총 생산량 정렬
- ✅ 삭제 기능 (MANAGER, ADMIN 권한)
- ✅ 부품 코드/부품명 분리 표시
- ✅ 권한별 UI 제어

### 4-3. 데이터 입력 페이지 ✅ 완료

**구현 파일:**
- `src/pages/DataInput.jsx`

**구현 내용:**
- ✅ `DailyProductionForm` 통합
- ✅ `DailyProductionList` 통합

---

## ✅ Step 5: 품질 기록 입력/조회

### 5-1. 품질 기록 입력 폼 ✅ 완료

**구현 파일:**
- `src/components/forms/QualityRecordForm.jsx`

**구현 내용:**
- ✅ 생산일 선택 (`react-datepicker`) - **먼저 날짜 선택 필수**
- ✅ 일별 생산 데이터 선택 (선택한 날짜에 해당하는 데이터만 표시)
- ✅ 공정 선택 (드롭다운)
- ✅ OK 수량 입력
- ✅ NG 수량 입력
- ✅ 총 수량 자동 계산 표시
- ✅ NG 비율 자동 계산 표시
- ✅ 업계 평균(0.5%) 초과 시 경고 표시
- ✅ 총 수량 검증 (일별 생산 데이터의 총 생산량과 일치해야 함)
- ✅ 폼 유효성 검사
- ✅ 생성/수정 기능
- ✅ API 에러 처리 및 메시지 표시
- ✅ 권한 확인 (USER, MANAGER, ADMIN)

### 5-2. 품질 기록 목록 ✅ 완료

**구현 파일:**
- `src/components/QualityRecordList.jsx`

**구현 내용:**
- ✅ 테이블 형태 목록 표시
- ✅ 생산일, 부품 코드, 부품명 분리 표시
- ✅ 필터링 기능 (프론트엔드)
  - 평가 필요만 보기 필터
  - 부품 필터
  - 일별 필터 (시작일/종료일)
  - 월별 필터
- ✅ 정렬 기능 (프론트엔드)
  - 기본 정렬: 생산일 (오름차순) → 부품 코드 (오름차순) → 공정 순서 (W, P, 검)
  - 사용자 지정 정렬 (NG 비율, 평가 필요 등)
- ✅ 그룹 표시 (같은 생산일 + 부품 코드를 사각 테두리로 표시)
- ✅ 평가 필요 항목 기준 정보 표시
  - 자동차 부품 업계 평균 임계값
  - 평가 필요 조건 (NG 비율 초과, NG 비율 증가)
- ✅ 평가 기능 (MANAGER, ADMIN 권한)
  - 평가 버튼 (평가 필요 항목에만 표시)
  - `QualityRecordEvaluateModal` 통합
- ✅ 삭제 기능 (MANAGER, ADMIN 권한)
- ✅ 권한별 UI 제어

### 5-3. 전문가 평가 모달 ✅ 완료

**구현 파일:**
- `src/components/modals/QualityRecordEvaluateModal.jsx`

**구현 내용:**
- ✅ 평가 내용 입력 (textarea)
- ✅ 폼 유효성 검사
- ✅ `PUT /api/quality-records/{id}/evaluate` API 연동
- ✅ 평가 저장 후 목록 자동 갱신
- ✅ 에러 처리 및 메시지 표시

### 5-4. 품질 기록 페이지 ✅ 완료

**구현 파일:**
- `src/pages/QualityRecordsPage.jsx`

**구현 내용:**
- ✅ `QualityRecordForm` 통합
- ✅ `QualityRecordList` 통합

---

## ✅ Step 6: 통계 API 연동

### 6-1. 통계 테이블 컴포넌트 ✅ 완료

**구현 파일:**
- `src/components/StatisticsTable.jsx`

**구현 내용:**
- ✅ 공정별/부품별 통계 테이블
- ✅ 날짜 범위 필터 (`react-datepicker`)
  - 시작 날짜 선택
  - 종료 날짜 선택
- ✅ 정렬 기능 (총 생산량, 총 NG 수량, NG 비율)
- ✅ 업계 평균 임계값 표시
- ✅ NG 비율 초과 시 빨간색 강조
- ✅ 로딩/에러 상태 처리

---

## ✅ Step 7: Chart.js 연동 및 대시보드

### 7-1. 공정별 NG 비율 차트 ✅ 완료

**구현 파일:**
- `src/components/charts/ProcessNgRateChart.jsx`

**구현 내용:**
- ✅ Chart.js Bar Chart 사용
- ✅ 공정별 NG 비율 표시
- ✅ 업계 평균 임계값 초과 시 빨간색 표시
- ✅ 날짜 범위 파라미터 지원 (`startDate`, `endDate`)
- ✅ 로딩/에러 상태 처리

### 7-2. 부품별 NG 비율 차트 ✅ 완료

**구현 파일:**
- `src/components/charts/ItemNgRateChart.jsx`

**구현 내용:**
- ✅ Chart.js Bar Chart 사용
- ✅ 부품별 NG 비율 표시 (NG 비율 기준 내림차순 정렬)
- ✅ 업계 평균 임계값 초과 시 빨간색 표시
- ✅ 날짜 범위 파라미터 지원 (`startDate`, `endDate`)
- ✅ X축 레이블 45도 회전
- ✅ 로딩/에러 상태 처리

### 7-3. StatCard 컴포넌트 ✅ 완료

**구현 파일:**
- `src/components/StatCard.jsx`

**구현 내용:**
- ✅ KPI 카드 컴포넌트 (제목, 값, 단위)
- ✅ NG 관련 값 스타일 (`isNg` prop)
- ✅ 트렌드 표시 지원 (선택사항)

### 7-4. 대시보드 페이지 ✅ 완료

**구현 파일:**
- `src/pages/Dashboard.jsx`

**구현 내용:**
- ✅ KPI 카드 영역 (4개)
  - 총 생산량
  - 총 NG 수량
  - NG 비율
  - 업계 평균 임계값
- ✅ **그래프 필터 영역** (년도별/월별 필터)
  - 전체/년도별/월별 모드 선택 버튼
  - 년도 선택 드롭다운 (최근 10년)
  - 월 선택 드롭다운 (1월~12월, 월별 모드일 때만 표시)
  - 현재 필터 상태 표시
- ✅ 그래프 영역 (2개)
  - 공정별 NG 비율 차트
  - 부품별 NG 비율 차트
- ✅ 통계 테이블 영역 (2개)
  - 공정별 NG 비율 통계 테이블
  - 부품별 NG 비율 통계 테이블
- ✅ 날짜 범위 파라미터 계산 및 전달

---

## ✅ Step 8: 최종 정리 및 테스트

### 8-1. 에러 처리 ✅ 완료

**구현 내용:**
- ✅ API 에러 처리 (`apiClient` 인터셉터)
  - 401 에러 → 로그인 페이지 리다이렉트 (자동 처리)
  - 403, 400 에러 → 에러 메시지 표시 (컴포넌트별 처리)
- ✅ 폼 에러 처리 (각 폼 컴포넌트)
- ✅ 네트워크 에러 처리

### 8-2. 로딩 상태 ✅ 완료

**구현 내용:**
- ✅ React Query `isLoading` 사용
- ✅ 모든 데이터 조회 화면에 로딩 표시
- ✅ Mutation 로딩 상태 표시 (버튼 "저장 중...", "삭제 중..." 등)

### 8-3. 권한별 UI 제어 ✅ 완료

**구현 내용:**
- ✅ 사용자 Role에 따른 버튼 표시/숨김
  - USER: 일부 수정/삭제 버튼 숨김
  - MANAGER: 부품 생성/수정 버튼 표시, 품질 기록 평가/삭제 버튼 표시
  - ADMIN: 모든 버튼 표시
- ✅ 사이드바 메뉴 권한별 표시
- ✅ 페이지 접근 권한 제어 (ProtectedRoute)

### 8-4. 반응형 디자인 ✅ 부분 완료

**구현 내용:**
- ✅ Tailwind CSS 그리드 시스템 사용 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- ✅ 테이블 오버플로우 처리 (`overflow-x-auto`)
- ✅ 모바일 대응 기본 스타일 적용
- ⚠️ 완전한 모바일 최적화는 Phase 2에서 추가 작업 예정

---

## ✅ Step 9: 토큰 자동 로그인

### 9-1. 토큰 기반 자동 로그인 ✅ 완료

**구현 파일:**
- `src/stores/userStore.js`
- `src/pages/LoginPage.jsx`
- `src/main.jsx`

**구현 내용:**
- ✅ localStorage에 토큰 및 사용자 정보 저장
- ✅ 앱 초기화 시 `loadToken()` 호출로 자동 로그인
- ✅ 로그인 페이지 접근 시 토큰/사용자 정보 있으면 대시보드로 자동 리다이렉트
- ✅ 로그아웃 시 토큰 및 사용자 정보 삭제

---

## 📦 주요 라이브러리 및 도구

### 설치된 라이브러리
- ✅ React 18
- ✅ React Router DOM (`react-router-dom`)
- ✅ Zustand (상태 관리)
- ✅ React Query (`@tanstack/react-query`)
- ✅ Axios
- ✅ Chart.js & react-chartjs-2
- ✅ react-datepicker
- ✅ date-fns (`date-fns/locale/ko` - 한국어 로케일)
- ✅ Tailwind CSS
- ✅ Vite

---

## 🎨 UI/UX 디자인 적용

### 디자인 가이드 준수 (`context/design.md`)
- ✅ 색상 팔레트 (slate/gray 기반)
- ✅ 타이포그래피
- ✅ 카드 스타일 (`bg-white rounded-xl shadow-sm p-6 border border-gray-200`)
- ✅ 버튼 스타일 (기본 버튼, 슬레이트 버튼)
- ✅ 테이블 스타일
- ✅ 입력 필드 스타일
- ✅ 그래프 스타일 (Chart.js)
- ✅ 평가 필요 항목 스타일 (`bg-slate-50 border-l-4 border-slate-400`)

---

## 📁 프로젝트 구조

```
src/
├── api/              # API 함수
│   ├── client.js
│   ├── dailyProductionApi.js
│   ├── qualityRecordApi.js
│   ├── itemApi.js
│   ├── processApi.js
│   ├── systemCodeApi.js
│   └── statisticsApi.js
├── components/       # 컴포넌트
│   ├── charts/      # 차트 컴포넌트
│   ├── forms/       # 폼 컴포넌트
│   ├── modals/      # 모달 컴포넌트
│   ├── DailyProductionList.jsx
│   ├── QualityRecordList.jsx
│   ├── StatisticsTable.jsx
│   ├── ItemManagement.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   └── StatCard.jsx
├── hooks/           # React Query 훅
│   ├── useDailyProductions.js
│   ├── useQualityRecords.js
│   ├── useItems.js
│   ├── useProcesses.js
│   ├── useSystemCodes.js
│   └── useStatistics.js
├── pages/           # 페이지 컴포넌트
│   ├── Dashboard.jsx
│   ├── DataInput.jsx
│   ├── ItemsPage.jsx
│   ├── QualityRecordsPage.jsx
│   ├── LoginPage.jsx
│   └── SignupPage.jsx
├── stores/          # 상태 관리
│   └── userStore.js
├── utils/           # 유틸리티 함수
├── App.jsx          # 메인 라우팅
├── main.jsx         # 앱 진입점
└── index.css        # 전역 스타일
```

---

## ✅ Phase 1 완료 기준 달성

- ✅ React 프로젝트 초기화 및 기본 설정
- ✅ 로그인/회원가입 페이지 동작 확인
- ✅ 데이터 입력 화면 (일별 생산 데이터, 품질 기록) 동작 확인
- ✅ 대시보드 및 통계 화면 동작 확인
- ✅ 공정별/부품별 NG 비율 그래프 표시 확인
- ✅ Spring Boot API와 정상 연동 확인
- ✅ 권한별 접근 제어 확인
- ✅ 토큰 기반 자동 로그인 확인

---

## 🎯 Phase 2로 이어지는 내용

Phase 1에서 일부 구현된 항목들:

1. **전문가 평가 시스템** ✅ 일부 완료
   - ✅ 평가 필요 항목 조회 API 연동
   - ✅ 전문가 평가 입력 API 연동
   - ✅ 평가 UI 구현 (QualityRecordEvaluateModal)
   - ⚠️ 평가 이력 조회 API 미구현 (Phase 2에서 추가)

2. **날짜 범위 선택 기능** ✅ 완료
   - ✅ 대시보드 그래프 필터 (년도별/월별)
   - ✅ 통계 테이블 날짜 범위 필터

3. **필터링 기능** ✅ 일부 완료
   - ✅ 부품별 필터 (품질 기록, 일별 생산 데이터)
   - ✅ 공정별 필터 (품질 기록)
   - ✅ 일별/월별 필터 (품질 기록)

4. **KPI 카드** ✅ 완료
   - ✅ 대시보드 KPI 카드 구현 (StatCard 컴포넌트)

5. **차트** ✅ 완료
   - ✅ Chart.js Bar Chart 구현 (공정별/부품별 NG 비율)

---

## 📋 Phase 2 문서에서 이미 완료된 항목

Phase 1에서 이미 구현된 항목들이 Phase 2 문서에도 포함되어 있습니다.
아래 항목들은 Phase 2 문서에서 제외하거나 "이미 완료"로 표시할 수 있습니다.

### ✅ 이미 완료된 항목 (Phase 1에서 구현)

#### 1. 전문가 평가 시스템 (일부 완료)

**✅ 완료된 항목:**
- ✅ **평가 필요 항목 조회 API** (`GET /api/quality-records/evaluation-required`)
  - 구현 위치: `src/api/qualityRecordApi.js`, `src/hooks/useQualityRecords.js`
  - UI: `QualityRecordList.jsx`에서 평가 필요 항목 필터링 및 표시
- ✅ **전문가 평가 입력 API** (`PUT /api/quality-records/{id}/evaluate`)
  - 구현 위치: `src/api/qualityRecordApi.js`, `src/hooks/useQualityRecords.js`
  - Request body: `{ expertEvaluation: string }`
- ✅ **전문가 평가 UI** (`QualityRecordEvaluateModal`)
  - 구현 위치: `src/components/modals/QualityRecordEvaluateModal.jsx`
  - 평가 내용 입력 모달
  - 평가 필요 항목 목록 화면 (품질 기록 목록 내)

**❌ 미구현 항목 (Phase 2에서 추가 작업 필요):**
- ❌ **평가 이력 조회 API** (`GET /api/quality-records/evaluation-history`)
  - 평가자(`evaluatedBy`), 평가 일시(`evaluatedAt`) 포함 조회
- ❌ **평가 이력 조회 화면** (별도 화면 또는 모달)

#### 2. 날짜 범위 선택 기능 ✅ 완료

**✅ 완료된 항목:**
- ✅ **대시보드 그래프 필터** (년도별/월별)
  - 구현 위치: `src/pages/Dashboard.jsx`
  - 전체/년도별/월별 모드 선택
  - 년도/월 선택 드롭다운
- ✅ **통계 테이블 날짜 범위 필터**
  - 구현 위치: `src/components/StatisticsTable.jsx`
  - 시작 날짜/종료 날짜 선택 (`react-datepicker`)

#### 3. 필터링 기능 (일부 완료)

**✅ 완료된 항목:**
- ✅ **부품별 필터**
  - 품질 기록 목록 (`QualityRecordList.jsx`)
  - 일별 생산 데이터 목록 (`DailyProductionList.jsx`)
- ✅ **일별/월별 필터**
  - 품질 기록 목록 (일별: 시작일/종료일, 월별: YYYY-MM 형식)

**❌ 미구현 항목 (Phase 2에서 추가 작업 필요):**
- ❌ **공정별 필터** (품질 기록 목록에 추가 가능)

#### 4. KPI 카드 ✅ 완료

**✅ 완료된 항목:**
- ✅ **StatCard 컴포넌트** (`src/components/StatCard.jsx`)
  - KPI 카드 공통 컴포넌트
- ✅ **대시보드 KPI 카드** (`src/pages/Dashboard.jsx`)
  - 총 생산량
  - 총 NG 수량
  - NG 비율
  - 업계 평균 임계값

#### 5. 차트 ✅ 완료

**✅ 완료된 항목:**
- ✅ **Chart.js Bar Chart 구현**
  - 공정별 NG 비율 차트 (`ProcessNgRateChart.jsx`)
  - 부품별 NG 비율 차트 (`ItemNgRateChart.jsx`)
- ✅ **업계 평균 임계값 기준선 표시**
- ✅ **임계값 초과 항목 강조 표시** (빨간색)

**❌ 미구현 항목 (Phase 2에서 추가 작업 필요):**
- ❌ **선 그래프** (Line Chart) - 추세 분석용
- ❌ **원형 그래프** (Pie Chart)
- ❌ **히트맵** (Heatmap)
- ❌ **그래프 타입 선택 UI** (막대/선/원형 전환)

---

## 🔄 Phase 2에서 추가로 구현해야 할 주요 항목

### 백엔드 (Spring Boot)
1. **집계 기능**
   - 일별 → 월별 자동 집계 (SQL 쿼리)
   - 월별 → 연별 자동 집계 (SQL 쿼리)
   - 집계 데이터 캐싱

2. **고급 통계 API**
   - 기간별 추세 분석 API (`GET /api/statistics/trend`)
   - 비교 분석 API (`GET /api/statistics/compare-monthly`, `compare-yearly`)
   - 이상치 탐지 로직

3. **평가 이력 조회 API**
   - `GET /api/quality-records/evaluation-history`

### 프론트엔드 (React)
1. **추가 그래프 타입**
   - 선 그래프 (추세 분석)
   - 원형 그래프
   - 히트맵
   - 그래프 타입 선택 UI

2. **고급 필터링**
   - 공정별 필터 추가
   - 복합 필터 (여러 조건 동시 적용)

3. **평가 이력 조회 화면**
   - 평가 이력 목록 화면
   - 평가자, 평가 일시 표시

4. **추가 기능**
   - 데이터 테이블 검색 기능
   - 페이지네이션
   - 실시간 업데이트 (폴링 또는 WebSocket)

---

**Phase 1 개발 완료! 🎉**
**이제 Phase 2에서 고급 기능을 추가로 구현할 수 있습니다.**
