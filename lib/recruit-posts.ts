import { CURRENT_DESIGNER, POSTS as SEED_POSTS } from "./mock-data";
import type { Category, Post } from "./types";

/**
 * 구인 공고 저장소. `/recruit` `/designer` 는 아직 Supabase 로 옮기지 않은
 * 목데이터 플로우라서, 여기서는 탭을 유지하는 동안만 살아있는(새로고침하면
 * 사라지는) 세션 메모리 저장소를 쓴다 — 모델 지원 게시판(lib/model-posts.ts)의
 * 진짜 저장소와는 별개다.
 */

let posts: Post[] = [...SEED_POSTS];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getRecruitPosts(): Post[] {
  return posts;
}

export function subscribeRecruitPosts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export interface NewRecruitPost {
  category: Category;
  title: string;
  reward: string;
  duration: string;
  dateRange: string;
}

/** 디자이너가 새 모집 공고를 올린다. 현재 로그인된 CURRENT_DESIGNER 이름으로 등록된다. */
export function addRecruitPost(input: NewRecruitPost): Post {
  const post: Post = {
    ...input,
    id: `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    heroLabel:
      input.category === "네일" ? "손등 결과컷 · 3:4" : "모델 결과컷 · 3:4",
    designer: CURRENT_DESIGNER,
  };
  posts = [post, ...posts];
  emit();
  return post;
}
