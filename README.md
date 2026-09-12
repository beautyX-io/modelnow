# MODELNOW — 헤어/네일 모델 매칭 (모바일 웹앱)

헤어·네일 모델을 하고 싶은 사람이 **사진 3장 + 소개**를 올리고, 그 글이 게시판에 쌓이면 디자이너가 보고 인스타그램·카카오톡 오픈채팅으로 연락하는 서비스.

디자인 원본은 `Hair and nail model matching app/design_handoff_muze_model_matching/` 에 있다. 그 안의 `.dc.html` 은 읽기용 레퍼런스라 빌드에 포함되지 않는다.

## 실행

```bash
npm install
npm run dev
```

| 경로 | 화면 |
| --- | --- |
| `/` | 지원 게시판 — 올라온 글이 모이고 분류·정렬된다 |
| `/new` | 글쓰기 — 사진 3장과 소개를 올린다 |
| `/posts/[id]` | 게시물 상세 — 사진 3장, 소개, 연락 수단 |
| `/recruit` | 디자이너가 올린 구인 공고 → 모집 상세 → 지원서 |
| `/designer` | 디자이너 측 지원자 목록 · 상세 |

기준 폭은 402px(iPhone), 데스크톱에서는 480px로 중앙 정렬된다. 매니페스트와 아이콘이 있어 홈 화면에 추가하면 앱처럼 뜬다.

## 스택

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React 19.

배경은 흰색이다. 흰 카드가 흰 바탕에 묻히지 않도록 헤어라인 보더와 아주 옅은 그림자(`shadow-lift`)로 띄우고, 앰버 액센트는 한 화면에 한 번만 쓴다.

디자인 토큰은 전부 `app/globals.css` 의 `@theme` 에 있다. 색·타이포·라운드는 여기서만 정의하고 컴포넌트는 토큰 유틸리티(`bg-app`, `text-title`, `rounded-card` …)를 쓴다. 줄무늬 자리표시자(`stripe`), 하단 바 블러(`bottom-blur`), 화면 전환(`screen-enter`)은 같은 파일의 커스텀 유틸리티다.

## 구조

```
app/
  page.tsx              게시판 (홈)
  new/page.tsx          글쓰기
  posts/[id]/page.tsx   게시물 상세
  recruit/page.tsx      구인 공고 플로우
  designer/page.tsx     디자이너 측
  manifest.ts           웹앱 매니페스트
  globals.css           디자인 토큰 + 커스텀 유틸리티
components/
  board/                게시판 · 글쓰기 · 게시물 상세
  model/                구인 공고 피드 → 상세 → 지원서 3단계 → 완료
  designer/             지원자 목록 · 지원자 상세
  connect/              인스타그램 · 카카오 오픈채팅 임베드 (모든 화면 공용)
  ui/                   칩 · 사진 슬롯 · 자리표시자 · 헤더 · 하단 바 · 탭바
lib/
  model-posts.ts        게시물 타입 · 예시 글 · 저장소
  use-model-posts.ts    저장소 구독 훅
  image.ts              EXIF 보정 + 리사이즈
  photo-slots.ts        카테고리별 사진 3장 규격
  mock-data.ts          구인 공고 · 지원자 목데이터
  types.ts, validation.ts
```

## 규칙

**사진 3장 필수.** 메인은 헤어면 정면 얼굴, 네일이면 손등이다. 추가 두 장은 현재 상태와 희망 스타일. 세 장을 다 올리기 전에는 등록 버튼이 비활성이고 라벨이 남은 장수를 알려준다. 규격 문구는 `lib/photo-slots.ts` 한곳에서 갈린다.

**연락 수단은 양쪽에.** 인스타그램 계정과 카카오톡 오픈채팅 링크는 글쓰기, 게시물 상세, 구인 지원서, 디자이너의 지원자 상세에서 같은 컴포넌트를 변형만 바꿔 쓴다. 오픈채팅 링크는 `open.kakao.com` 도메인만 통과한다.

**게시판 분류.** 카테고리(전체·헤어·네일)와 지역으로 거르고, 최신순·오래된순으로 정렬한 뒤 오늘·어제·이번 주·이전으로 구간을 나눠 보여준다.

## 저장소

게시물은 지금 브라우저 `localStorage`(`modelnow.model-posts.v1`)에 쌓인다. 사진은 장변 1280px JPEG로 줄여 dataURL로 함께 저장한다. 즉 **같은 브라우저에서만 보이고 다른 기기와 공유되지 않는다.**

백엔드를 붙일 때는 `lib/model-posts.ts` 의 `readStorage` / `writeStorage` 를 API 호출로 바꾸고, `lib/image.ts` 가 만든 이미지를 서명 URL로 업로드한 뒤 그 URL을 저장하면 된다. 화면 쪽은 손대지 않아도 된다.

## 아직 목업인 것

- 인증이 없다. 누구나 글을 쓰고 지울 수 있다.
- 구인 공고(`/recruit`)와 디자이너 측(`/designer`) 데이터는 `lib/mock-data.ts` 목데이터이고, 화면 전환도 URL이 아니라 컴포넌트 상태다.
- 인스타그램 임베드 썸네일은 자리표시자다. oEmbed 연동이 필요하다.
- 탭바 아이콘은 직접 그린 스트로크 아이콘이다. 화면 안쪽 아이콘 자리는 아직 사각·원 자리표시자다.
