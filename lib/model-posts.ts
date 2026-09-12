import type { Category, Photos } from "./types";

/**
 * 모델 지원 게시물 — 일반인이 직접 올리는 글.
 * 디자이너가 올리는 구인 공고(`Post`)와 방향이 반대다.
 */
export interface ModelPost {
  id: string;
  createdAt: number;
  category: Category;
  title: string;
  body: string;
  photos: Photos;
  region: string;
  availability: string;
  /** 현재 상태 (머리 길이 / 손톱 상태) */
  condition: string;
  instagram: string;
  kakaoUrl: string;
  /** 예시 게시물 표시 — 실데이터가 들어오면 사라진다 */
  sample?: boolean;
}

export type NewModelPost = Omit<ModelPost, "id" | "createdAt" | "sample">;

export const REGIONS = [
  "서울 강남",
  "서울 홍대",
  "서울 성수",
  "서울 잠실",
  "경기",
  "인천",
] as const;

export const AVAILABILITIES = [
  "평일 오전",
  "평일 오후",
  "주말 오전",
  "주말 오후",
] as const;

export const CONDITIONS: Record<Category, string[]> = {
  헤어: ["단발", "어깨 아래", "허리 길이", "숏컷"],
  네일: ["짧은 손톱", "보통 길이", "긴 손톱", "연장 제거 완료"],
};

export const SORTS = ["최신순", "오래된순"] as const;
export type Sort = (typeof SORTS)[number];

const STORAGE_KEY = "modelnow.model-posts.v1";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const emptyPhotos: Photos = { main: null, current: null, desired: null };

/** 게시판이 비어 보이지 않도록 첫 실행 때만 넣는 예시 글 */
function seedPosts(now: number): ModelPost[] {
  return [
    {
      id: "sample-1",
      createdAt: now - 2 * HOUR,
      category: "헤어",
      title: "레이어드 펌 받아보고 싶어요",
      body: "어깨 아래 길이고 최근 6개월 안에 펌이나 염색을 한 적이 없어요. 결과 사진 촬영과 SNS 게시 모두 괜찮습니다. 평일 오후에 강남 쪽으로 방문할 수 있어요.",
      photos: emptyPhotos,
      region: "서울 강남",
      availability: "평일 오후",
      condition: "어깨 아래",
      instagram: "seo_yun.k",
      kakaoUrl: "open.kakao.com/o/sYun2f9",
      sample: true,
    },
    {
      id: "sample-2",
      createdAt: now - 9 * HOUR,
      category: "네일",
      title: "가을 컬러 젤네일 모델 지원합니다",
      body: "손톱 길이는 3mm 정도이고 연장은 2주 전에 제거했습니다. 손 사진 촬영 괜찮고 홍대 근처면 언제든 갈 수 있어요.",
      photos: emptyPhotos,
      region: "서울 홍대",
      availability: "주말 오후",
      condition: "짧은 손톱",
      instagram: "haram.dy",
      kakaoUrl: "open.kakao.com/o/haram7kd",
      sample: true,
    },
    {
      id: "sample-3",
      createdAt: now - DAY - 3 * HOUR,
      category: "헤어",
      title: "탈색 모델 해보고 싶습니다 (2회까지 가능)",
      body: "작년에 한 번 탈색한 이력이 있고 지금은 많이 자란 상태예요. 두피는 예민한 편이라 상담 후 진행하고 싶습니다. 성수 쪽 주말 오전이 편해요.",
      photos: emptyPhotos,
      region: "서울 성수",
      availability: "주말 오전",
      condition: "허리 길이",
      instagram: "minji.log",
      kakaoUrl: "open.kakao.com/o/mjPark22",
      sample: true,
    },
    {
      id: "sample-4",
      createdAt: now - 5 * DAY,
      category: "네일",
      title: "프렌치 익스텐션 연습 모델 찾으시면 연락 주세요",
      body: "손이 작은 편이고 자연 손톱 상태는 좋습니다. 잠실 근처 평일 오전 시간대에 가능해요. 제거까지 같이 부탁드릴 수 있으면 좋겠습니다.",
      photos: emptyPhotos,
      region: "서울 잠실",
      availability: "평일 오전",
      condition: "보통 길이",
      instagram: "yuna_ju",
      kakaoUrl: "open.kakao.com/o/yunaJ0",
      sample: true,
    },
  ];
}

/* ---------------------------------------------------------------------------
   저장소. 지금은 브라우저 localStorage 가 원본이고, 메모리 캐시를 하나 두고
   구독자에게 변경을 알린다(useSyncExternalStore 용). 백엔드가 붙으면
   readStorage / writeStorage 만 API 호출로 바꾸면 된다.
--------------------------------------------------------------------------- */

let cache: ModelPost[] | null = null;
const listeners = new Set<() => void>();

/** 서버 렌더링 때 돌려줄 고정 값 — 매번 같은 참조여야 한다 */
const SERVER_SNAPSHOT: ModelPost[] = [];

function readStorage(): ModelPost[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ModelPost[]) : null;
  } catch {
    return null;
  }
}

function writeStorage(posts: ModelPost[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 클라이언트 스냅샷. 처음 읽을 때 예시 글을 넣고 시작한다. */
export function getSnapshot(): ModelPost[] {
  if (cache) return cache;

  const stored = readStorage();
  if (stored) {
    cache = stored;
    return cache;
  }

  const seeded = seedPosts(Date.now());
  try {
    writeStorage(seeded);
  } catch {
    // 저장에 실패해도 화면은 예시 글로 띄운다
  }
  cache = seeded;
  return cache;
}

export function getServerSnapshot(): ModelPost[] {
  return SERVER_SNAPSHOT;
}

export function getPost(id: string): ModelPost | undefined {
  return getSnapshot().find((post) => post.id === id);
}

/** 새 게시물을 맨 앞에 넣고 저장한다. 용량 초과 시 에러를 던진다. */
export function createPost(input: NewModelPost): ModelPost {
  const post: ModelPost = {
    ...input,
    id: `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };

  const next = [post, ...getSnapshot()];
  try {
    writeStorage(next);
  } catch {
    throw new Error(
      "저장 공간이 가득 찼어요. 사진 용량이 크거나 글이 많이 쌓였을 수 있습니다.",
    );
  }
  cache = next;
  emit();
  return post;
}

export function deletePost(id: string) {
  const next = getSnapshot().filter((post) => post.id !== id);
  writeStorage(next);
  cache = next;
  emit();
}

/** 목록을 날짜 구간으로 나눈다 — 게시판에서 글을 구분해 보여주기 위한 것 */
export type DateBucket = "오늘" | "어제" | "이번 주" | "이전";

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
