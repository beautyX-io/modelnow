"use client";

import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import type { InstagramAccount } from "@/lib/types";

type Variant = "link" | "embed" | "thumbs";

interface InstagramCardProps {
  account: InstagramAccount;
  /**
   * link   — 모집 상세의 한 줄 카드 (게시물 수 + "열기")
   * embed  — 지원서 3단계의 입력 카드 (핸들 + 최근 게시물 3장 임베드)
   * thumbs — 지원자 상세의 한 줄 카드 (오른쪽에 26px 썸네일 3장)
   */
  variant?: Variant;
  /** embed 변형에서 핸들을 직접 입력받을 때 */
  editable?: boolean;
  onHandleChange?: (handle: string) => void;
}

/**
 * 인스타그램 계정 임베드. 모집 상세 · 지원서 · 지원자 상세에서 같은 컴포넌트를 쓴다.
 * 실서비스에서는 썸네일을 oEmbed 결과로 채우고, 실패 시 스크린샷으로 대체한다.
 */
export default function InstagramCard({
  account,
  variant = "link",
  editable = false,
  onHandleChange,
}: InstagramCardProps) {
  const profileUrl = `https://instagram.com/${account.handle}`;

  if (variant === "embed") {
    return (
      <div className="rounded-panel border border-line bg-card p-[15px]">
        <div className="text-caption font-medium text-ink-faint">인스타그램</div>
        <div className="mt-[6px] flex items-center gap-[6px]">
          <span className="text-[15px] font-semibold text-ink-ghost">@</span>
          {editable ? (
            <input
              value={account.handle}
              onChange={(e) => onHandleChange?.(e.target.value)}
              inputMode="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-label="인스타그램 핸들"
              placeholder="instagram_id"
              className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-ghost"
            />
          ) : (
            <span className="text-[15px] font-semibold">{account.handle}</span>
          )}
        </div>

        <div className="mt-3 flex gap-[6px] border-t border-hairline pt-3">
          {account.recentPosts.map((label) => (
            <PhotoPlaceholder
              key={label}
              step={6}
              className="aspect-square flex-1 rounded-[9px]"
            />
          ))}
        </div>
        <div className="mt-[9px] font-mono text-[11px] font-medium text-ink-faint">
          미리보기 · 최근 게시물 3장 자동 임베드
        </div>
      </div>
    );
  }

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-3 rounded-btn border border-line bg-card p-[14px]"
    >
      <div className="h-[34px] w-[34px] flex-none rounded-[10px] bg-accent-tint" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sub font-semibold">@{account.handle}</div>
        <div className="text-caption text-ink-faint">
          {variant === "thumbs"
            ? "최근 게시물 3장 보기"
            : `인스타그램 · 게시물 ${account.postCount}`}
        </div>
      </div>
      {variant === "thumbs" ? (
        <div className="flex flex-none gap-1">
          {account.recentPosts.map((label) => (
            <PhotoPlaceholder
              key={label}
              step={5}
              className="h-[26px] w-[26px] rounded-md"
            />
          ))}
        </div>
      ) : (
        <div className="flex-none text-note font-semibold text-accent-deep">열기</div>
      )}
    </a>
  );
}
