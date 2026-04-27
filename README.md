# PPA 프로토타입
키워드 기반 논문 검색 + AI 요약 UI 프로토타입.
가상 데이터 사용중

## 실행 방법
```
yarn install   # 최초 1회만
yarn dev
```
- `h + Enter` : 도움말
- `o + Enter` : 브라우저 자동 열기
- 브라우저에서 http://localhost:5173 접속
- `q + Enter` : 종료

## 기술 스택
- React 19 + Vite

## 폴더 구조
```
src/
├─ main.jsx              # 엔트리
├─ App.jsx               # 라우터 설정
├─ App.css               # (현재 비어 있음)
├─ index.css             # 전역 변수, 다크모드, 기본 스타일
└─ pages/
   ├─ HomePage.jsx       # 검색 화면
   ├─ HomePage.css
   ├─ ResultsPage.jsx    # 결과 화면 + 가상데이터
   └─ ResultsPage.css
```

## 데이터 필드 명세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | number | 논문 고유 ID |
| `title` | string | 논문 제목 |
| `authors` | string | 저자 목록 (콤마+공백 구분 문자열, 배열 아님) |
| `year` | number | 발행 연도 |
| `source.type` | string | `'conference'` 또는 `'journal'` |
| `source.name` | string | 게재 학회/저널명 |
| `source.url` | string | 논문 원문 링크 |
| `citations` | number | 인용 수 |
| `keywords` | string[] | 키워드 배열 |
| `summary` | string | AI 요약 텍스트. `summaryMode`가 있을 때만 채워짐, 그 외 빈 문자열 또는 생략 가능 |

## AI 요약 모드 (`summaryMode`)

검색 시 프론트에서 `summaryMode` 값을 함께 전달합니다.

| 값 | 설명 |
|----|------|
| `'body'` | 본문 기반 요약 |
| `'abstract'` | 초록 기반 요약 |
| `'full'` | 전체 내용 요약 + 키워드 포함 |

## Discord 알람 (OAuth 연동 예정)

현재 프론트는 mock 상태로 동작 중. 백엔드 연동 시 아래 교체 필요.

### 필요한 엔드포인트

| 메서드 | 경로 | 역할 |
|--------|------|------|
| `GET` | `/api/discord/oauth/redirect` | Discord OAuth 페이지로 리다이렉트 |
| `GET` | `/api/discord/oauth/callback` | code → access_token 교환 후 프론트로 리다이렉트 |
| `POST` | `/api/discord/test` | 테스트 알림 전송 |

### OAuth 콜백 후 프론트 리다이렉트 규칙

```
성공: http://localhost:5173/?discord=connected
실패: http://localhost:5173/?discord=error
```

### 프론트 교체 지점

**연결하기 버튼** `src/pages/HomePage.jsx`
```js
// 현재 (mock)
setTimeout(() => { setDiscordConnected(true); setConnectingDiscord(false) }, 1500)

// 교체
window.location.href = '/api/discord/oauth/redirect'
```

**테스트 알림 버튼** `src/pages/HomePage.jsx`
```js
// 현재 (mock)
setTimeout(() => setTestingDiscord(false), 1500)

// 교체
const res = await fetch('/api/discord/test', { method: 'POST' })
if (res.ok) setTestingDiscord(false)
```

### 주의사항
- `Client Secret`, `access_token`은 백엔드 `.env`에만 보관, 프론트 코드에 절대 포함 금지
- `access_token` 만료(7일) 대비 `refresh_token`도 함께 저장

## 백엔드 연결 시

`USE_MOCK = false` 로 변경
