# MODELNOW — 헤어/네일 모델 매칭 (모바일 웹앱)

헤어·네일 모델을 하고 싶은 사람이 **사진 3장 + 소개**를 올리고, 그 글이 게시판에 쌓이면 디자이너가 보고 인스타그램·카카오톡 오픈채팅으로 연락하는 서비스.

디자인 원본은 `Hair and nail model matching app/design_handoff_muze_model_matching/` 에 있다. 그 안의 `.dc.html` 은 읽기용 레퍼런스라 빌드에 포함되지 않는다.

## 실행

```bash
npm install
npm run dev
```

Supabase 프로젝트가 필요하다. `.env.local` 에 아래 두 값을 넣는다(이미 들어있다면 그대로 두면 된다):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxx
```

그리고 **`supabase/schema.sql` 을 Supabase 대시보드의 SQL Editor 에 한 번 붙여넣어 실행**해야 한다 — 테이블·정책·삭제 함수·사진 버킷·예시 글 4개가 이 파일 하나에 다 들어있다. anon 키만으로는 테이블을 만들 수 없어서 이 한 단계만은 직접 해야 한다.

| 경로 | 화면 |
| --- | --- |
| `/` | 지원 게시판 — 올라온 글이 모이고 분류·정렬된다 |
| `/new` | 글쓰기 — 사진 3장과 소개를 올린다 |
| `/posts/[id]` | 게시물 상세 — 사진 3장, 소개, 연락 수단 |
| `/recruit` | 디자이너가 올린 구인 공고 → 모집 상세 → 지원서 |
| `/designer` | 디자이너 측 지원자 목록 · 상세 |
| `/designer/new` | 디자이너의 모집 공고 작성 |

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
  designer/new/page.tsx 디자이너의 모집 공고 작성
  manifest.ts           웹앱 매니페스트
  globals.css           디자인 토큰 + 커스텀 유틸리티
components/
  board/                게시판 · 글쓰기 · 게시물 상세
  model/                구인 공고 피드 → 상세 → 지원서 3단계 → 완료
  designer/             지원자 목록 · 지원자 상세
  connect/              인스타그램 · 카카오 오픈채팅 임베드 (모든 화면 공용)
  ui/                   칩 · 사진 슬롯 · 자리표시자 · 헤더 · 하단 바 · 탭바
lib/
  supabase/client.ts     브라우저 Supabase 클라이언트 (anon 키, 세션 없음)
  model-posts.ts         게시물 타입 · Supabase 조회/등록/삭제
  post-photos.ts         사진 3장을 Storage 에 올리고 공개 URL로 바꾼다
  contact.ts             연락 방법 정의 · 검증 · 대표 연락 주소
  post-password.ts       삭제용 4자리 비밀번호 해시(SHA-256)
  use-model-posts.ts     목록 조회 + Realtime 구독 훅
  image.ts               EXIF 보정 + 리사이즈 + Blob 변환
  photo-slots.ts         카테고리별 사진 3장 규격
  mock-data.ts            구인 공고 · 지원자 목데이터 (씨드)
  recruit-posts.ts        구인 공고 세션 메모리 저장소 (디자이너가 올린 새 공고)
  use-recruit-posts.ts    위 저장소 구독 훅
  types.ts, validation.ts
supabase/
  schema.sql             테이블 · RLS · 삭제 함수 · 사진 버킷 · 예시 글 (SQL Editor 에서 한 번 실행)
```

## 규칙

**사진 3장 필수.** 메인은 헤어면 정면 얼굴, 네일이면 손등이다. 추가 두 장은 현재 상태와 희망 스타일. 세 장을 다 올리기 전에는 등록 버튼이 비활성이고 라벨이 남은 장수를 알려준다. 규격 문구는 `lib/photo-slots.ts` 한곳에서 갈린다.

**연락 방법은 골라서.** 인스타그램 DM, 문자·전화, 카카오톡 오픈채팅 중 원하는 만큼 고르고 고른 것만 입력한다. 값까지 갖춘 방법이 하나도 없으면 글을 올릴 수 없고, 골라만 두고 비운 방법은 저장되지 않는다. 게시물에는 고른 방법만 공개되고 하단 버튼은 `lib/contact.ts` 의 선언 순서에서 먼저 오는 방법을 연다. 오픈채팅 링크는 `open.kakao.com` 도메인만, 번호는 휴대폰 형식만 통과한다.

같은 선택 UI(`components/connect/ContactMethodPicker.tsx`)를 글쓰기와 구인 지원서 3단계가 함께 쓴다.

**서비스 지역은 광주광역시.** 광산구·동구·북구·서구 네 곳만 연다. 글쓰기에는 `광주 전체` 가 하나 더 있고, 이걸 고르면 개별 구 선택이 풀린다(반대도 마찬가지). `광주 전체` 로 올린 글은 게시판에서 어느 구를 걸러도 함께 나온다. 목록은 `lib/model-posts.ts` 의 `REGIONS` 한 곳에 있으니 지역을 넓힐 때는 이 배열만 고치면 된다.

**가능한 시간은 시간대까지.** 평일·주말을 오전(09~12시)·오후(12~18시)·저녁(18~21시)으로 쪼갠 여섯 개다. 목록 카드처럼 좁은 자리에서는 `shortAvailability` 로 시간대를 떼고 보여준다.

