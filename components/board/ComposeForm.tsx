"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactMethodPicker from "@/components/connect/ContactMethodPicker";
import BottomBar from "@/components/ui/BottomBar";
import Chip from "@/components/ui/Chip";
import PhotoSlot from "@/components/ui/PhotoSlot";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  AVAILABILITIES,
  CONDITIONS,
  createPost,
  REGION_ANY,
  REGION_OPTIONS,
} from "@/lib/model-posts";
import {
  channelMeta,
  EMPTY_CONTACT,
  hasReadyContact,
  readyChannels,
  type ContactInfo,
} from "@/lib/contact";
import { countPhotos, EMPTY_PHOTOS, getPhotoSlots, getShotGuide } from "@/lib/photo-slots";
import { hashPin, isValidPin, sanitizePinInput } from "@/lib/post-password";
import { uploadPostPhotos } from "@/lib/post-photos";
import type { Category, Photos } from "@/lib/types";

const CATEGORIES: Category[] = ["헤어", "네일"];

/**
 * 모델 지원 게시물 작성.
 * 사진 3장이 규격의 핵심이라 맨 위에 두고, 나머지 항목은 칩으로 여러 개 고른다.
 * 고른 값은 맨 아래 '이렇게 올라갑니다' 카드에 정리돼 그대로 게시물이 된다.
 */
