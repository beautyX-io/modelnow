import type { CSSProperties, ReactNode } from "react";

interface PhotoPlaceholderProps {
  /** 모노스페이스 라벨. 실제 이미지로 교체되면 사라진다 */
  label?: string;
  /** 라벨을 흰 알약 배경 위에 올릴지 여부 */
  labelPill?: boolean;
  /** 라벨 크기 조정 등 */
  labelClassName?: string;
  /** 히어로·메인컷처럼 큰 이미지는 진한 줄무늬 */
  large?: boolean;
  /** 줄 간격 (px) */
  step?: number;
  className?: string;
  style?: CSSProperties;
  /** 상태 배지 등 오버레이 */
  children?: ReactNode;
}

/**
 * 사진 자리표시자. 실제 업로드 이미지가 붙기 전까지 쓰는 줄무늬 면이다.
 * 이미지 연동 시 이 컴포넌트를 next/image 로 교체한다.
 */
export default function PhotoPlaceholder({
  label,
  labelPill = false,
  labelClassName = "",
  large = false,
  step,
  className = "",
  style,
  children,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`stripe relative flex items-end ${large ? "stripe-lg" : ""} ${className}`}
      style={
        step ? ({ "--stripe-step": `${step}px`, ...style } as CSSProperties) : style
      }
    >
      {label ? (
        <span
          className={`font-mono text-[10px] font-medium ${
            labelPill
              ? "rounded-[5px] bg-white/85 px-[7px] py-[4px] text-ink-soft"
              : "text-ink-soft"
          } ${labelClassName}`}
        >
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
