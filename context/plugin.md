# 설치된 React 개발 플러그인 목록

현재 설치된 플러그인을 기반으로 React + Vite + Tailwind CSS 프로젝트 개발에 실제로 사용 중인 플러그인 목록입니다.

---

## 🔥 현재 설치된 플러그인 (React 개발 필수)

### 1. React 개발

#### **ES7+ React/Redux/React-Native snippets** ✅
- **ID**: `dsznajder.es7-react-js-snippets`
- **설명**: React 컴포넌트, Hooks 등 자주 사용하는 코드 스니펫 제공
- **사용 예시**: `rafce` (React Arrow Function Component Export), `usestate` 등
- **상태**: 설치됨 ✅

#### **Auto Rename Tag** ✅
- **ID**: `formulahendry.auto-rename-tag`
- **설명**: HTML/JSX 태그를 열거나 닫을 때 자동으로 쌍을 찾아 이름 변경
- **장점**: 태그 이름 변경 시 실수 방지
- **상태**: 설치됨 ✅

#### **Auto Close Tag** ✅
- **ID**: `formulahendry.auto-close-tag`
- **설명**: JSX/HTML 태그를 자동으로 닫아줌
- **장점**: 생산성 향상
- **상태**: 설치됨 ✅

---

### 2. 코드 품질 및 포맷팅

#### **ESLint** ✅
- **ID**: `dbaeumer.vscode-eslint`
- **설명**: JavaScript/TypeScript 린팅 (프로젝트에 설정됨)
- **장점**: 코드 오류 및 스타일 자동 검사
- **상태**: 설치됨 ✅

#### **Prettier - Code formatter** ✅
- **ID**: `esbenp.prettier-vscode`
- **설명**: 코드 자동 포맷팅
- **장점**: 일관된 코드 스타일 유지
- **상태**: 설치됨 ✅
- **설정**: `.vscode/settings.json`에 자동 포맷팅 설정됨

---

### 3. Tailwind CSS

#### **Tailwind CSS IntelliSense** ✅
- **ID**: `bradlc.vscode-tailwindcss`
- **설명**: Tailwind CSS 클래스 자동완성, 린팅, 호버 정보
- **장점**: Tailwind 클래스명 오타 방지, 사용 가능한 클래스 확인
- **상태**: 설치됨 ✅

---

### 4. 개발 생산성

#### **Path Intellisense** ✅
- **ID**: `christian-kohler.path-intellisense`
- **설명**: 파일 경로 자동완성
- **장점**: import 경로 오타 방지
- **상태**: 설치됨 ✅

---

## 🐳 Docker 관련 (유지 권장)

- `ms-azuretools.vscode-docker` - Docker 지원
- `ms-azuretools.vscode-containers` - 컨테이너 관리

**권장**: Docker Compose로 백엔드 실행 시 유용하므로 유지 권장

---

## 📋 플러그인 정리 요약

### React 개발 필수 (유지)
- ✅ ES7+ React snippets
- ✅ Auto Rename Tag
- ✅ Auto Close Tag
- ✅ ESLint
- ✅ Prettier
- ✅ Tailwind CSS IntelliSense
- ✅ Path Intellisense

---

## ⚙️ 현재 설정 (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^\"'`]*)(?:'|\"|`)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 🗑️ 플러그인 제거 명령어

### GitLens 제거 (권장)
```bash
cursor --uninstall-extension eamodio.gitlens
```

### Python 관련 제거 (Python 작업 없다면)
```bash
cursor --uninstall-extension ms-python.python
cursor --uninstall-extension ms-python.debugpy
cursor --uninstall-extension anysphere.cursorpyright
```

### Java/Spring Boot 관련 제거 (백엔드 작업 안 한다면)
```bash
cursor --uninstall-extension redhat.java
cursor --uninstall-extension vscjava.vscode-java-pack
cursor --uninstall-extension vmware.vscode-spring-boot
# ... 기타 Java 관련 확장
```

---

## 📚 추가 리소스

- [VSCode Extension Marketplace](https://marketplace.visualstudio.com/vscode)
- [React Developer Tools](https://react.dev/learn/react-developer-tools) (브라우저 확장 - 설치 권장)
- [Tailwind CSS IntelliSense Docs](https://github.com/tailwindlabs/tailwindcss-intellisense)

---

## 💬 참고사항

- **React 개발에는 8개 필수 플러그인만 있으면 충분합니다**
- GitLens는 터미널에서 Git을 직접 사용하므로 제거 권장
- 백엔드와 함께 개발한다면 Java/Spring Boot 플러그인 유지
- Docker로 백엔드를 실행한다면 Docker 플러그인 유지 권장
