"use client";

import InstagramCard from "@/components/connect/InstagramCard";
import KakaoOpenChatCard from "@/components/connect/KakaoOpenChatCard";
import BottomBar from "@/components/ui/BottomBar";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import ScreenHeader from "@/components/ui/ScreenHeader";
import type { Applicant } from "@/lib/types";
import { openChatUrl } from "@/lib/validation";

interface ApplicantDetailScreenProps {
  applicant: Applicant;
  /** 목록에서 몇 번째인지 (1부터) */
  position: number;
  total: number;
  accepted: boolean;
  onBack: () => void;
  onHold: () => void;
  onAccept: () => void;
}

/** B2. 지원자 상세 — 사진 3장 비교 + 조건 + 연결 수단 */
export default function ApplicantDetailScreen({
  applicant,
  position,
  total,
  accepted,
  onBack,
  onHold,
  onAccept,
}: ApplicantDetailScreenProps) {
  const specs = [
    { k: "나이", v: String(applicant.age) },
    { k: "현재 상태", v: `${applicant.length} · ${applicant.history}` },
    { k: "가능 시간", v: applicant.availability },
    { k: "지역", v: applicant.area },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader
        title={applicant.name}
        onBack={onBack}
        trailing={
          <div className="flex-none text-[12px] font-medium text-ink-faint">
            {position}/{total}
          </div>
        }
      />

      <div className="flex-1 px-5 pb-[140px] pt-2">
        <PhotoPlaceholder
          label={applicant.photoLabels.main}
          labelPill
          large
          className="aspect-4/5 rounded-panel-lg p-3"
        />

        <div className="mt-[10px] grid grid-cols-2 gap-[10px]">
          {[applicant.photoLabels.current, applicant.photoLabels.desired].map(
            (label) => (
              <PhotoPlaceholder
                key={label}
                label={label}
                labelPill
                labelClassName="text-[9.5px]"
                className="aspect-square rounded-slot-lg p-2"
              />
            ),
          )}
        </div>

        <section className="mt-5 rounded-panel-lg border border-line bg-card p-[17px] shadow-lift">
          <dl className="grid grid-cols-2 gap-[14px]">
            {specs.map((s) => (
              <div key={s.k}>
                <dt className="text-[11px] font-medium text-ink-faint">{s.k}</dt>
                <dd className="mt-[3px] text-section font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-[14px] border-t border-hairline pt-[13px] text-sub leading-[1.65] text-ink-body">
            {applicant.note}
          </p>
        </section>

        <div className="mt-[18px] flex flex-col gap-[9px]">
          <InstagramCard account={applicant.instagram} variant="thumbs" />
          <KakaoOpenChatCard
            url={openChatUrl(applicant.kakao.slug)}
            roomType={applicant.kakao.roomType}
            title="오픈채팅으로 대화"
            actionLabel="열기"
          />
        </div>
      </div>

      <BottomBar>
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={onHold}
            className="h-[54px] flex-1 cursor-pointer rounded-btn border border-line-strong text-[15px] font-semibold text-ink-muted"
          >
            보류
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="h-[54px] flex-[1.4] cursor-pointer rounded-btn bg-accent text-[15px] font-bold text-accent-ink"
          >
            {accepted ? "수락됨 · 채팅 열기" : "수락하고 연락하기"}
          </button>
        </div>
      </BottomBar>
    </div>
  );
}
