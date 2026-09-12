import type { ReactNode } from "react";

interface ScreenHeaderProps {
  title: ReactNode;
  onBack: () => void;
  backLabel?: string;
  trailing?: ReactNode;
  children?: ReactNode;
}

/** 뒤로가기 원형 버튼 + 타이틀 + 우측 보조 영역 (지원서 / 지원자 상세 공용) */
export default function ScreenHeader({
  title,
  onBack,
  backLabel = "뒤로",
  trailing,
  children,
}: ScreenHeaderProps) {
  return (
    <header className="flex-none px-5 pb-3 pt-[calc(env(safe-area-inset-top,0px)+18px)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="flex h-[34px] w-[34px] flex-none cursor-pointer items-center justify-center rounded-full border border-line-strong text-[16px] font-medium"
        >
          ←
        </button>
        <div className="min-w-0 flex-1 truncate text-[15px] font-semibold">
          {title}
        </div>
        {trailing}
      </div>
      {children}
    </header>
  );
}
