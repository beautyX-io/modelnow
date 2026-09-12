"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ModelPostCard from "@/components/board/ModelPostCard";
import Chip from "@/components/ui/Chip";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import TabBar from "@/components/ui/TabBar";
import {
  bucketOf,
  matchesQuery,
  matchesRegion,
  REGIONS,
  SORTS,
  type DateBucket,
  type ModelPost,
  type Sort,
} from "@/lib/model-posts";
import { useModelPosts } from "@/lib/use-model-posts";
import type { CategoryFilter } from "@/lib/types";

const CATEGORIES: CategoryFilter[] = ["전체", "헤어", "네일"];
const BUCKET_ORDER: DateBucket[] = ["오늘", "어제", "이번 주", "이전"];

/**
 * 모델 지원 게시물이 모이는 게시판.
 * 카테고리·지역으로 걸러내고 등록순으로 정렬한 뒤 날짜 구간으로 나눠 보여준다.
 */
export default function BoardFeed() {
  const { posts, loading, error, refresh } = useModelPosts();
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [region, setRegion] = useState("전체");
  const [sort, setSort] = useState<Sort>("최신순");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 서비스 지역은 글이 아직 없어도 전부 보여준다
  const regions = useMemo(() => ["전체", ...REGIONS], []);

  const visible = useMemo(() => {
    return posts
      .filter((p) => category === "전체" || p.category === category)
      .filter((p) => matchesRegion(p, region))
      .filter((p) => matchesQuery(p, query))
      .sort((a, b) =>
        sort === "최신순" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
      );
  }, [posts, category, region, query, sort]);

  // 검색창을 열면 바로 입력할 수 있게 포커스를 옮긴다
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

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
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              aria-pressed={searchOpen}
              aria-label={searchOpen ? "검색 닫기" : "게시물 검색"}
              className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border transition-colors duration-150 ${
                searchOpen
                  ? "border-ink bg-ink text-white"
                  : "border-line-strong text-ink-soft"
              }`}
            >
              {searchOpen ? <CloseIcon width={17} height={17} /> : <SearchIcon width={17} height={17} />}
            </button>
            <Link
              href="/new"
              className="rounded-full bg-ink px-[14px] py-[8px] text-[12.5px] font-semibold text-white"
            >
              글쓰기
            </Link>
          </div>
        </div>

        {searchOpen ? (
          <div className="mt-4 flex items-center gap-[8px] rounded-full border border-line-chip bg-surface px-[14px] py-[9px]">
            <SearchIcon width={16} height={16} className="flex-none text-ink-faint" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목, 소개, 지역, 시간, 상태로 검색"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-ghost"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="검색어 지우기"
                className="flex-none text-ink-faint"
              >
                <CloseIcon width={14} height={14} />
              </button>
            ) : null}
          </div>
        ) : null}

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
            {loading ? "불러오는 중…" : `게시물 ${visible.length}개`}
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
        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : !loading && visible.length === 0 ? (
          query ? (
            <SearchEmptyState query={query} onClear={closeSearch} />
          ) : (
            <EmptyState />
          )
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

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-16 flex flex-col items-center px-6 text-center">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-2 text-[26px] text-accent-deeper">
        !
      </div>
      <p className="mt-5 text-cardtitle font-semibold">
        게시물을 불러오지 못했어요
      </p>
      <p className="mt-2 text-sub leading-[1.7] text-ink-soft">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-btn bg-ink px-7 py-[14px] text-section font-bold text-white"
      >
        다시 시도
      </button>
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

function SearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="mt-16 flex flex-col items-center px-6 text-center">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-2 text-[26px] text-ink-faint">
        <SearchIcon width={26} height={26} />
      </div>
      <p className="mt-5 text-cardtitle font-semibold">
        &ldquo;{query}&rdquo; 검색 결과가 없어요
      </p>
      <p className="mt-2 text-sub leading-[1.7] text-ink-soft">
        다른 검색어나 필터로 다시 찾아보세요.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-btn bg-ink px-7 py-[14px] text-section font-bold text-white"
      >
        검색 지우기
      </button>
    </div>
  );
}
