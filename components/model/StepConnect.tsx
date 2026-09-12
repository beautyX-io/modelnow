"use client";

import ContactMethodPicker from "@/components/connect/ContactMethodPicker";
import { CONTACT_CHANNELS, readyChannels, type ContactInfo } from "@/lib/contact";
import { shortAvailability } from "@/lib/model-posts";
import type { Conditions, Post } from "@/lib/types";

interface StepConnectProps {
  post: Post;
  conditions: Conditions;
  contact: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
}

/** A3 · 3단계. 연결 · 확인 (연락 방법 선택 + 제출 전 요약) */
export default function StepConnect({
  post,
  conditions,
  contact,
  onContactChange,
}: StepConnectProps) {
  const ready = readyChannels(contact);
  const contactSummary = ready.length
    ? ready
        .map((c) => CONTACT_CHANNELS.find((m) => m.key === c)?.label)
        .join(" · ")
    : "고른 방법 없음";

  const join = (values: string[]) =>
    values.length ? values.join(" · ") : "선택 안 함";

  const summary = [
    { k: "지원 모집", v: post.title },
    { k: "사진", v: "메인 1장 · 추가 2장" },
    { k: "현재 상태", v: join(conditions.length) },
    { k: "최근 시술 이력", v: join(conditions.history) },
    { k: "가능 시간", v: join(conditions.availability.map(shortAvailability)) },
    { k: "연락 방법", v: contactSummary },
  ];

  return (
    <div className="screen-enter">
      <h2 className="text-section font-semibold">연락 가능한 방법</h2>
      <p className="mt-[6px] text-note leading-[1.6] text-ink-soft">
        여러 개 고를 수 있어요. 고른 방법만 디자이너에게 전달됩니다.
      </p>
      <div className="mt-3">
        <ContactMethodPicker value={contact} onChange={onContactChange} />
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
