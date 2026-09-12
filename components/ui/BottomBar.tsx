import type { ReactNode } from "react";

/**
 * 하단 고정 액션 바. 셸(max-width 480px) 폭에 맞춰 가운데 고정된다.
 * 그림자 없이 상단 보더 + 블러로 본문과 구분한다.
 */
export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="bottom-blur fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[480px] border-t border-line px-5 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-[14px]">
      {children}
    </div>
  );
}