export default function ComposeForm() {
  const router = useRouter();

  const [category, setCategory] = useState<Category>("헤어");
  const [photos, setPhotos] = useState<Photos>(EMPTY_PHOTOS);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [contact, setContact] = useState<ContactInfo>(EMPTY_CONTACT);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const filled = countPhotos(photos);
  const hasText = title.trim().length > 0 && body.trim().length > 0;
  const hasTags =
    regions.length > 0 && availabilities.length > 0 && conditions.length > 0;
  const hasContact = hasReadyContact(contact);
  const hasName = name.trim().length > 0;
  const hasPin = isValidPin(pin);
  const canSubmit =
    filled === 3 &&
    hasText &&
    hasTags &&
    hasContact &&
    agreed &&
    hasName &&
    hasPin;

  const ctaLabel =
    filled < 3
      ? `사진 ${filled}/3장 · 모두 올려주세요`
      : !hasText
        ? "제목과 소개를 써주세요"
        : !hasTags
          ? "시술희망지역 · 시간 · 현재 상태를 골라주세요"
          : !hasContact
            ? contact.channels.length === 0
              ? "연락 가능한 방법을 골라주세요"
              : "고른 연락 방법의 정보를 채워주세요"
            : !agreed
              ? "촬영·마케팅 활용 동의가 필요해요"
              : !hasName
                ? "본인 이름을 입력해주세요"
                : !hasPin
                  ? "삭제용 비밀번호 4자리를 입력해주세요"
                  : uploadingPhotos
                    ? "사진 올리는 중…"
                    : saving
                      ? "게시물 등록하는 중…"
                      : "게시물 올리기";

  function changeCategory(next: Category) {
    setCategory(next);
    // 카테고리가 바뀌면 현재 상태 선택지도 바뀐다
    setConditions((prev) => prev.filter((c) => CONDITIONS[next].includes(c)));
  }

  /** 시술희망지역 — 광주 전체와 개별 구는 같이 고를 수 없다 */
  function toggleRegion(option: string) {
    setRegions((prev) => {
      if (prev.includes(option)) return prev.filter((r) => r !== option);
      if (option === REGION_ANY) return [REGION_ANY];
      return REGION_OPTIONS.filter(
        (r) => r !== REGION_ANY && (r === option || prev.includes(r)),
      );
    });
  }

  async function handleSubmit() {
    if (!canSubmit || saving) return;
    setSaving(true);
    setError("");
    try {
      // 미리보기로 들고 있던 사진 3장을 Storage 에 올려 URL로 바꾼다
      setUploadingPhotos(true);
      const uploadedPhotos = await uploadPostPhotos(photos);
      setUploadingPhotos(false);

      // 비밀번호는 평문으로 저장하지 않는다 — 해시만 남긴다
      const pinHash = await hashPin(pin);
      const post = await createPost({
        category,
        title: title.trim(),
        body: body.trim(),
        photos: uploadedPhotos,
        regions,
        availabilities,
        conditions,
        // 골라만 두고 비워둔 방법은 저장하지 않는다
        contact: {
          ...contact,
          channels: readyChannels(contact),
          instagram: contact.instagram.trim().replace(/^@/, ""),
          kakaoUrl: contact.kakaoUrl.trim(),
        },
        name: name.trim(),
        agreedToPortraitUse: agreed,
        pinHash,
      });
      router.push(`/posts/${post.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "게시물을 올리지 못했어요.");
      setUploadingPhotos(false);
      setSaving(false);
    }
  }

  const summary = [
    { k: "작성자", v: name.trim() ? [name.trim()] : [] },
    { k: "분류", v: [category] },
    { k: "사진", v: filled === 3 ? ["3장 모두 첨부"] : [`${filled}/3장`] },
    { k: "시술희망지역", v: regions },
    { k: "가능한 시간", v: availabilities },
    { k: "현재 상태", v: conditions },
    {
      k: "연락 방법",
      v: readyChannels(contact).map((c) => channelMeta(c).label),
    },
    { k: "삭제 비밀번호", v: hasPin ? ["••••"] : [] },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader title="모델 지원 글쓰기" onBack={() => router.push("/")} />

      <div className="flex-1 px-5 pb-[140px] pt-1">
        <Field
          label="어떤 모델을 하고 싶나요"
          hint="사진 규격이 갈려서 하나만 고릅니다. 둘 다 하고 싶으면 글을 따로 올려주세요."
        >
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

        <Field
          label="소개/시술이력/희망스타일"
          hint="펌, 염색 등 최근 1~2년 내에 시술받으신 이력정보를 자세히 남겨주세요. 최종 희망스타일이나 시술관련 내용을 남겨주시면 작성하신 정보와 사진 등 확인후 작업 가능한 헤어전문가가 문의를 드립니다."
        >
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

        <Field label="시술희망지역" hint="갈 수 있는 곳을 모두 골라주세요.">
          <ChipRow
            options={REGION_OPTIONS}
            values={regions}
            onToggle={toggleRegion}
          />
        </Field>

        <Field label="가능한 시간" hint="되는 시간을 모두 골라주세요.">
          <ChipRow
            options={[...AVAILABILITIES]}
            values={availabilities}
            onToggle={(o) => setAvailabilities(toggle(availabilities, o))}
          />
        </Field>

        <Field label="현재 상태" hint="해당하는 것을 모두 골라주세요.">
          <ChipRow
            options={CONDITIONS[category]}
            values={conditions}
            onToggle={(o) => setConditions(toggle(conditions, o))}
          />
        </Field>

        <Field
          label="연락 가능한 방법"
          hint="여러 개 고를 수 있어요. 고른 방법만 게시물에 공개됩니다."
        >
          <ContactMethodPicker value={contact} onChange={setContact} />
        </Field>

        <section className="mt-[22px] rounded-panel-lg border border-line bg-card p-[17px] shadow-lift">
          <h2 className="text-section font-semibold">이렇게 올라갑니다</h2>
          <p className="mt-[6px] text-note leading-[1.6] text-ink-soft">
            고른 항목이 게시물에 이대로 정리돼 보입니다.
          </p>
          <dl className="mt-3 flex flex-col gap-[10px]">
            {summary.map((row) => (
              <div key={row.k} className="flex gap-3">
                <dt className="w-[80px] flex-none pt-[3px] text-[12px] text-ink-faint">
                  {row.k}
                </dt>
                <dd className="flex flex-1 flex-wrap gap-[5px]">
                  {row.v.length === 0 ? (
                    <span className="pt-[3px] text-[12.5px] text-ink-disabled">
                      아직 고르지 않음
                    </span>
                  ) : (
                    row.v.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-surface-2 px-[8px] py-[4px] text-[12px] font-medium text-ink-muted"
                      >
                        {item}
                      </span>
                    ))
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-[22px] rounded-panel-lg border border-line bg-card p-[17px] shadow-lift">
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            aria-pressed={agreed}
            className="flex w-full cursor-pointer items-start gap-[10px] text-left"
          >
            <span
              className={`mt-[1px] flex h-[20px] w-[20px] flex-none items-center justify-center rounded-[6px] border transition-colors duration-150 ${
                agreed
                  ? "border-ink bg-ink text-white"
                  : "border-line-chip bg-transparent text-transparent"
              }`}
            >
              <span className="text-[12px] leading-none">✓</span>
            </span>
            <span className="text-[12.5px] leading-[1.6] text-ink-body">
              본 시술은 디자이너의 포트폴리오 제작과 SNS/인터넷 홍보를 목적으로
              시술 지원 혜택이 제공되는 모델 작업입니다. 이에 따라 진행되는 시술
              전·후 사진 및 영상 촬영과 해당 콘텐츠의 마케팅 활용(초상권 사용)에
              동의합니다.
            </span>
          </button>

          <div className="mt-[16px] border-t border-hairline pt-[16px]">
            <div className="flex gap-[10px]">
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-ink-faint">
                  작성자 이름 (서명)
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  placeholder="본인 이름을 입력해주세요"
                  className="mt-[6px] w-full rounded-panel border border-line bg-surface p-[13px] text-section font-semibold outline-none placeholder:font-normal placeholder:text-ink-ghost focus:border-line-chip"
                />
              </div>
              <div className="w-[108px] flex-none">
                <div className="text-[12px] font-medium text-ink-faint">
                  삭제 비밀번호
                </div>
                <input
                  value={pin}
                  onChange={(e) => setPin(sanitizePinInput(e.target.value))}
                  inputMode="numeric"
                  type="password"
                  maxLength={4}
                  placeholder="숫자 4자리"
                  aria-label="삭제 비밀번호 4자리"
                  className="mt-[6px] w-full rounded-panel border border-line bg-surface p-[13px] text-center text-section font-semibold tracking-[0.3em] outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-ghost focus:border-line-chip"
                />
              </div>
            </div>
            <p className="mt-[6px] text-[11.5px] leading-[1.5] text-ink-faint">
              게시물에는 이름 앞 글자를 가리고 표시됩니다. 예) 김민서 → *민서.
              비밀번호는 이 게시물을 삭제할 때만 쓰입니다. 평소 자주쓰는 숫자나
              생년월일 등 기억하기 쉬운 숫자 4자리로 설정해 꼭 기억해주세요.
            </p>
          </div>
        </section>

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

/** 목록에서 값을 넣거나 뺀다 */
function toggle(list: string[], option: string): string[] {
  return list.includes(option)
    ? list.filter((v) => v !== option)
    : [...list, option];
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
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-[7px]">
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          size="option"
          multi
          selected={values.includes(option)}
          onSelect={() => onToggle(option)}
        />
      ))}
    </div>
  );
}
