"use client";

type ChipSize = "filter" | "compact" | "option" | "quiet";

const SIZE_CLASS: Record<ChipSize, string> = {
  // 피드 상단 카테고리 필터
  filter: "px-[15px] py-[7px] text-[13px] font-semibold",
  // 디자이너 목록 상태 필터
  compact: "px-[14px] py-[7px] text-[12.5px] font-semibold",
  // 지원서 2단계 조건 선택
  option: "px-[14px] py-[9px] text-[13px] font-medium",
  // 보조 필터 — 위 칩 줄과 무게가 겹치지 않게 테두리를 뺀다
  quiet: "px-[12px] py-[6px] text-[12.5px] font-medium",
};

interface ChipProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  size?: ChipSize;
}

/**
 * 선택 여부만으로 스타일이 결정되는 칩.
 * 필터 칩과 조건 칩이 같은 규칙을 공유한다.
 */
export default function Chip({
  label,
  selected,
  onSelect,
  size = "filter",
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`cursor-pointer rounded-full transition-colors duration-150 ${
        SIZE_CLASS[size]
      } ${
        size === "quiet"
          ? selected
            ? "bg-surface-2 font-semibold text-ink"
            : "bg-transparent text-ink-faint"
          : selected
            ? "border border-ink bg-ink text-white"
            : "border border-line-chip bg-transparent text-ink-chip"
      }`}
    >
      {label}
    </button>
  );
}
