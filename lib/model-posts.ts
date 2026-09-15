import type { ContactInfo } from "./contact";
import { supabase } from "./supabase/client";
import type { Category, Photos } from "./types";

/**
 * 모델 지원 게시물 — 일반인이 직접 올리는 글.
 * 디자이너가 올리는 구인 공고(`Post`)와 방향이 반대다.
 *
 * Supabase `posts` 테이블이 원본이다(schema: `supabase/schema.sql`).
 * 테이블 컬럼은 snake_case 라 rowToPost/postToInsertRow 가 이 모양으로 바꿔준다.
 */
export interface ModelPost {
  id: string;
  createdAt: number;
  category: Category;
  title: string;
  body: string;
  photos: Photos;
  /** 시술희망지역 — 여러 곳을 고를 수 있다 */
  regions: string[];
  /** 가능한 시간 */
  availabilities: string[];
  /** 현재 상태 (머리 길이 / 손톱 상태) */
  conditions: string[];
  /** 지원자가 고른 연락 방법과 값 */
  contact: ContactInfo;
  /** 작성자가 직접 입력한 본인 이름. 게시물에는 가운데 글자를 가리고 보인다(maskName) */
  name: string;
  /** 시술 전후 촬영·마케팅 활용(초상권) 동의 여부 — 동의해야 글이 올라간다 */
  agreedToPortraitUse: boolean;
  /**
   * 삭제용 4자리 비밀번호의 해시. 회원가입이 없어 이것이 유일한 본인 확인이다.
   * null 이면 비밀번호 없이 삭제되는 예전/샘플 글이라는 뜻이다.
   */
  pinHash: string | null;
}

/**
 * 이름 가운데 글자를 가린다. 첫 글자와 끝 글자는 남긴다.
 * "김민서" → "김*서", "김민" → "김*", "김" → "*".
 * 게시물 목록·상세 어디서든 작성자 이름은 이 함수를 거쳐야 한다.
 */
export function maskName(name: string): string {
  const trimmed = name.trim();
  const len = trimmed.length;
  if (len === 0) return "";
  if (len === 1) return "*";
  if (len === 2) return `${trimmed[0]}*`;
  return `${trimmed[0]}${"*".repeat(len - 2)}${trimmed[len - 1]}`;
}

export type NewModelPost = Omit<ModelPost, "id" | "createdAt">;

/** 서비스 지역 — 지금은 광주광역시만 연다 */
export const REGIONS = [
  "광주 광산구",
  "광주 동구",
  "광주 북구",
  "광주 서구",
] as const;

/** 어느 구든 갈 수 있다는 뜻. 구를 하나라도 고르면 풀린다. */
export const REGION_ANY = "광주 전체";

/** 글쓰기의 시술희망지역 선택지 */
export const REGION_OPTIONS: string[] = [REGION_ANY, ...REGIONS];

/** 글의 지역이 지역 칩 하나에 걸리는지. '광주 전체'는 모든 구에 걸린다. */
export function matchesRegion(post: ModelPost, region: string): boolean {
  if (region === "전체") return true;
  return post.regions.includes(region) || post.regions.includes(REGION_ANY);
}

/**
 * 검색창 필터. 제목·소개·분류·시술희망지역·가능한 시간·현재 상태를 모두 뒤진다.
 * 회원가입 없는 사이트라 검색이 사실상 유일한 탐색 수단이라, 좁게 잡지 않는다.
 */
