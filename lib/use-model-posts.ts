"use client";

import { useCallback, useEffect, useState } from "react";
import { listPosts, type ModelPost } from "./model-posts";
import { supabase } from "./supabase/client";

export interface ModelPostsState {
  posts: ModelPost[];
  /** 처음 불러오는 중인지. 새로고침(refresh)은 이미 있던 목록을 유지한 채 조용히 일어난다 */
  loading: boolean;
  /** Supabase 연결이 안 됐거나 쿼리가 실패했을 때의 메시지 */
  error: string | null;
  /** 글을 올리거나 지운 직후 목록을 다시 받아온다 */
  refresh: () => void;
}

const LOAD_ERROR = "게시물을 불러오지 못했어요.";

/**
 * 게시판 목록. Supabase 에서 읽어오고, 다른 사람이 올리거나 지운 글도
 * Realtime 구독으로 바로 반영한다(스키마의 `alter publication` 부분).
 * 그 구독이 아직 안 됐거나 끊겨도 화면은 그대로 쓸 수 있게, 직접
 * 올리거나 지운 뒤에는 `refresh()` 로 한 번 더 확인한다.
 *
 * loading 은 처음 값(true)만 쓰고 이후로는 다시 켜지 않는다 — 새로고침이
 * 화면을 깜빡이며 다시 로딩 상태로 보이지 않게 하려는 것이다.
 */
export function useModelPosts(): ModelPostsState {
  const [posts, setPosts] = useState<ModelPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 목록을 다시 받아온다. 결과 반영은 .then/.catch 콜백 안에서만 한다 —
  // effect 본문이 직접 setState 를 부르지 않게 하기 위해서다.
  const refresh = useCallback(() => {
    listPosts().then(
      (next) => {
        setPosts(next);
        setError(null);
        setLoading(false);
      },
      (e: unknown) => {
        setError(e instanceof Error ? e.message : LOAD_ERROR);
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    let ignore = false;
    listPosts().then(
      (next) => {
        if (ignore) return;
        setPosts(next);
        setError(null);
        setLoading(false);
      },
      (e: unknown) => {
        if (ignore) return;
        setError(e instanceof Error ? e.message : LOAD_ERROR);
        setLoading(false);
      },
    );
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("posts-board")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { posts, loading, error, refresh };
}
