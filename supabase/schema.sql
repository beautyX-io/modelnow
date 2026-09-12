-- MODELNOW — 지원 게시판 스키마
--
-- Supabase 대시보드의 SQL Editor 에 이 파일 전체를 붙여넣고 한 번 실행하면 된다.
-- 회원가입이 없는 사이트라 누구나(anon) 글을 읽고 쓸 수 있게 열어두되,
-- 삭제만은 테이블 정책으로 직접 열지 않고 delete_post_with_pin() 함수를 거치게 해서
-- 4자리 비밀번호를 맞혀야만 지워지도록 잠근다.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. posts 테이블
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (category in ('헤어', '네일')),
  title text not null check (char_length(title) between 1 and 60),
  body text not null check (char_length(body) between 1 and 1000),
  photo_main text,
  photo_current text,
  photo_desired text,
  regions text[] not null default '{}',
  availabilities text[] not null default '{}',
  conditions text[] not null default '{}',
  -- { channels: string[], instagram: string, phone: string, kakaoUrl: string }
  contact jsonb not null default '{}'::jsonb,
  name text not null check (char_length(name) between 1 and 20),
  agreed_to_portrait_use boolean not null default false,
  -- 삭제용 4자리 비밀번호의 SHA-256 해시. 평문은 절대 저장하지 않는다.
  -- null 이면 비밀번호 없이 삭제되는 예전/샘플 글이라는 뜻이다.
  pin_hash text
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);

alter table public.posts enable row level security;

-- 누구나 읽는다 — 회원가입이 없는 게시판이라 전부 공개다.
drop policy if exists "posts are publicly readable" on public.posts;
create policy "posts are publicly readable"
  on public.posts for select
  to anon, authenticated
  using (true);

-- 누구나 쓴다 — 동의 체크와 비밀번호는 앱이 강제하지만, 데이터베이스에서도 한 번 더 막는다.
drop policy if exists "anyone can create a post" on public.posts;
create policy "anyone can create a post"
  on public.posts for insert
  to anon, authenticated
  with check (agreed_to_portrait_use = true and pin_hash is not null);

-- update / delete 정책은 만들지 않는다. 삭제는 아래 delete_post_with_pin() 함수로만 한다.

