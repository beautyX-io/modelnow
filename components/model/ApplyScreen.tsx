"use client";

import StepConditions from "@/components/model/StepConditions";
import StepConnect from "@/components/model/StepConnect";
import StepPhotos from "@/components/model/StepPhotos";
import BottomBar from "@/components/ui/BottomBar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { hasReadyContact, type ContactInfo } from "@/lib/contact";
import { countPhotos } from "@/lib/photo-slots";
import type {
  ApplyStep,
  Conditions,
  ConditionKey,
  PhotoKey,
  Photos,
  Post,
} from "@/lib/types";

const STEP_LABELS = ["사진 3장", "내 조건", "연결 · 확인"];

interface ApplyScreenProps {
  post: Post;
  step: ApplyStep;
  photos: Photos;
  conditions: Conditions;
  note: string;
  contact: ContactInfo;
  onPhotoChange: (key: PhotoKey, dataUrl: string) => void;
  onConditionChange: (key: ConditionKey, value: string) => void;
  onNoteChange: (note: string) => void;
  onContactChange: (contact: ContactInfo) => void;
  onBack: () => void;
  onNext: () => void;
}

/** A3. 지원서 3단계 셸 — 헤더 · 진행바 · 단계 본문 · 하단 CTA */
export default function ApplyScreen({
  post,
  step,
  photos,
  conditions,
  note,
  contact,
  onPhotoChange,
  onConditionChange,
  onNoteChange,
  onContactChange,
  onBack,
  onNext,
}: ApplyScreenProps) {
  const filled = countPhotos(photos);
  const contactReady = hasReadyContact(contact);
  // 1단계는 사진 3장, 3단계는 연락 방법이 하나는 닿아야 넘어간다
  const canNext =
    step === 1 ? filled === 3 : step === 3 ? contactReady : true;

  const nextLabel =
    step === 3
      ? contactReady
        ? "지원서 보내기"
        : contact.channels.length === 0
          ? "연락 가능한 방법을 골라주세요"
          : "고른 연락 방법의 정보를 채워주세요"
      : canNext
        ? "다음"
        : `사진 ${filled}/3장 · 모두 올려주세요`;

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader
        title={`지원서 · ${STEP_LABELS[step - 1]}`}
        onBack={onBack}
        trailing={
          <div className="flex-none font-mono text-[12px] font-medium text-ink-faint">
            {step}/3
          </div>
        }
      >
        <div className="mt-[14px] flex gap-[5px]" aria-hidden>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-[3px] flex-1 rounded-sm transition-colors duration-150 ${
                n <= step ? "bg-accent" : "bg-line-strong"
              }`}
            />
          ))}
        </div>
      </ScreenHeader>

      <div className="flex-1 px-5 pb-[140px] pt-[10px]">
        {step === 1 && (
          <StepPhotos
            category={post.category}
            photos={photos}
            onPhotoChange={onPhotoChange}
          />
        )}
        {step === 2 && (
          <StepConditions
            conditions={conditions}
            onConditionChange={onConditionChange}
            note={note}
            onNoteChange={onNoteChange}
          />
        )}
        {step === 3 && (
          <StepConnect
            post={post}
            conditions={conditions}
            contact={contact}
            onContactChange={onContactChange}
          />
        )}
      </div>

      <BottomBar>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={`h-[54px] w-full rounded-btn text-cardtitle font-semibold transition-colors duration-150 ${
            canNext
              ? "cursor-pointer bg-accent text-accent-ink"
              : "cursor-not-allowed bg-line-strong text-ink-disabled"
          }`}
        >
          {nextLabel}
        </button>
      </BottomBar>
    </div>
  );
}
