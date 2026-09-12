"use client";

import { useRef, useState } from "react";
import { fileToDataUrl } from "@/lib/image";
import type { PhotoSlotDef, PhotoValue } from "@/lib/types";

interface PhotoSlotProps {
  def: PhotoSlotDef;
  value: PhotoValue;
  onChange: (dataUrl: string) => void;
}

/**
 * 사진 슬롯 한 칸. 탭하면 사진을 고르고, 다시 탭하면 교체한다.
 * 고른 이미지는 EXIF 보정 + 장변 1280px 리사이즈를 거쳐 들어온다.
 */
export default function PhotoSlot({ def, value, onChange }: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const filled = Boolean(value);
  // 66px 썸네일에 들어가도록 "메인 · 정면 얼굴" 같은 긴 배지는 앞부분만 쓴다
  const shortBadge = def.badge.split(" · ")[0];

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change 가 걸리도록 값을 비운다
    event.target.value = "";
    if (!file) return;

    setError("");
    setBusy(true);
    try {
      onChange(await fileToDataUrl(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "사진을 올리지 못했어요.");
    } finally {
      setBusy(false);
    }
  }

  const state = busy
    ? "불러오는 중…"
    : filled
      ? "첨부됨 · 탭하면 교체"
      : "탭해서 사진 첨부";

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full cursor-pointer items-center gap-[13px] rounded-panel border bg-card p-[13px] text-left transition-colors duration-150 ${
          filled ? "border-solid border-line" : "border-dashed border-line-dash"
        }`}
      >
        <div
          className="relative flex flex-none items-center justify-center rounded-slot bg-surface-3 bg-cover bg-center bg-no-repeat text-[20px] font-medium text-slot-mark"
          style={{
            width: def.thumbSize,
            height: def.thumbSize,
            backgroundImage: value ? `url(${value})` : undefined,
          }}
        >
          {filled ? (
            <span className="pointer-events-none absolute right-[4px] top-[4px] rounded bg-ink/45 px-[4px] py-[2px] text-[9px] font-medium text-white/95 backdrop-blur-[2px]">
              {shortBadge}
            </span>
          ) : (
            "+"
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-section font-semibold">{def.title}</div>
          <div className="mt-[3px] text-note text-ink-faint">{def.hint}</div>
          <div
            className={`mt-[6px] font-mono text-[11px] font-medium ${
              filled ? "text-accent-deep" : "text-ink-idle"
            }`}
          >
            {state}
          </div>
          {error ? (
            <div className="mt-1 text-[11px] font-medium text-accent-deeper">
              {error}
            </div>
          ) : null}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
        aria-label={def.title}
      />
    </>
  );
}