export function matchesQuery(post: ModelPost, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    post.title,
    post.body,
    post.category,
    ...post.regions,
    ...post.conditions,
    ...post.availabilities.map(shortAvailability),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

/** 가능한 시간 — 시간대까지 붙여 디자이너가 바로 일정을 잡을 수 있게 한다 */
export const AVAILABILITIES = [
  "평일 오전 (09시~12시)",
  "평일 오후 (12시~18시)",
  "평일 저녁 (18시~21시)",
  "주말 오전 (09시~12시)",
  "주말 오후 (12시~18시)",
  "주말 저녁 (18시~21시)",
] as const;

/** 목록 카드처럼 좁은 자리에서는 시간대를 떼고 보여준다 */
export function shortAvailability(value: string): string {
  return value.replace(/\s*\(.*\)$/, "");
}

export const CONDITIONS: Record<Category, string[]> = {
  헤어: ["단발", "어깨 아래", "허리 길이", "숏컷"],
  네일: ["짧은 손톱", "보통 길이", "긴 손톱", "연장 제거 완료"],
};

export const SORTS = ["최신순", "오래된순"] as const;
export type Sort = (typeof SORTS)[number];

/* ---------------------------------------------------------------------------
   Supabase 매핑. 테이블 컬럼(snake_case, jsonb) ↔ 화면이 쓰는 ModelPost.
--------------------------------------------------------------------------- */

interface PostRow {
  id: string;
  created_at: string;
  category: Category;
  title: string;
  body: string;
  photo_main: string | null;
  photo_current: string | null;
  photo_desired: string | null;
  regions: string[];
  availabilities: string[];
  conditions: string[];
  contact: ContactInfo;
  name: string;
  agreed_to_portrait_use: boolean;
  pin_hash: string | null;
}

const POST_COLUMNS =
  "id, created_at, category, title, body, photo_main, photo_current, photo_desired, regions, availabilities, conditions, contact, name, agreed_to_portrait_use, pin_hash";

function rowToPost(row: PostRow): ModelPost {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    category: row.category,
    title: row.title,
    body: row.body,
    photos: {
      main: row.photo_main,
      current: row.photo_current,
      desired: row.photo_desired,
    },
    regions: row.regions ?? [],
    availabilities: row.availabilities ?? [],
    conditions: row.conditions ?? [],
    contact: row.contact,
    name: row.name,
    agreedToPortraitUse: row.agreed_to_portrait_use,
    pinHash: row.pin_hash,
  };
}

function postToInsertRow(input: NewModelPost) {
  return {
    category: input.category,
    title: input.title,
    body: input.body,
    photo_main: input.photos.main,
    photo_current: input.photos.current,
    photo_desired: input.photos.desired,
    regions: input.regions,
    availabilities: input.availabilities,
    conditions: input.conditions,
    contact: input.contact,
    name: input.name,
    agreed_to_portrait_use: input.agreedToPortraitUse,
    pin_hash: input.pinHash,
  };
}

/** 게시판 전체 목록. 최신순으로 받아서, 정렬은 화면에서 다시 한다. */
export async function listPosts(): Promise<ModelPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .order("created_at", { ascending: false })
    .returns<PostRow[]>();

  if (error) throw new Error(`게시물을 불러오지 못했어요. (${error.message})`);
  return (data ?? []).map(rowToPost);
}

/** 새 게시물을 올린다. 사진은 호출하는 쪽에서 먼저 Storage 에 올려 URL로 넘겨야 한다. */
export async function createPost(input: NewModelPost): Promise<ModelPost> {
  const { data, error } = await supabase
    .from("posts")
    .insert(postToInsertRow(input))
    .select(POST_COLUMNS)
    .single<PostRow>();

  if (error) throw new Error(`게시물을 올리지 못했어요. (${error.message})`);
  return rowToPost(data);
}

/**
 * 비밀번호가 맞을 때만 지운다. 실제 비교는 `delete_post_with_pin` 데이터베이스
 * 함수가 서버에서 하므로, 이 클라이언트는 맞는지 틀린지 알 방법이 없다 —
 * 그래서 anon 키로도 다른 사람 글을 지울 수 없다. `pinHash` 가 없던 예전
 * 글은 그 함수가 비밀번호 없이 지운다.
 */
export async function deletePostWithPin(id: string, pin: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("delete_post_with_pin", {
    post_id: id,
    pin,
  });

  if (error) throw new Error(`게시물을 지우지 못했어요. (${error.message})`);
  return Boolean(data);
}

/** 목록을 날짜 구간으로 나눈다 — 게시판에서 글을 구분해 보여주기 위한 것 */
export type DateBucket = "오늘" | "어제" | "이번 주" | "이전";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function bucketOf(createdAt: number, now = Date.now()): DateBucket {
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  if (createdAt >= startOfToday) return "오늘";
  if (createdAt >= startOfToday - DAY) return "어제";
  if (createdAt >= startOfToday - 7 * DAY) return "이번 주";
  return "이전";
}

export function formatRelative(createdAt: number, now = Date.now()): string {
  const diff = now - createdAt;
  if (diff < HOUR) return `${Math.max(1, Math.floor(diff / 60000))}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}일 전`;

  const d = new Date(createdAt);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
