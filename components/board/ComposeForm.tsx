"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import InstagramCard from "@/components/connect/InstagramCard";
import KakaoOpenChatCard from "@/components/connect/KakaoOpenChatCard";
import BottomBar from "@/components/ui/BottomBar";
import Chip from "@/components/ui/Chip";
import PhotoSlot from "@/components/ui/PhotoSlot";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  AVAILABILITIES,
  CONDITIONS,
  createPost,
  REGIONS,
} from "@/lib/model-posts";
import { countPhotos, EMPTY_PHOTOS, getPhotoSlots, getShotGuide } from "@/lib/photo-slots";
import type { Category, Photos } from "@/lib/types";
import { isValidInstagramHandle, isValidOpenChatLink } from "@/lib/validation";

const CATEGORIES: Category[] = ["헤어", "네일"];

/**
 * 모델 지원 게시물 작성. 사진 3장이 규격의 핵심이라 맨 위에 둔다.
 * 메인 사진은 헤어면 정면 얼굴, 네일이면 손등이다.
 */
export default function ComposeForm() {
  const router = useRouter();

  const [category, setCategory] = useState<Category>("헤어");
  const [photos, setPhotos] = useState<Photos>(EMPTY_PHOTOS);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [region, setRegion] = useState("");
  const [availability, setAvailability] = useState("");
  const [condition, setCondition] = useState("");
  const [instagram, setInstagram] = useState("");
  const [kakaoUrl, setKakaoUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const filled = countPhotos(photos);
  const hasText = title.trim().length > 0 && body.trim().length > 0;
  const hasTags = Boolean(region && availability && condition);
  const hasContact =
    isValidInstagramHandle(instagram) || isValidOpenChatLink(kakaoUrl);
  const canSubmit = filled === 3 && hasText && hasTags && hasContact;

  const ctaLabel =
    filled < 3
      ? `사진 ${filled}/3장 · 모두 올려주세요`
      : !hasText
        ? "제목과 소개를 써주세요"
        : !hasTags
          ? "지역 · 시간 · 현재 상태를 골라주세요"
          : !hasContact
            ? "연락받을 방법을 하나 이상 넣어주세요"
            : saving
              ? "올리는 중…"
              : "게시물 올리기";

  function changeCategory(next: Category) {
    setCategory(next);
    // 카테고리가 바뀌면 현재 상태 선택지도 바뀐다
    if (!CONDITIONS[next].includes(condition)) setCondition("");
  }

  function handleSubmit() {
    if (!canSubmit || saving) return;
    setSaving(true);
    setError("");
    try {
      const post = createPost({
        category,
        title: title.trim(),
        body: body.trim(),
        photos,
        region,
        availability,
        condition,
        instagram: instagram.trim().replace(/^@/, ""),
        kakaoUrl: kakaoUrl.trim(),
      });
      router.push(`/posts/${post.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "게시물을 올리지 못했어요.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader title="모델 지원 글쓰기" onBack={() => router.push("/")} />

      <div className="flex-1 px-5 pb-[140px] pt-1">
        <Field label="어떤 모델을 하고 싶나요">
          <div className="flex gap-[7px]">
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={category === c}
                onSelect={() => changeCategory(c)}
              />
            ))}
          </div>
        </Field>

        <Field label="사진 3장" hint={getShotGuide(category, "post")}>
          <div className="flex flex-col gap-3">
            {getPhotoSlots(category).map((def) => (
              <PhotoSlot
                key={def.key}
                def={def}
                value={photos[def.key]}
                onChange={(dataUrl) => setPhotos((p) => ({ ...p, [def.key]: dataUrl }))}
              />
            ))}
          </div>
          <p className="mt-3 rounded-btn bg-accent-soft p-[14px] text-note leading-[1.6] text-accent-deeper">
            사진은 게시물을 내리면 함께 사라집니다. 얼굴이나 손 외에 신분증 등
            개인정보가 찍힌 사진은 올리지 마세요.
          </p>
        </Field>

        <Field label="제목">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            placeholder="레이어드 펌 받아보고 싶어요"
            className="w-full rounded-panel border border-line bg-card p-[15px] text-section font-semibold outline-none placeholder:font-normal placeholder:text-ink-ghost focus:border-line-chip"
          />
        </Field>

        <Field label="소개" hint="현재 상태, 시술 이력, 가능한 날짜를 적어주세요.">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1000}
            placeholder="어깨 아래 길이고 최근 6개월 안에 펌이나 염색을 한 적이 없어요. 결과 사진 촬영과 SNS 게시 모두 괜찮습니다."
            className="min-h-[120px] w-full resize-y rounded-panel border border-line bg-card p-[15px] text-sub leading-[1.6] outline-none placeholder:text-ink-ghost focus:border-line-chip"
          />
          <div className="mt-[6px] text-right font-mono text-[11px] text-ink-faint">
            {body.length}/1000
          </div>
        </Field>

        <Field label="지역">
          <ChipRow
            options={[...REGIONS]}
            value={region}
            onChange={setRegion}
          />
        </Field>

        <Field label="가능한 시간">
          <ChipRow
            options={[...AVAILABILITIES]}
            value={availability}
            onChange={setAvailability}
          />
        </Field>

        <Field label="현재 상태">
          <ChipRow
            options={CONDITIONS[category]}
            value={condition}
            onChange={setCondition}
          />
        </Field>

        <Field
          label="연락받을 방법"
          hint="인스타그램이나 오픈채팅 중 하나는 있어야 디자이너가 연락할 수 있어요."
        >
          <div className="flex flex-col gap-[10px]">
            <InstagramCard
              account={{ handle: instagram, postCount: "", recentPosts: [] }}
              variant="embed"
              editable
              onHandleChange={setInstagram}
            />
            <KakaoOpenChatCard
              url={kakaoUrl}
              variant="form"
              editable
              onUrlChange={setKakaoUrl}
            />
          </div>
        </Field>

        {error ? (
          <p className="mt-4 rounded-btn bg-accent-soft p-[14px] text-note text-accent-deeper">
            {error}
          </p>
        ) : null}
      </div>

      <BottomBar>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || saving}
          className={`h-[54px] w-full rounded-btn text-cardtitle font-semibold transition-colors duration-150 ${
            canSubmit && !saving
              ? "cursor-pointer bg-accent text-accent-ink"
              : "cursor-not-allowed bg-line-strong text-ink-disabled"
          }`}
        >
          {ctaLabel}
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

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-[7px]">
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          size="option"
          selected={value === option}
          onSelect={() => onChange(option)}
        />
      ))}
    </div>
  );
}
