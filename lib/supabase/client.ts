import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Supabase 환경변수가 없어요. .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY 를 넣어주세요.",
  );
}

/**
 * 브라우저에서 쓰는 Supabase 클라이언트.
 * 로그인이 없는 사이트라 익명(anon) 키만 쓰고, 세션 저장도 하지 않는다.
 */
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

/** 게시물 사진이 올라가는 공개 버킷 이름. supabase/schema.sql 에서 함께 만든다. */
export const POST_PHOTO_BUCKET = "post-photos";
