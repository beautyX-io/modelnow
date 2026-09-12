"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ModelPostCard from "@/components/board/ModelPostCard";
import Chip from "@/components/ui/Chip";
import TabBar from "@/components/ui/TabBar";
import {
  bucketOf,
  SORTS,
  type DateBucket,
  type ModelPost,
  type Sort,
} from "@/lib/model-posts";
import { useHydrated, useModelPosts } from "@/lib/use-model-posts";
import type { CategoryFilter } from "@/lib/types";

const CATEGORIES: CategoryFilter[] = ["전체", "헤어", "네일"];
const BUCKET_ORDER: DateBucket[] = ["오늘", "어제", "이번 주", "이전"];

/**
 * 모델 지원 게시물이 모이는 게시판.
 * 카테고리·지역으로 걸러내고 등록순으로 정렬한 뒤 날짜 구간으로 나눠 보여준다.
 */
export default function BoardFeed() {
  const posts = useModelPosts();
  const hydrated = useHydrated();
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [region, setRegion] = useState("전체");
  const [sort, setSort] = useState<Sort>("최신순");

  const regions = useMemo(
    () => ["전체", ...Array.from(new Set(posts.map((p) => p.region)))],
    [posts],
  );

  const visible = useMemo(() => {
    return posts
      .filter((p) => category === "전체" || p.category === category)
      .filter((p) => region === "전체" || p.region === region)
      .sort((a, b) =>
        sort === "최신순" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
      );
  }, [posts, category, region, sort]);

  const groups = useMemo(() => {
    const map = new Map<DateBucket, ModelPost[]>();
    for (const post of visible) {
      const bucket = bucketOf(post.createdAt);
      const list = map.get(bucket);
      if (list) list.push(post);
      else map.set(bucket, [post]);
    }
    const order =
      sort === "최신순" ? BUCKET_ORDER : [...BUCKET_ORDER].reverse();
    return order
      .filter((bucket) => map.has(bucket))
      .map((bucket) => ({ bucket, items: map.get(bucket) ?? [] }));
  }, [visible, sort]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-app/90 px-5 pb-3 pt-[calc(env(safe-area-inset-top,0px)+18px)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="text-title">MODELNOW</div>
          <Link
            href="/new"
            className="rounded-full bg-ink px-[14px] py-[8px] text-[12.5px] font-semibold text-white"
          >
            글쓰기
          </Link>
        </div>

        <div className="mt-4 flex gap-[7px]">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={category === c}
              onSelect={() => setCategory(c)}
            />
          ))}
        </div>

        {regions.length > 1 ? (
          <div className="no-scrollbar -mx-5 mt-[9px] flex gap-[2px] overflow-x-auto px-5">
            {regions.map((r) => (
              <div key={r} className="flex-none">
                <Chip
                  label={r}
                  size="quiet"
                  selected={region === r}
                  onSelect={() => setRegion(r)}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-[14px] flex items-center justify-between">
          <div className="text-[12px] text-ink-faint">
            {hydrated ? `게시물 ${visible.length}개` : "불러오는 중…"}
          </div>
          <div className="flex items-center gap-[10px]">
            {SORTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`text-[12px] ${
                  sort === s
                    ? "font-semibold text-ink"
                    : "font-medium text-ink-disabled"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 pb-[130px] pt-1">
        {hydrated && visible.length === 0 ? (
          <EmptyState />
        ) : (
          groups.map(({ bucket, items }) => (
            <section key={bucket} className="mt-4 first:mt-2">
              <h2 className="mb-[10px] flex items-center gap-[8px] text-[12px] font-semibold text-ink-faint">
                {bucket}
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-[11px] font-normal">
                  {items.length}
                </span>
              </h2>
              <div className="flex flex-col gap-[10px]">
                {items.map((post) => (
                  <ModelPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <TabBar />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 flex flex-col items-center px-6 text-center">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-accent-tint text-[26px] text-accent-deep">
        ✎
      </div>
      <p className="mt-5 text-cardtitle font-semibold">아직 올라온 글이 없어요</p>
      <p className="mt-2 text-sub leading-[1.7] text-ink-soft">
        사진 3장과 소개를 올리면 디자이너가 보고 연락합니다.
      </p>
      <Link
        href="/new"
        className="mt-6 rounded-btn bg-accent px-7 py-[14px] text-section font-bold text-accent-ink"
      >
        첫 글 올리기
      </Link>
    </div>
  );
}
