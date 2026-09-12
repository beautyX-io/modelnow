"use client";

import InstagramCard from "@/components/connect/InstagramCard";
import KakaoOpenChatCard from "@/components/connect/KakaoOpenChatCard";
import { CURRENT_USER } from "@/lib/mock-data";
import type { Conditions, Post } from "@/lib/types";

interface StepConnectProps {
  post: Post;
  conditions: Conditions;
  instagramHandle: string;
  onInstagramHandleChange: (handle: string) => void;
  kakaoUrl: string;
  onKakaoUrlChange: (url: string) => void;
}

/** A3 · 3단계. 연결 · 확인 (인스타 임베드 + 오픈채팅 링크 + 제출 전 요약) */
export default function StepConnect({
  post,
  conditions,
  instagramHandle,
  onInstagramHandleChange,
  kakaoUrl,
  onKakaoUrlChange,
}: StepConnectProps) {
  const summary = [
    { k: "지원 모집", v: post.title },
    { k: "사진", v: "메인 1장 · 추가 2장" },
    { k: "현재 상태", v: conditions.length ?? "선택 안 함" },
    { k: "가능 시간", v: conditions.availability ?? "선택 안 함" },
  ];

  return (
    <div className="screen-enter">
      <h2 className="text-section font-semibold">연락받을 방법</h2>
      <div className="mt-3 flex flex-col gap-[10px]">
        <InstagramCard
          account={{
            ...CURRENT_USER.instagram,
            handle: instagramHandle,
          }}
          variant="embed"
          editable
          onHandleChange={onInstagramHandleChange}
        />
        <KakaoOpenChatCard
          url={kakaoUrl}
          variant="form"
          editable
          onUrlChange={onKakaoUrlChange}
          roomType={CURRENT_USER.kakao.roomType}
        />
      </div>

      <section className="mt-[22px] rounded-panel border border-line bg-card p-[17px]">
        <h2 className="text-section font-semibold">보내기 전 확인</h2>
        <dl className="mt-3 flex flex-col gap-[9px]">
          {summary.map((row) => (
            <div key={row.k} className="flex justify-between gap-3 text-meta">
              <dt className="flex-none text-ink-faint">{row.k}</dt>
              <dd className="text-right font-semibold">{row.v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
