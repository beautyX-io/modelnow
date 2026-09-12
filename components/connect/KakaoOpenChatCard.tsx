"use client";

import { isValidOpenChatLink } from "@/lib/validation";

interface KakaoOpenChatCardProps {
  /** "open.kakao.com/o/xxx" 형태의 링크 */
  url: string;
  /**
   * link — 모집 상세 · 지원자 상세의 한 줄 카드
   * form — 지원서 3단계의 링크 입력 카드 (도메인 검증 배지)
   */
  variant?: "link" | "form";
  title?: string;
  actionLabel?: string;
  roomType?: string;
  editable?: boolean;
  onUrlChange?: (url: string) => void;
}

/**
 * 카카오톡 오픈채팅 링크 임베드. 모집 상세 · 지원서 · 지원자 상세 공용.
 * 링크는 open.kakao.com 도메인만 통과시킨다.
 */
export default function KakaoOpenChatCard({
  url,
  variant = "link",
  title = "카카오톡 오픈채팅",
  actionLabel = "참여",
  roomType = "1:1 채팅방",
  editable = false,
  onUrlChange,
}: KakaoOpenChatCardProps) {
  const verified = isValidOpenChatLink(url);

  if (variant === "form") {
    return (
      <div className="rounded-panel border border-line bg-card p-[15px]">
        <div className="text-caption font-medium text-ink-faint">
          카카오톡 오픈채팅 링크
        </div>
        {editable ? (
          <input
            value={url}
            onChange={(e) => onUrlChange?.(e.target.value)}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="카카오톡 오픈채팅 링크"
            placeholder="open.kakao.com/o/..."
            className="mt-[6px] w-full bg-transparent text-section font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-ghost"
          />
        ) : (
          <div className="mt-[6px] break-all text-section font-semibold">{url}</div>
        )}
        <div
          className={`mt-[10px] inline-flex items-center gap-[6px] rounded-lg px-[10px] py-[6px] text-caption font-medium ${
            verified ? "bg-kakao-tint text-kakao-ink" : "bg-surface-2 text-ink-faint"
          }`}
        >
          {verified
            ? `링크 확인됨 · ${roomType}`
            : "open.kakao.com 링크를 입력해 주세요"}
        </div>
      </div>
    );
  }

  return (
    <a
      href={`https://${url.replace(/^https?:\/\//, "")}`}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-3 rounded-btn border border-line bg-card p-[14px]"
    >
      <div className="h-[34px] w-[34px] flex-none rounded-[10px] bg-kakao" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sub font-semibold">{title}</div>
        <div className="truncate text-caption text-ink-faint">{url}</div>
      </div>
      <div className="flex-none text-note font-semibold text-accent-deep">
        {actionLabel}
      </div>
    </a>
  );
}