-- ---------------------------------------------------------------------------
-- 2. 비밀번호로 삭제하는 함수
--    security definer 로 테이블 정책을 우회해서 실행되므로, anon 이 직접
--    DELETE 를 날릴 방법은 없고 이 함수를 통해서만 (비밀번호가 맞을 때만) 지워진다.
-- ---------------------------------------------------------------------------
create or replace function public.delete_post_with_pin(post_id uuid, pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  stored_hash text;
begin
  select pin_hash into stored_hash from public.posts where id = post_id;

  if not found then
    return false;
  end if;

  -- 비밀번호가 없던 예전 글은 확인 없이 지운다
  if stored_hash is null then
    delete from public.posts where id = post_id;
    return true;
  end if;

  -- 클라이언트(lib/post-password.ts 의 hashPin)와 같은 방식으로 해시한다:
  -- sha256("modelnow-post-pin:" || 입력한 4자리)
  if pin is not null and stored_hash = encode(digest('modelnow-post-pin:' || pin, 'sha256'), 'hex') then
    delete from public.posts where id = post_id;
    return true;
  end if;

  return false;
end;
$$;

grant execute on function public.delete_post_with_pin(uuid, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. 사진 저장 버킷
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-photos', 'post-photos', true)
on conflict (id) do nothing;

drop policy if exists "anyone can upload post photos" on storage.objects;
create policy "anyone can upload post photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'post-photos');

-- 공개 버킷이라 읽기는 정책 없이도 공개 URL로 바로 열리지만,
-- 대시보드에서 목록을 볼 때를 위해 select 도 열어둔다.
drop policy if exists "post photos are publicly readable" on storage.objects;
create policy "post photos are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'post-photos');

-- ---------------------------------------------------------------------------
-- 4. 게시판이 비어 보이지 않도록 넣는 예시 글 4개 (사진 없음, 비밀번호 없음)
--    이미 실데이터가 있으면 중복으로 쌓이지 않도록 제목으로 존재 여부를 확인한다.
-- ---------------------------------------------------------------------------
insert into public.posts (
  created_at, category, title, body, regions, availabilities, conditions,
  contact, name, agreed_to_portrait_use, pin_hash
)
select now() - interval '2 hours', '헤어', '레이어드 펌 받아보고 싶어요',
  '어깨 아래 길이고 최근 6개월 안에 펌이나 염색을 한 적이 없어요. 결과 사진 촬영과 SNS 게시 모두 괜찮습니다. 평일 오후에 광산구 쪽으로 방문할 수 있어요.',
  array['광주 광산구', '광주 서구'],
  array['평일 오후 (12시~18시)', '평일 저녁 (18시~21시)'],
  array['어깨 아래'],
  jsonb_build_object('channels', array['instagram', 'kakao'], 'instagram', 'seo_yun.k', 'phone', '', 'kakaoUrl', 'open.kakao.com/o/sYun2f9'),
  '김서윤', true, null
where not exists (select 1 from public.posts where title = '레이어드 펌 받아보고 싶어요');

insert into public.posts (
  created_at, category, title, body, regions, availabilities, conditions,
  contact, name, agreed_to_portrait_use, pin_hash
)
select now() - interval '9 hours', '네일', '가을 컬러 젤네일 모델 지원합니다',
  '손톱 길이는 3mm 정도이고 연장은 2주 전에 제거했습니다. 손 사진 촬영 괜찮고 동구 근처면 언제든 갈 수 있어요.',
  array['광주 동구'],
  array['주말 오후 (12시~18시)', '평일 저녁 (18시~21시)'],
  array['짧은 손톱'],
  jsonb_build_object('channels', array['instagram'], 'instagram', 'haram.dy', 'phone', '', 'kakaoUrl', ''),
  '이하람', true, null
where not exists (select 1 from public.posts where title = '가을 컬러 젤네일 모델 지원합니다');

insert into public.posts (
  created_at, category, title, body, regions, availabilities, conditions,
  contact, name, agreed_to_portrait_use, pin_hash
)
select now() - interval '1 day 3 hours', '헤어', '탈색 모델 해보고 싶습니다 (2회까지 가능)',
  '작년에 한 번 탈색한 이력이 있고 지금은 많이 자란 상태예요. 두피는 예민한 편이라 상담 후 진행하고 싶습니다. 북구 쪽 주말 오전이 편해요.',
  array['광주 북구'],
  array['주말 오전 (09시~12시)'],
  array['허리 길이'],
  jsonb_build_object('channels', array['phone'], 'instagram', '', 'phone', '010-2841-7730', 'kakaoUrl', ''),
  '박지민', true, null
where not exists (select 1 from public.posts where title = '탈색 모델 해보고 싶습니다 (2회까지 가능)');

insert into public.posts (
  created_at, category, title, body, regions, availabilities, conditions,
  contact, name, agreed_to_portrait_use, pin_hash
)
select now() - interval '5 days', '네일', '프렌치 익스텐션 연습 모델 찾으시면 연락 주세요',
  '손이 작은 편이고 자연 손톱 상태는 좋습니다. 서구 근처 평일 오전 시간대에 가능해요. 제거까지 같이 부탁드릴 수 있으면 좋겠습니다.',
  array['광주 전체'],
  array['평일 오전 (09시~12시)', '주말 오전 (09시~12시)'],
  array['보통 길이', '연장 제거 완료'],
  jsonb_build_object('channels', array['phone', 'kakao'], 'instagram', '', 'phone', '010-5520-1184', 'kakaoUrl', 'open.kakao.com/o/yunaJ0'),
  '최윤아', true, null
where not exists (select 1 from public.posts where title = '프렌치 익스텐션 연습 모델 찾으시면 연락 주세요');

-- ---------------------------------------------------------------------------
-- 5. (선택) 실시간 반영 — 다른 사람이 올리거나 지운 글이 새로고침 없이 보이게 한다.
--    이미 추가돼 있으면 오류 없이 넘어간다.
-- ---------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.posts;
exception
  when duplicate_object then null;
end $$;
