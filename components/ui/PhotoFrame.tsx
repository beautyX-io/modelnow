import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

interface PhotoFrameProps {
  /** 업로드된 이미지. 없으면 줄무늬 자리표시자가 대신 들어간다 */
  src: string | null;
  /** 우측 상단에 얹는 사진 주제 (예: 희망 스타일) */
  badge: string;
  className?: string;
  /** 히어로·메인컷처럼 큰 사진 */
  large?: boolean;
  /** 작은 썸네일용 — 배지를 더 줄인다 */
  compact?: boolean;
}

/**
 * 사진 한 장 + 주제 배지.
 * 어떤 사진이 지금 상태이고 어떤 사진이 희망 스타일인지 사진 위에서 바로 구분된다.
 */
export default function PhotoFrame({
  src,
  badge,
  className = "",
  large = false,
  compact = false,
}: PhotoFrameProps) {
  const chip = (
    <span
      className={`pointer-events-none absolute rounded-md bg-ink/45 font-medium text-white/95 backdrop-blur-[2px] ${
        compact
          ? "right-[4px] top-[4px] px-[5px] py-[2px] text-[9px]"
          : "right-2 top-2 px-[7px] py-[3px] text-[10px]"
      }`}
    >
      {badge}
    </span>
  );

  if (src) {
    return (
      <div
        className={`relative bg-surface-3 bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={badge}
      >
        {chip}
      </div>
    );
  }

  return (
    <PhotoPlaceholder large={large} className={className}>
      {chip}
    </PhotoPlaceholder>
  );
}
