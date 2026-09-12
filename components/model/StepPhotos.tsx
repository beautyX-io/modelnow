"use client";

import PhotoSlot from "@/components/ui/PhotoSlot";
import { getPhotoSlots, getShotGuide } from "@/lib/photo-slots";
import type { Category, PhotoKey, Photos } from "@/lib/types";

interface StepPhotosProps {
  category: Category;
  photos: Photos;
  onPhotoChange: (key: PhotoKey, dataUrl: string) => void;
}

/** A3 · 1단계. 사진 3장 (메인 + 현재 상태 + 희망 스타일) */
export default function StepPhotos({
  category,
  photos,
  onPhotoChange,
}: StepPhotosProps) {
  const slots = getPhotoSlots(category);

  return (
    <div className="screen-enter">
      <p className="text-sub leading-[1.6] text-ink-soft">{getShotGuide(category)}</p>

      <div className="mt-4 flex flex-col gap-3">
        {slots.map((def) => (
          <PhotoSlot
            key={def.key}
            def={def}
            value={photos[def.key]}
            onChange={(dataUrl) => onPhotoChange(def.key, dataUrl)}
          />
        ))}
      </div>

      <p className="mt-4 rounded-btn bg-accent-soft p-[14px] text-note leading-[1.6] text-accent-deeper">
        사진은 수락 전까지 디자이너에게만 보이고, 모집이 끝나면 자동으로 비공개
        처리됩니다.
      </p>
    </div>
  );
}
