"use client";

import InstagramCard from "@/components/connect/InstagramCard";
import KakaoOpenChatCard from "@/components/connect/KakaoOpenChatCard";
import BottomBar from "@/components/ui/BottomBar";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { REQUIREMENTS } from "@/lib/mock-data";
import type { Post } from "@/lib/types";
import { openChatUrl } from "@/lib/validation";

interface PostDetailScreenProps {
  post: Post;
  onBack: () => void;
  onApply: () => void;
}

/** A2. 모집 상세 */
export default function PostDetailScreen({
  post,
  onBack,
  onApply,
}: PostDetailScreenProps) {
  const { designer } = post;
  const specs = [
    { k: "보상", v: post.reward },
    { k: "소요 시간", v: post.duration },
    { k: "가능 일정", v: post.dateRange },
    { k: "위치", v: designer.area },
  ];

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <PhotoPlaceholder
        label="디자이너 포트폴리오 대표컷"
        labelPill
        large
        className="h-[260px] flex-none p-4"
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로"
          className="absolute left-4 top-[calc(env(safe-area-inset-top,0px)+14px)] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[17px] font-medium"
        >
          ←
        </button>
      </PhotoPlaceholder>

      <div className="-mt-[22px] flex-1 px-5 pb-[140px]">
        <section className="rounded-card border border-line bg-card p-[18px] shadow-lift">
          <h1 className="text-detail font-semibold">{post.title}</h1>

          <div className="mt-[14px] flex items-center gap-[10px]">
            <PhotoPlaceholder step={5} className="h-10 w-10 rounded-full" />
            <div>
              <div className="text-section font-semibold">
                {designer.name} 디자이너
              </div>
              <div className="text-note text-ink-soft">
                {designer.salon} · {designer.area}
              </div>
            </div>
          </div>

          <dl className="mt-[18px] grid grid-cols-2 gap-[10px]">
            {specs.map((s) => (
              <div key={s.k} className="rounded-slot bg-surface px-3 py-[11px]">
                <dt className="text-[11px] font-medium text-ink-faint">{s.k}</dt>
                <dd className="mt-[3px] text-section font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <h2 className="mt-[22px] text-section font-semibold">모델 조건</h2>
        <ul className="mt-[10px] flex flex-col gap-[9px]">
          {REQUIREMENTS[post.category].map((req) => (
            <li key={req} className="flex items-start gap-[9px]">
              <span className="mt-[7px] h-[6px] w-[6px] flex-none rounded-full bg-accent-deep" />
              <span className="text-body text-ink-body">{req}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-[22px] text-section font-semibold">포트폴리오</h2>
        <div className="mt-[10px] grid grid-cols-3 gap-2">
          {designer.portfolio.map((label) => (
            <PhotoPlaceholder
              key={label}
              label={label}
              labelClassName="text-[9px]"
              step={7}
              className="aspect-3/4 rounded-slot p-[7px]"
            />
          ))}
        </div>

        <h2 className="mt-[22px] text-section font-semibold">연결</h2>
        <div className="mt-[10px] flex flex-col gap-[9px]">
          <InstagramCard account={designer.instagram} variant="link" />
          <KakaoOpenChatCard
            url={openChatUrl(designer.kakao.slug)}
            roomType={designer.kakao.roomType}
            variant="link"
          />
        </div>
      </div>

      <BottomBar>
        <div className="flex gap-[10px]">
          <button
            type="button"
            aria-label="찜하기"
            className="flex h-[54px] w-[52px] flex-none cursor-pointer items-center justify-center rounded-btn border border-line-strong text-[18px] text-ink-soft"
          >
            ♡
          </button>
          <button
            type="button"
            onClick={onApply}
            className="h-[54px] flex-1 cursor-pointer rounded-btn bg-accent text-cardtitle font-bold text-accent-ink"
          >
            지원하기
          </button>
        </div>
      </BottomBar>
    </div>
  );
}
