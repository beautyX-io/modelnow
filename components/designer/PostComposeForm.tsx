"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Chip from "@/components/ui/Chip";
import BottomBar from "@/components/ui/BottomBar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { addRecruitPost } from "@/lib/recruit-posts";
import type { Category } from "@/lib/types";

const CATEGORIES: Category[] = ["헤어", "네일"];

/**
 * 디자이너의 모집 공고 작성.
 * `/recruit` `/designer` 는 아직 목데이터 플로우라 Supabase 가 아니라
 * `lib/recruit-posts.ts` 의 세션 메모리 저장소에 올라간다 — 새로고침하면 사라진다.
 */
export default function PostComposeForm() {
  const router = useRouter();

  const [category, setCategory] = useState<Category>("헤어");
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [duration, setDuration] = useState("");
  const [dateRange, setDateRange] = useState("");

  const canSubmit =
    title.trim().length > 0 &&
    reward.trim().length > 0 &&
    duration.trim().length > 0 &&
    dateRange.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    addRecruitPost({
      category,
      title: title.trim(),
      reward: reward.trim(),
      duration: duration.trim(),
      dateRange: dateRange.trim(),
    });
    router.push("/designer");
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader
        title="모집 공고 작성"
        onBack={() => router.push("/designer")}
      />

      <div className="flex-1 px-5 pb-[140px] pt-1">
        <Field label="어떤 모델을 구하나요">
          <div className="flex gap-[7px]">
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={category === c}
                onSelect={() => setCategory(c)}
              />
            ))}
          </div>
        </Field>

        <Field label="제목">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            placeholder={
              category === "네일"
                ? "가을 컬러 젤네일 모델 구해요"
                : "레이어드 펌 모델 구해요"
            }
            className="w-full rounded-panel border border-line bg-card p-[15px] text-section font-semibold outline-none placeholder:font-normal placeholder:text-ink-ghost focus:border-line-chip"
          />
        </Field>

        <Field label="보상" hint="무료 진행이면 '무료', 페이가 있으면 금액을 적어주세요.">
          <input
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            maxLength={30}
            placeholder="무료 + 재료비 5,000원"
            className="w-full rounded-panel border border-line bg-card p-[15px] text-section font-semibold outline-none placeholder:font-normal placeholder:text-ink-ghost focus:border-line-chip"
          />
        </Field>

        <Field label="소요 시간">
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            maxLength={20}
            placeholder="2시간 30분"
            className="w-full rounded-panel border border-line bg-card p-[15px] text-section font-semibold outline-none placeholder:font-normal placeholder:text-ink-ghost focus:border-line-chip"
          />
        </Field>

        <Field label="가능 일정">
          <input
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            maxLength={20}
            placeholder="9/20–9/25"
            className="w-full rounded-panel border border-line bg-card p-[15px] text-section font-semibold outline-none placeholder:font-normal placeholder:text-ink-ghost focus:border-line-chip"
          />
        </Field>
      </div>

      <BottomBar>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`h-[54px] w-full rounded-btn text-cardtitle font-semibold transition-colors duration-150 ${
            canSubmit
              ? "cursor-pointer bg-accent text-accent-ink"
              : "cursor-not-allowed bg-line-strong text-ink-disabled"
          }`}
        >
          모집 공고 올리기
        </button>
      </BottomBar>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-[22px] first:mt-4">
      <h2 className="text-section font-semibold">{label}</h2>
      {hint ? (
        <p className="mt-[6px] text-note leading-[1.6] text-ink-soft">{hint}</p>
      ) : null}
      <div className="mt-[10px]">{children}</div>
    </section>
  );
}
