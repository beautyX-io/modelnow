"use client";

import type { Post } from "@/lib/types";

interface DoneScreenProps {
  post: Post;
  onBackToFeed: () => void;
}

/** A4. 제출 완료 */
export default function DoneScreen({ post, onBackToFeed }: DoneScreenProps) {
  return (
    <div className="screen-enter flex flex-1 flex-col items-center justify-center px-[34px] text-center">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-accent-tint text-[28px] text-accent-deep">
        ✓
      </div>
      <h1 className="mt-[22px] text-hero">지원서를 보냈어요</h1>
      <p className="mt-[10px] text-body leading-[1.7] text-ink-soft">
        {post.designer.name} 디자이너가 확인하면 알림이 옵니다. 보통 하루 안에 답이
        와요.
      </p>
      <button
        type="button"
        onClick={onBackToFeed}
        className="mt-7 cursor-pointer rounded-btn bg-ink px-7 py-[15px] text-section font-semibold text-white"
      >
        다른 모집 보기
      </button>
    </div>
  );
}
