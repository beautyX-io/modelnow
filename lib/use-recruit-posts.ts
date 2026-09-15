"use client";

import { useSyncExternalStore } from "react";
import { getRecruitPosts, subscribeRecruitPosts } from "./recruit-posts";
import type { Post } from "./types";

/** 구인 공고 목록. 디자이너가 새로 올리면 바로 반영된다(같은 탭 안에서만). */
export function useRecruitPosts(): Post[] {
  return useSyncExternalStore(subscribeRecruitPosts, getRecruitPosts, getRecruitPosts);
}
