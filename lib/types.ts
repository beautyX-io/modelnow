/** 모집 카테고리. 사진 규격과 모델 조건이 이 값으로 갈린다. */
export type Category = "헤어" | "네일";

/** 피드 상단 필터 칩 */
export type CategoryFilter = "전체" | Category;

export interface InstagramAccount {
  handle: string;
  /** 게시물 수 표기 문자열 (예: "1,204") */
  postCount: string;
  /** 임베드 미리보기 썸네일 자리표시자. 실제로는 oEmbed 결과 URL 3개 */
  recentPosts: string[];
}

export interface KakaoOpenChat {
  /** open.kakao.com/o/{slug} */
  slug: string;
  /** 링크 검증 통과 여부 — 실서비스에서는 도메인 화이트리스트 검사 결과 */
  verified: boolean;
  /** "1:1 채팅방" 같은 보조 설명 */
  roomType: string;
}

export interface Designer {
  name: string;
  salon: string;
  area: string;
  instagram: InstagramAccount;
  kakao: KakaoOpenChat;
  /** 포트폴리오 자리표시자 라벨 3개 */
  portfolio: string[];
}

export interface Post {
  id: string;
  category: Category;
  title: string;
  reward: string;
  duration: string;
  dateRange: string;
  /** 히어로/카드 이미지 자리표시자 라벨 */
  heroLabel: string;
  designer: Designer;
}

/** 지원서 단계 */
export type ApplyStep = 1 | 2 | 3;

/** 지원서 2단계 조건 그룹 */
export type ConditionKey = "length" | "history" | "availability";

export interface ConditionGroup {
  key: ConditionKey;
  label: string;
  options: string[];
}

export type Conditions = Partial<Record<ConditionKey, string>>;

/** 지원 사진 3장. 순서가 곧 슬롯 순서다. */
export type PhotoKey = "main" | "current" | "desired";

export interface PhotoSlotDef {
  key: PhotoKey;
  title: string;
  hint: string;
  /** 메인 슬롯만 썸네일이 크다 */
  thumbSize: number;
}

/** dataURL 또는 업로드된 이미지 URL. 비어 있으면 null */
export type PhotoValue = string | null;

export type Photos = Record<PhotoKey, PhotoValue>;

export type ApplicantStatus = "신규" | "검토" | "보류" | "수락";

export interface Applicant {
  id: string;
  name: string;
  age: number;
  /** 현재 상태 (예: "어깨 아래") — 목록 메타에 쓰인다 */
  length: string;
  /** 최근 시술 이력 */
  history: string;
  availability: string;
  area: string;
  note: string;
  status: ApplicantStatus;
  instagram: InstagramAccount;
  kakao: KakaoOpenChat;
  /** 사진 3장 자리표시자 라벨 */
  photoLabels: Record<PhotoKey, string>;
}
