"use client";

import Chip from "@/components/ui/Chip";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import TabBar from "@/components/ui/TabBar";
import { POSTS } from "@/lib/mock-data";
import type { CategoryFilter, Post } from "@/lib/types";

const FILTERS: CategoryFilter[] = ["전체", "헤어", "네일"];

interface FeedScreenProps {
  filter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  onOpenPost: (postId: string) => void;
}

/** A1. 모집 피드 */
export default function FeedScreen({
  filter,
  onFilterChange,
  onOpenPost,
}: FeedScreenProps) {
  const posts = POSTS.filter((p) => filter === "전체" || p.category === filter);

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-app/90 px-5 pb-3 pt-[calc(env(safe-area-inset-top,0px)+18px)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="text-title">MODELNOW</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line-strong text-[12px] font-medium text-ink-soft"
            >
              광주
            </button>
            <button
              type="button"
              aria-label="내 프로필"
              className="h-[34px] w-[34px] rounded-full bg-accent-tint"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-[7px]">
          {FILTERS.map((f) => (
            <Chip
              key={f}
              label={f}
              selected={filter === f}
              onSelect={() => onFilterChange(f)}
            />
          ))}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-[14px] px-5 pb-[130px] pt-[6px]">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onOpen={() => onOpenPost(post.id)} />
        ))}
      </div>

      <TabBar />
    </div>
  );
}

function PostCard({ post, onOpen }: { post: Post; onOpen: () => void }) {
  const { designer } = post;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="cursor-pointer overflow-hidden rounded-card border border-line bg-card text-left shadow-lift"
    >
      <PhotoPlaceholder
        label={post.heroLabel}
        labelPill
        step={9}
        className="h-[168px] justify-between p-3"
      >
        <span className="rounded-md bg-ink px-[9px] py-[5px] text-[11px] font-semibold text-white">
          {post.category}
        </span>
      </PhotoPlaceholder>

      <div className="px-[15px] pb-[15px] pt-[14px]">
        <div className="text-cardtitle font-semibold">{post.title}</div>
        <div className="mt-[6px] text-meta text-ink-soft">
          {designer.name} 디자이너 · {designer.salon} {designer.area}
        </div>
        <div className="mt-[11px] flex flex-wrap gap-[6px]">
          <span className="rounded-md bg-accent-soft px-[9px] py-[5px] text-note font-medium text-accent-deep">
            {post.reward}
          </span>
          <span className="rounded-md bg-surface-2 px-[9px] py-[5px] text-note font-medium text-ink-muted">
            {post.duration}
          </span>
          <span className="rounded-md bg-surface-2 px-[9px] py-[5px] text-note font-medium text-ink-muted">
            {post.dateRange}
          </span>
        </div>
      </div>
    </button>
  );
}
