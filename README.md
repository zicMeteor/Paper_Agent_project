## PPA 프로토타입
키워드 기반 논문 검색 + AI 요약 + 디스코드 알람 UI 프로토타입.
가상 데이터 사용중a

# 실행 방법
- yarn install

- yarn dev
- h+enter
- o+enter
- 브라우저에서 http://localhost:5173 접속
- q+enter (종료)

## 기술 스택
- React 19 + Vite

## 폴더 구조

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

## 설명?

- id: 논문 고유 ID (number)
- title: 논문 제목 (string)
- authors: 저자 목록, **콤마+공백으로 구분된 문자열** (배열 아님)
- year: 발행 연도 (number)
- journal: 게재 저널 (string)
- citations: 인용 수 (number)
- summary: AI 요약. **summary=true일 때만 채워짐**, 그 외엔 빈 문자열 또는 생략 가능

## AI 요약 모드
- body : 본문 기반 요약
- abstract : 초록 기반 요약
- full : 전체 내용 요약

## 요약 api
- 백엔드 연결시 USE_MOCK = false 로 바꾸기

## 디스코드 api 
- setTimeout 이라는 mock 로직이 있으므로 그 부분을 변경하면댐