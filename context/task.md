# React 프론트엔드 개발 작업 목록

**Q-Track 프론트엔드 개발 작업 체크리스트 (Phase 1: 1-2주)**

---

## 📚 참고 문서

개발 시 다음 문서를 참고하세요:

- **`context/rules.md`**: 개발 규칙 및 워크플로우 (코드 스타일, 패턴, 기술 스택)
- **`context/design.md`**: UI/UX 디자인 가이드 (색상, 타이포그래피, 컴포넌트 스타일, 페이지 구조)
- **`context/api-checklist.md`**: API 엔드포인트 체크리스트 (모든 API 포함 여부 확인)

---

## 🔄 개발 워크플로우 (각 Step별 적용)

**모든 Step은 아래 워크플로우를 따라 단계별로 검증하며 진행합니다.** ([상세: rules.md](./rules.md#개발-프로세스))

1. **페이지/기능 단위 작업**: 한 번에 하나의 페이지/기능만 개발
2. **컴포넌트 분리**: 해당 페이지의 모든 컴포넌트는 분리하여 작성 → 확인 받기
3. **API 연동 및 데이터 검증**: API 요청 연동 및 실제 데이터 출력 확인 → 승인 받기
4. **다음 Step 진행**: 위 단계 완료 후 다음 페이지/기능으로 진행

**💡 각 단계에서 확인/승인을 받은 후 다음 단계로 진행합니다.**

---

## Step 1: 인증 및 기본 라우팅 (기초)

**📌 워크플로우**: 로그인 페이지 → 컴포넌트 분리 → API 연동 → 회원가입 페이지 → 컴포넌트 분리 → API 연동

### 1-1. 로그인/회원가입 페이지

**1단계: 페이지 레이아웃 및 컴포넌트 분리**
- [ ] **LoginPage** (`src/pages/LoginPage.jsx`) 생성
  - 로그인 페이지는 Layout 제외 (예외 허용 - design.md 6.5 참조)
  - 중앙 정렬, 카드 형태 (`bg-white rounded-xl shadow-sm p-8`)
  - 디자인 가이드 준수: [design.md 7.1](./design.md#71-로그인회원가입-화면) 참조
- [ ] **LoginForm** 컴포넌트 (`src/components/forms/LoginForm.jsx`) 생성
  - 로그인 폼 (username, password) UI
  - 폼 유효성 검사
  - 입력 필드 스타일: [design.md 6번 섹션](./design.md#입력-필드-input) 참조
- [ ] **SignupPage** (`src/pages/SignupPage.jsx`) 생성
  - 회원가입 페이지는 Layout 제외 (예외 허용)
  - 중앙 정렬, 카드 형태
- [ ] **SignupForm** 컴포넌트 (`src/components/forms/SignupForm.jsx`) 생성
  - 회원가입 폼 (username, password, role) UI
  - 폼 유효성 검사
- [ ] ✅ **1단계 완료 확인**: 페이지 레이아웃 및 컴포넌트 분리 확인

**2단계: API 연동 및 데이터 검증**
- [ ] `POST /login` API 연동 (`LoginForm`)
  - 로그인 성공 시 토큰 저장 (`userStore.setToken()`)
  - 로그인 성공 시 대시보드로 이동
  - 에러 메시지 표시
- [ ] `POST /signup` API 연동 (`SignupForm`)
  - 회원가입 성공 시 로그인 페이지로 이동
  - 에러 메시지 표시
- [ ] ✅ **2단계 완료 확인**: API 연동 및 동작 확인 (실제 로그인/회원가입 테스트)

### 1-2. 라우팅 설정
- [ ] `src/App.jsx`에 라우트 추가
  - `/login` → LoginPage
  - `/signup` → SignupPage
  - `/` → Dashboard (인증 필요)
  - `/dashboard` → Dashboard (인증 필요)
- [ ] **ProtectedRoute** 컴포넌트 생성 (선택)
  - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트

### 1-3. 사용자 상태 관리
- [ ] `src/stores/userStore.js` 확인/수정
  - 로그인 시 user 정보 저장 (`setUser()`)
  - 로그아웃 기능 동작 확인

---

## Step 2: 기본 레이아웃 및 네비게이션

**📌 워크플로우**: Layout 컴포넌트 → Header 컴포넌트 → 페이지 틀 → 확인

### 2-1. 레이아웃 컴포넌트

**1단계: 컴포넌트 분리**
- [ ] **Layout** 컴포넌트 (`src/components/Layout.jsx`) 생성
  - 모든 페이지에서 공통으로 사용하는 Layout 컴포넌트 (design.md 6.5 참조)
  - 헤더 (로고, 사용자 정보, 로그아웃 버튼)
  - 사이드바 네비게이션 (선택)
  - 메인 콘텐츠 영역 (`p-6 bg-gray-50`)
  - 페이지 제목 영역 (왼쪽 상단, `text-lg font-semibold`)
  - 디자인 가이드 준수: [design.md 3번 섹션](./design.md#3-전체-레이아웃-구조) 참조
- [ ] **Header** 컴포넌트 (`src/components/Header.jsx`) 생성
  - 로그인 사용자 정보 표시
  - 로그아웃 버튼
  - 헤더 스타일: `bg-white border-b border-gray-200 h-16`
- [ ] ✅ **1단계 완료 확인**: 레이아웃 컴포넌트 분리 확인

**2단계: 페이지 틀 생성**
- [ ] **Dashboard** 페이지 (`src/pages/Dashboard.jsx`) 기본 틀
  - Layout 컴포넌트 적용
  - 페이지 제목: "대시보드" (왼쪽 상단, `text-lg font-semibold`)
  - 통계 카드 영역 (예약용 div)
  - 디자인 가이드 준수: [design.md 7.2](./design.md#72-대시보드-dashboard) 참조
- [ ] **DataInput** 페이지 (`src/pages/DataInput.jsx`) 기본 틀
  - Layout 컴포넌트 적용
  - 페이지 제목: "데이터 입력" (왼쪽 상단)
  - 입력 폼 영역 (예약용 div)
- [ ] ✅ **2단계 완료 확인**: 페이지 틀 및 레이아웃 적용 확인

---

## Step 3: 공통 데이터 조회 API 연동

### 3-1. API 함수 생성
- [ ] `src/api/processApi.js` 생성
  - `getProcesses()` - 공정 목록 조회 (`GET /api/processes`)
  - `getProcess(id)` - 공정 상세 조회 (`GET /api/processes/{id}`)
- [ ] `src/api/itemApi.js` 생성
  - `getItems()` - 부품 목록 조회 (`GET /api/items`)
  - `getItem(id)` - 부품 상세 조회 (`GET /api/items/{id}`)
  - `createItem(data)` - 부품 생성 (`POST /api/items`) (MANAGER, ADMIN)
  - `updateItem(id, data)` - 부품 수정 (`PUT /api/items/{id}`) (MANAGER, ADMIN)
  - `deleteItem(id)` - 부품 삭제 (`DELETE /api/items/{id}`) (ADMIN)
- [ ] `src/api/systemCodeApi.js` 생성
  - `getSystemCodes(codeGroup?)` - 시스템 코드 조회 (`GET /api/system-codes`)

### 3-2. React Query 훅 생성 (선택)
- [ ] `src/hooks/useProcesses.js` - 공정 목록 조회 훅
- [ ] `src/hooks/useItems.js` - 부품 목록 조회 훅
- [ ] `src/hooks/useSystemCodes.js` - 시스템 코드 조회 훅

### 3-3. 부품 관리 UI (MANAGER, ADMIN 권한)
- [ ] **ItemManagement** 컴포넌트 (`src/components/ItemManagement.jsx`) 생성
  - 부품 목록 표시 (테이블)
  - **부품 생성 폼** (`POST /api/items`)
    - 부품 코드 (code) 입력
    - 부품 이름 (name) 입력
    - 설명 (description) 입력 (선택)
    - 카테고리 (category) 입력 (선택)
  - **부품 수정 폼** (`PUT /api/items/{id}`)
    - 부품 이름 수정
    - 설명 수정
    - 카테고리 수정
  - **부품 삭제 기능** (`DELETE /api/items/{id}`)
    - 삭제 확인 다이얼로그
  - 권한 확인 (MANAGER, ADMIN만 표시)
  - React Query `useMutation` 사용
- [ ] 부품 관리 페이지 생성 (선택)
  - `/items` 또는 `/management/items` 라우트
  - 또는 DataInput 페이지 내 탭으로 통합

### 3-4. 공정 상세 조회 (선택)
- [ ] 공정 상세 정보 표시 (선택사항)
  - 공정 코드, 이름, 설명, 순서 표시
  - 공정 목록에서 클릭 시 상세 정보 모달 또는 페이지 표시

---

## Step 4: 일별 생산 데이터 입력 화면

**📌 워크플로우**: API 함수 생성 → 폼 컴포넌트 분리 → 목록 컴포넌트 분리 → API 연동 → DataInput 페이지 통합

### 4-1. 일별 생산 데이터 API 함수 생성
- [ ] `src/api/dailyProductionApi.js` 생성
  - `getDailyProductions()` - 목록 조회 (`GET /api/daily-productions`)
  - `getDailyProduction(id)` - 상세 조회 (`GET /api/daily-productions/{id}`)
  - `createDailyProduction(data)` - 생성 (`POST /api/daily-productions`)
  - `updateDailyProduction(id, data)` - 수정 (`PUT /api/daily-productions/{id}`)
  - `deleteDailyProduction(id)` - 삭제 (`DELETE /api/daily-productions/{id}`)

### 4-2. 일별 생산 데이터 입력 폼

**1단계: 컴포넌트 분리**
- [ ] **DailyProductionForm** 컴포넌트 (`src/components/forms/DailyProductionForm.jsx`) 생성
  - 카드 안에 폼 배치 (`bg-white rounded-xl shadow-sm p-4`)
  - 부품 선택 (드롭다운 - `getItems()` 사용, 24개 부품 중 선택)
  - 생산일 선택 (날짜 입력 - `yyyy-MM-dd` 형식, HTML5 `<input type="date">`)
  - 총 생산량 입력 (숫자, 0 이상 검증)
  - **중복 검증**: 같은 부품의 같은 날짜는 하나만 입력 가능 (UNIQUE 제약)
  - 생성/수정 버튼 (오른쪽 상단 또는 하단, `bg-blue-600`)
  - 폼 UI만 작성 (API 연동 전)
  - 디자인 가이드 준수: [design.md 6번 섹션](./design.md#6-공통-컴포넌트-스타일) 참조
- [ ] ✅ **1단계 완료 확인**: DailyProductionForm 컴포넌트 UI 확인

**2단계: API 연동 및 데이터 검증**
- [ ] React Query `useMutation` 사용
  - 생성 성공 시 목록 새로고침
  - 중복 입력 시 에러 메시지 표시
- [ ] 실제 데이터 입력 테스트
- [ ] ✅ **2단계 완료 확인**: API 연동 및 데이터 입력/수정 동작 확인

### 4-3. 일별 생산 데이터 목록 표시

**1단계: 컴포넌트 분리**
- [ ] **DailyProductionList** 컴포넌트 (`src/components/DailyProductionList.jsx`) 생성
  - 카드 안에 테이블 배치 (`bg-white rounded-xl shadow-sm p-4`)
  - 테이블 형태로 목록 표시 (UI만)
  - 테이블 스타일: [design.md 8번 섹션](./design.md#8-테이블-디자인) 참조
  - **정렬 기능** (생산일, 총 생산량, 부품명 등) - 프론트엔드 정렬
  - **필터링** (부품별, 날짜 범위) - 프론트엔드 필터링
  - 수정/삭제 버튼 (권한 확인, `bg-blue-600`)
- [ ] ✅ **1단계 완료 확인**: DailyProductionList 컴포넌트 UI 확인

**2단계: API 연동 및 데이터 검증**
- [ ] React Query `useQuery` 사용
  - 목록 데이터 조회 및 표시
  - 정렬 및 필터링 동작 확인
- [ ] 실제 데이터 목록 표시 테스트
- [ ] ✅ **2단계 완료 확인**: API 연동 및 목록 표시 동작 확인

### 4-4. DataInput 페이지 완성
- [ ] `src/pages/DataInput.jsx`에 폼과 목록 통합
  - DailyProductionForm 통합
  - DailyProductionList 통합
  - 날짜 필터 추가 (선택)
- [ ] ✅ **완료 확인**: DataInput 페이지 전체 플로우 확인

---

## Step 5: 품질 기록 입력 화면

**📌 워크플로우**: API 함수 생성 → 폼 컴포넌트 분리 → 목록 컴포넌트 분리 → 평가 모달 분리 → API 연동

### 5-1. 품질 기록 API 함수 생성
- [ ] `src/api/qualityRecordApi.js` 생성
  - `getQualityRecords()` - 목록 조회 (`GET /api/quality-records`)
  - `getQualityRecord(id)` - 상세 조회 (`GET /api/quality-records/{id}`)
  - `createQualityRecord(data)` - 생성 (`POST /api/quality-records`)
  - `updateQualityRecord(id, data)` - 수정 (`PUT /api/quality-records/{id}`)
  - `deleteQualityRecord(id)` - 삭제 (`DELETE /api/quality-records/{id}`)
  - `evaluateQualityRecord(id, data)` - 평가 (`PUT /api/quality-records/{id}/evaluate`)
    - Request body: `{ expertEvaluation: string }` (전문가 평가 내용)
  - `getEvaluationRequired()` - 평가 필요 목록 (`GET /api/quality-records/evaluation-required`)

### 5-2. 품질 기록 입력 폼

**1단계: 컴포넌트 분리**
- [ ] **QualityRecordForm** 컴포넌트 (`src/components/forms/QualityRecordForm.jsx`) 생성
  - 카드 안에 폼 배치 (`bg-white rounded-xl shadow-sm p-4`)
  - 일별 생산 데이터 선택 (드롭다운)
  - 공정 선택 (드롭다운 - `getProcesses()` 사용)
  - OK 수량 입력
  - NG 수량 입력
  - 총 수량 자동 계산 표시 (OK + NG) - 프론트엔드 계산
  - NG 비율 자동 계산 표시 - 프론트엔드 계산
  - **데이터 검증**: `totalQuantity = okQuantity + ngQuantity` 검증 (프론트엔드에서)
  - 업계 평균(0.5%) 초과 시 경고 표시 (`bg-slate-50 border-l-4 border-slate-400`)
  - 폼 UI만 작성 (API 연동 전)
- [ ] ✅ **1단계 완료 확인**: QualityRecordForm 컴포넌트 UI 확인

**2단계: API 연동 및 데이터 검증**
- [ ] React Query `useMutation` 사용
  - 생성/수정 API 연동
  - 성공 시 목록 새로고침
- [ ] 실제 데이터 입력 테스트
- [ ] ✅ **2단계 완료 확인**: API 연동 및 데이터 입력/수정 동작 확인

### 5-3. 품질 기록 목록 및 평가

**1단계: 컴포넌트 분리**
- [ ] **QualityRecordList** 컴포넌트 (`src/components/QualityRecordList.jsx`) 생성
  - 카드 안에 테이블 배치
  - 목록 표시 (테이블) - UI만
  - **평가 필요 항목 강조 표시** (`evaluationRequired: true`) - `bg-slate-50 border-l-4 border-slate-400`
  - **평가 필요 항목 필터링** (평가 필요만 보기 옵션)
  - NG 비율 컬럼 강조 표시 (임계값 0.5% 초과 시) - `text-red-600` + 오른쪽 정렬
  - 평가 버튼 (평가 필요 항목만, `bg-blue-600`)
  - 정렬 기능 (NG 비율, 평가 필요 여부 등) - 프론트엔드 정렬
  - 상태 표현: 색 + 위치 조합 (design.md 8번 섹션 참조)
- [ ] **QualityRecordEvaluateModal** 컴포넌트 (`src/components/modals/QualityRecordEvaluateModal.jsx`) 생성
  - 평가 내용 입력 (텍스트 영역) - UI만
  - 모달 열기/닫기 동작
  - 저장/취소 버튼 (오른쪽 하단)
- [ ] ✅ **1단계 완료 확인**: 목록 및 모달 컴포넌트 UI 확인

**2단계: API 연동 및 데이터 검증**
- [ ] React Query `useQuery`로 목록 데이터 조회
  - 실제 데이터 목록 표시
  - 평가 필요 항목 필터링 동작 확인
- [ ] `evaluateQualityRecord()` API 호출 (모달에서)
  - Request body: `{ expertEvaluation: string }` 형식으로 전송
  - 평가 입력 및 저장 동작 확인
- [ ] ✅ **2단계 완료 확인**: API 연동 및 평가 기능 동작 확인

---

## Step 6: 대시보드 및 통계 API 연동

### 6-1. 통계 API
- [ ] `src/api/statisticsApi.js` 생성
  - `getStatisticsByProcess(startDate?, endDate?)` - 공정별 NG 비율 (`GET /api/quality-records/statistics/by-process`)
  - `getStatisticsByItem(startDate?, endDate?)` - 부품별 NG 비율 (`GET /api/quality-records/statistics/by-item`)
- [ ] **참고**: 월별/년별 집계는 Phase 2에서 백엔드 API로 구현 예정

### 6-2. 업계 평균 불량률 조회
- [ ] SystemCode API로 업계 평균 불량률 조회
  - `getSystemCodes(codeGroup: "INDUSTRY_AVERAGE")` 사용
  - 업계 평균: `NG_RATE_THRESHOLD` (0.5%)
  - 대시보드 및 그래프에서 비교 기준으로 사용

### 6-3. 기본 날짜 범위 선택
- [ ] **날짜 범위 선택 기능** 추가
  - `startDate`와 `endDate`로 통계 데이터 조회
  - 날짜 입력 필드 (시작일/종료일)
  - **참고**: 월별/년별 집계는 Phase 2에서 백엔드 API로 구현 예정

### 6-4. 통계 데이터 조회 및 정렬
- [ ] React Query `useQuery`로 통계 데이터 조회
  - 날짜 범위 선택 기능 추가
  - 업계 평균과 비교하여 표시
- [ ] **통계 데이터 정렬 기능** (프론트엔드에서)
  - NG 비율 기준 정렬 (오름차순/내림차순)
  - 공정명/부품명 기준 정렬
  - 총 NG 수량 기준 정렬

---

## Step 7: 그래프 시각화 (Chart.js)

**📌 워크플로우**: 그래프 컴포넌트 분리 → Chart.js 설정 → API 연동 → Dashboard 통합

### 7-1. 공정별 NG 비율 그래프

**1단계: 컴포넌트 분리**
- [ ] **ProcessNgRateChart** 컴포넌트 (`src/components/charts/ProcessNgRateChart.jsx`) 생성
  - 카드 안에 그래프 배치 (`bg-white rounded-xl shadow-sm p-4`)
  - Chart.js `Bar` 컴포넌트 기본 설정
  - X축: 공정명 (W, P, 검)
  - Y축: NG 비율 (%)
  - 더미 데이터로 그래프 표시 확인
  - **업계 평균(0.5%) 기준선 표시** (수평선 또는 배경색)
  - 그래프 스타일: [design.md 9번 섹션](./design.md#9-그래프-디자인) 참조
  - 색상: 파란색 + 빨간색 2개만 사용
- [ ] ✅ **1단계 완료 확인**: ProcessNgRateChart 컴포넌트 UI 확인

**2단계: API 연동 및 데이터 검증**
- [ ] `getStatisticsByProcess()` 데이터 연동
  - React Query `useQuery` 사용
  - 실제 통계 데이터로 그래프 표시
  - 임계값 초과 항목 강조 표시 (다른 색상)
- [ ] ✅ **2단계 완료 확인**: API 연동 및 그래프 데이터 표시 확인

### 7-2. 부품별 NG 비율 그래프

**1단계: 컴포넌트 분리**
- [ ] **ItemNgRateChart** 컴포넌트 (`src/components/charts/ItemNgRateChart.jsx`) 생성
  - Chart.js `Bar` 컴포넌트 기본 설정
  - X축: 부품명 (24개 부품)
  - Y축: NG 비율 (%)
  - 더미 데이터로 그래프 표시 확인
  - **업계 평균(0.5%) 기준선 표시** (수평선 또는 배경색)
- [ ] ✅ **1단계 완료 확인**: ItemNgRateChart 컴포넌트 UI 확인

**2단계: API 연동 및 데이터 검증**
- [ ] `getStatisticsByItem()` 데이터 연동
  - React Query `useQuery` 사용
  - 실제 통계 데이터로 그래프 표시
  - 임계값 초과 항목 강조 표시 (다른 색상)
- [ ] ✅ **2단계 완료 확인**: API 연동 및 그래프 데이터 표시 확인

### 7-3. 기간별 추세 그래프 (기본)

**1단계: 컴포넌트 분리** (선택)
- [ ] **TrendChart** 컴포넌트 (`src/components/charts/TrendChart.jsx`) 생성
  - Chart.js `Line` 컴포넌트 기본 설정
  - X축: 날짜 (일별)
  - Y축: NG 비율 (%)
  - 더미 데이터로 그래프 표시 확인
- [ ] ✅ **1단계 완료 확인**: TrendChart 컴포넌트 UI 확인 (선택)

**2단계: API 연동 및 데이터 검증** (선택)
- [ ] 날짜 범위 선택 기능
  - 통계 API로 일별 데이터 조회
  - 라인 그래프로 표시
- [ ] ✅ **2단계 완료 확인**: API 연동 및 추세 그래프 표시 확인 (선택)
- **참고**: 월별/년별 집계 및 고급 추세 분석은 Phase 2에서 구현 예정

### 7-4. Dashboard 페이지 완성

**1단계: 통계 카드 컴포넌트 분리**
- [ ] **StatCard** 컴포넌트 (`src/components/StatCard.jsx`) 생성
  - 통계 카드 공통 컴포넌트
  - 카드 스타일: `bg-white rounded-xl shadow-sm p-4` (모든 카드 동일)
  - 제목: `text-sm font-medium text-gray-500`
  - 값 (숫자): `text-xl font-bold text-gray-900` (NG 관련은 `text-red-600`)
  - 단위: `text-xs text-gray-500`
  - 카드 높이 통일 (`min-h-[120px]` 또는 `h-24`)
  - 디자인 가이드 준수: [design.md 7.2 KPI 카드](./design.md#1-kpi-요약-영역-가장-중요) 참조
- [ ] Dashboard 페이지에 통계 카드 추가 (3~4개 권장)
  - 총 생산량 카드 (중립 색상)
  - 총 NG 수량 카드 (빨간 텍스트 `text-red-600`)
  - NG 비율 카드 (빨간 텍스트 `text-red-600`)
  - 전일 대비 카드 (중립 색상)
- [ ] ✅ **1단계 완료 확인**: 통계 카드 컴포넌트 분리 확인

**2단계: API 연동 및 그래프 통합**
- [ ] 날짜 범위 선택 필터 추가 (선택적)
  - 시작일/종료일 선택
  - 통계 데이터 새로고침
  - 기본값: 오늘 기준 (현재 날짜)
- [ ] ProcessNgRateChart, ItemNgRateChart 통합 (그래프 2개 권장)
- [ ] React Query로 통계 데이터 조회
- [ ] 업계 평균 불량률 카드 표시 (SystemCode에서 동적 조회)
- [ ] Dashboard 레이아웃: [design.md 7.2 와이어프레임](./design.md#전체-레이아웃-구조-참고용-와이어프레임) 참조
  - KPI 카드 영역 (상단, 3~4개)
  - 그래프 영역 (중앙, 2개)
  - 최근 NG 발생 목록 (하단, 테이블)
- [ ] ✅ **2단계 완료 확인**: Dashboard 페이지 전체 동작 확인

---

## Step 8: 최종 정리 및 테스트

### 8-1. 에러 처리
- [ ] API 에러 처리 확인
  - 401 에러 → 로그인 페이지 리다이렉트 (이미 `apiClient`에 구현됨)
  - 403 에러 → 권한 없음 메시지 표시
  - 400 에러 → 에러 메시지 표시

### 8-2. 로딩 상태
- [ ] 모든 데이터 조회 화면에 로딩 표시
  - React Query `isLoading` 사용

### 8-3. 권한별 UI 제어
- [ ] 사용자 Role에 따른 버튼 표시/숨김
  - USER: 일부 수정/삭제 버튼 숨김
  - MANAGER: 부품 생성/수정 버튼 표시
  - ADMIN: 모든 버튼 표시

### 8-4. 반응형 디자인 (선택)
- [ ] Tailwind CSS로 모바일 대응
  - 테이블, 그래프 모바일 최적화

### 8-5. 통합 테스트
- [ ] 로그인 → 데이터 입력 → 통계 조회 → 그래프 표시 전체 플로우 확인
- [ ] 권한별 접근 제어 확인
- [ ] API 연동 확인

---

## 9. 토큰 있으면 자동 로그인 하기
- 로그아웃하면 토큰 삭제 하기

## 📝 참고사항

### API 응답 형식
모든 API 응답은 다음 형식입니다:
```javascript
{
  status: 200,
  msg: "성공",
  body: { /* 실제 데이터 */ }
}
```

### 날짜 형식
- 요청/응답: `"yyyy-MM-dd"` (예: `"2025-01-18"`)
- 날짜 입력: HTML5 `<input type="date">` 사용

### 데이터 검증
- **품질 기록 입력**: `totalQuantity = okQuantity + ngQuantity` 검증 (프론트엔드 폼에서)
- **일별 생산 데이터**: 같은 부품의 같은 날짜는 중복 입력 불가 (UNIQUE 제약)
- **NG 비율**: 업계 평균(0.5%) 초과 시 경고 표시

### 기간별 통계 및 정렬
- **날짜 범위 조회**:
  - `startDate`와 `endDate` 파라미터로 기간 필터링 가능
  - **참고**: 월별/년별 자동 집계 및 고급 통계는 Phase 2에서 백엔드 API로 구현 예정
- **정렬 기능**:
  - 현재 Spring 서버 API에는 정렬 파라미터가 없음
  - 프론트엔드에서 데이터 정렬 처리 (NG 비율, 이름, 수량 등)
  - **참고**: 서버 사이드 정렬은 Phase 2에서 구현 예정

### 업계 평균 불량률
- **업계 평균**: 0.1-0.5% (자동차 부품 업계)
- **임계값**: 0.5% 이상 시 평가 필요
- SystemCode API (`INDUSTRY_AVERAGE` 그룹)에서 동적으로 조회하여 표시

### 인증 토큰
- 토큰은 `apiClient` 인터셉터에서 자동으로 헤더에 추가됩니다
- localStorage에 `token`으로 저장됩니다

### React Query 사용 패턴
```javascript
// 조회
const { data, isLoading, error } = useQuery({
  queryKey: ['key', params],
  queryFn: () => apiFunction(params)
});

// 수정/생성/삭제
const mutation = useMutation({
  mutationFn: apiFunction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] });
  }
});
```

---

## ✅ 완료 기준

- [x] React 프로젝트 초기화 및 기본 설정
- [ ] 로그인/회원가입 페이지 동작 확인
- [ ] 데이터 입력 화면 (일별 생산 데이터, 품질 기록) 동작 확인
- [ ] 대시보드 및 통계 화면 동작 확인
- [ ] 공정별/부품별 NG 비율 그래프 표시 확인
- [ ] Spring Boot API와 정상 연동 확인
- [ ] 권한별 접근 제어 확인

---

---

## 📖 개발 시 참고사항

### 필수 참고 문서
- **`context/rules.md`**: 코드 스타일, 개발 패턴, 기술 스택 ([바로가기](./rules.md))
- **`context/design.md`**: UI/UX 디자인 가이드 (색상, 타이포그래피, 컴포넌트 스타일) ([바로가기](./design.md))
- **`context/api-checklist.md`**: API 엔드포인트 체크리스트 ([바로가기](./api-checklist.md))

### 주요 디자인 규칙 요약
- ✅ **모든 페이지**: Layout 컴포넌트 사용 (로그인/에러 페이지 제외)
- ✅ **페이지 제목**: 왼쪽 상단, `text-lg font-semibold`, 페이지당 1개
- ✅ **액션 버튼**: 오른쪽 상단 또는 하단, `bg-blue-600` (통일)
- ✅ **모든 정보**: 카드 안에 (`bg-white rounded-xl shadow-sm p-4`)
- ✅ **색상**: NG 관련만 빨간색 (`text-red-600`), 나머지 중립
- ✅ **테이블**: 상태 표현 시 색 + 위치 조합 (예: `text-red-600` + 오른쪽 정렬)

**💡 상세 내용은 `design.md`를 참고하세요!**