**선택 항목은 전부 중복 선택.** 시술희망지역·가능한 시간·현재 상태·연락 방법은 여러 개 고를 수 있다. 분류(헤어/네일)만 하나인데, 메인 사진 규격이 정면 얼굴과 손등으로 갈리고 게시판도 이 값으로 나뉘기 때문이다. 둘 다 하려면 글을 따로 올린다.

**고른 값은 자동으로 정리된다.** 글쓰기 맨 아래 "이렇게 올라갑니다" 카드가 고른 항목을 실시간으로 모아 보여주고, 게시물 상세가 같은 모양으로 그대로 싣는다. 소개 글에 조건을 다시 적을 필요가 없다.

**동의와 본인 확인이 있어야 올라간다.** 등록 버튼 바로 위에 초상권 사용 동의 체크박스와 본인 이름 입력칸이 있다. 체크와 이름 둘 다 채워야 등록 버튼이 켜지고, `lib/model-posts.ts` 의 `agreedToPortraitUse` · `name` 으로 저장된다. 이름은 `maskName` 을 거쳐 가운데 글자만 `*` 로 가려 보인다("김민서" → "김*서"). 이 규칙 이전에 저장된 글은 이름 없이, 동의는 된 것으로 취급한다.

**삭제는 본인만, 비밀번호 4자리로.** 회원가입이 없으니 이 번호가 유일한 본인 확인이다. 글을 올릴 때 `hashPin` 이 SHA-256 해시로 바꿔 `pin_hash` 컬럼에만 남기고 평문은 어디에도 저장하지 않는다. 비교는 클라이언트가 아니라 데이터베이스의 `delete_post_with_pin(post_id, pin)` 함수가 서버에서 한다 — `posts` 테이블에는 DELETE 정책 자체가 없어서, anon 키로 아무리 직접 API를 두드려도 이 함수를 거치지 않고는 글을 지울 수 없다. 틀리면 그 자리에서 오류를 보여주고 입력칸을 비운다. `pin_hash` 가 없는 글(샘플 4개)은 이 함수가 비밀번호 확인 없이 바로 지운다.

**게시판 분류와 검색.** 카테고리(전체·헤어·네일)와 지역으로 거르고, 최신순·오래된순으로 정렬한 뒤 오늘·어제·이번 주·이전으로 구간을 나눠 보여준다. "글쓰기" 왼쪽 돋보기를 누르면 검색창이 열리고, 제목·소개·분류·지역·시간·상태를 함께 훑는 `matchesQuery` 로 실시간 필터링된다. 회원가입이 없어 검색이 사실상 유일한 탐색 수단이라 좁게 잡지 않았다.

**사진에는 주제 배지.** 올라온 사진은 우측 상단에 반투명 배지로 메인·지금 상태·희망 스타일을 표시한다(`components/ui/PhotoFrame.tsx`). 배지 문구는 `lib/photo-slots.ts` 의 `badge` 에서 나오고, 글쓰기 썸네일은 좁아서 앞부분만 쓴다.

## 저장소

게시물과 사진은 이제 Supabase 에 쌓인다 — 같은 사이트를 여는 모든 사람이 같은 게시판을 본다.

- **테이블**: `public.posts` (컬럼은 snake_case, `lib/model-posts.ts` 의 `rowToPost`/`postToInsertRow` 가 화면이 쓰는 camelCase `ModelPost` 로 바꿔준다)
- **사진**: 글을 등록하는 순간(사진을 고르는 동안이 아니라) `post-photos` 공개 버킷에 올라가고, 공개 URL이 `photo_main`/`photo_current`/`photo_desired` 컬럼에 저장된다
- **읽기·쓰기 권한**: 회원가입이 없어 anon 키로 누구나 읽고 쓴다(RLS `select`/`insert` 정책이 열려 있다). **삭제만은** 테이블 정책으로 열지 않고 `delete_post_with_pin` 함수로만 되도록 잠갔다 — 자세한 건 위 "삭제는 본인만" 항목 참고
- **실시간 반영**: `use-model-posts.ts` 가 Supabase Realtime 을 구독해서, 다른 사람이 올리거나 지운 글도 새로고침 없이 보인다

## 아직 목업인 것

- 게시판·삭제 함수 외에는 인증이 전혀 없다. 4자리 비밀번호 해시에 솔트가 없어 무차별 대입에 약하다 — 지금 규모에서는 감수할 만하지만 실서비스로 키우면 `delete_post_with_pin` 에 시도 횟수 제한을 붙이는 걸 권한다.
- 사진·글 업로드에 개수·용량 제한이 없다. `post-photos` 버킷도 anon 이 자유롭게 올릴 수 있게 열려 있어, 실서비스로 가면 Storage 정책에 크기 제한이나 레이트 리밋을 더해야 한다.
- 구인 공고(`/recruit`)와 디자이너 측(`/designer`) 데이터는 여전히 목데이터다. `/designer/new` 에서 디자이너가 올린 공고는 `lib/recruit-posts.ts` 의 세션 메모리 저장소에만 쌓이고 새로고침하면 사라진다 — Supabase 로 옮기지 않았다. 모델 지원 화면 안 화면 전환도 URL이 아니라 컴포넌트 상태다.
- 인스타그램 임베드 썸네일은 자리표시자다. oEmbed 연동이 필요하다.
- 탭바 아이콘은 직접 그린 스트로크 아이콘이다. 화면 안쪽 아이콘 자리는 아직 사각·원 자리표시자다.
