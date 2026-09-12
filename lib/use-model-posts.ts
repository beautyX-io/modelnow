"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  type ModelPost,
} from "./model-posts";

/** 저장된 게시물 목록. 새 글이 올라오거나 지워지면 다시 렌더된다. */
export function useModelPosts(): ModelPost[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/**
 * 하이드레이션이 끝났는지. 저장소는 브라우저에만 있어서
 * 서버 렌더 결과(빈 목록)를 "글이 없음"으로 오해하지 않으려고 쓴다.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
