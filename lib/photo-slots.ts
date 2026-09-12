import type { Category, Photos, PhotoKey, PhotoSlotDef } from "./types";

/** 슬롯 순서 = 화면에 쌓이는 순서 */
export const PHOTO_KEYS: PhotoKey[] = ["main", "current", "desired"];

export const EMPTY_PHOTOS: Photos = { main: null, current: null, desired: null };

/**
 * 사진 3장 규격. 메인 한 장은 카테고리에 따라 정면 얼굴(헤어) / 손등(네일)으로 갈리고,
 * 추가 두 장은 현재 상태와 희망 스타일로 고정이다.
 */
export function getPhotoSlots(category: Category): PhotoSlotDef[] {
  const isNail = category === "네일";

  return [
    {
      key: "main",
      title: isNail ? "메인 · 손등 사진" : "메인 · 정면 얼굴 사진",
      hint: isNail
        ? "손톱이 전부 보이도록 손등이 위로. 자연광 권장"
        : "앞머리를 넘기고 정면, 얼굴 전체가 보이게",
      thumbSize: 86,
    },
    {
      key: "current",
      title: "추가 1 · 지금 상태",
      hint: isNail
        ? "현재 손톱 길이와 컬러가 보이는 사진"
        : "오늘 머리 상태 그대로 (측면 또는 뒷모습)",
      thumbSize: 66,
    },
    {
      key: "desired",
      title: "추가 2 · 희망 스타일",
      hint: "원하는 결과물 레퍼런스 1장",
      thumbSize: 66,
    },
  ];
}

/**
 * 사진 규격 안내 문구.
 * apply 는 구인 공고에 지원할 때, post 는 지원자가 직접 글을 올릴 때 쓴다.
 */
export function getShotGuide(
  category: Category,
  mode: "apply" | "post" = "apply",
): string {
  const main = category === "네일" ? "손등 사진" : "정면 얼굴 사진";
  const subject = mode === "apply" ? `${category} 모집은` : `${category}는`;
  const tail = mode === "apply" ? "지원할 수 있어요." : "글을 올릴 수 있어요.";
  return `${subject} ${main}이 메인입니다. 세 장 모두 올려야 ${tail}`;
}

/** 첨부된 사진 장수. 3장이어야 지원서 1단계를 통과한다. */
export function countPhotos(photos: Photos): number {
  return PHOTO_KEYS.filter((key) => photos[key]).length;
}
