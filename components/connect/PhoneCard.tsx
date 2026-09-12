"use client";

import { digitsOnly, formatPhone, isValidPhone } from "@/lib/contact";

interface PhoneCardProps {
  phone: string;
  /**
   * link — 게시물에서 보여주는 한 줄 카드 (문자 · 전화)
   * form — 글쓰기의 번호 입력 카드
   */
  variant?: "link" | "form";
  onPhoneChange?: (phone: string) => void;
}

/** 문자·전화 연락처. 번호는 입력하는 동안 010-1234-5678 꼴로 다듬어진다. */
export default function PhoneCard({
  phone,
  variant = "link",
  onPhoneChange,
}: PhoneCardProps) {
  const valid = isValidPhone(phone);

  if (variant === "form") {
    return (
      <div className="rounded-panel border border-line bg-card p-[15px]">
        <div className="text-caption font-medium text-ink-faint">
          휴대폰 번호
        </div>
        <input
          value={phone}
          onChange={(e) => onPhoneChange?.(formatPhone(e.target.value))}
          inputMode="numeric"
          autoComplete="tel"
          aria-label="휴대폰 번호"
          placeholder="010-1234-5678"
          className="mt-[6px] w-full bg-transparent text-section font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-ghost"
        />
        <div
          className={`mt-[10px] inline-flex items-center gap-[6px] rounded-lg px-[10px] py-[6px] text-caption font-medium ${
            valid ? "bg-accent-soft text-accent-deep" : "bg-surface-2 text-ink-faint"
          }`}
        >
          {valid ? "번호 확인됨 · 문자와 전화 모두 가능" : "휴대폰 번호를 입력해 주세요"}
        </div>
      </div>
    );
  }

  const digits = digitsOnly(phone);

  return (
    <div className="flex items-center gap-3 rounded-btn border border-line bg-card p-[14px]">
      <div className="h-[34px] w-[34px] flex-none rounded-[10px] bg-surface-2" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sub font-semibold">문자 · 전화</div>
        <div className="truncate text-caption text-ink-faint">
          {formatPhone(phone)}
        </div>
      </div>
      <div className="flex flex-none items-center gap-[14px]">
        <a
          href={`sms:${digits}`}
          className="text-note font-semibold text-accent-deep"
        >
          문자
        </a>
        <a
          href={`tel:${digits}`}
          className="text-note font-semibold text-accent-deep"
        >
          전화
        </a>
      </div>
    </div>
  );
}
