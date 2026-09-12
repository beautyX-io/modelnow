import type {
  Applicant,
  Category,
  ConditionGroup,
  Designer,
  Post,
} from "./types";

/**
 * 목데이터. 디자인 프로토타입의 더미 값을 그대로 옮겼다.
 * 실서비스에서는 posts / applications 테이블 조회 결과로 교체한다.
 */

const DESIGNERS: Record<string, Designer> = {
  hana: {
    name: "하나",
    salon: "라온헤어",
    area: "강남",
    instagram: {
      handle: "hana_hair.log",
      postCount: "412",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "hanaPerm", verified: true, roomType: "1:1 채팅방" },
    portfolio: ["결과컷 1", "결과컷 2", "시술 과정"],
  },
  jieun: {
    name: "지은",
    salon: "스튜디오 진",
    area: "홍대",
    instagram: {
      handle: "jin.nail.studio",
      postCount: "1,204",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "jinSyrup", verified: true, roomType: "1:1 채팅방" },
    portfolio: ["결과컷 1", "결과컷 2", "시술 과정"],
  },
  taeo: {
    name: "태오",
    salon: "세컨드플로어",
    area: "성수",
    instagram: {
      handle: "taeo.bleach",
      postCount: "860",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "taeoAsh", verified: true, roomType: "1:1 채팅방" },
    portfolio: ["결과컷 1", "결과컷 2", "시술 과정"],
  },
  soy: {
    name: "소이",
    salon: "네일바이소이",
    area: "잠실",
    instagram: {
      handle: "nail.by.soy",
      postCount: "233",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "soyFrench", verified: true, roomType: "1:1 채팅방" },
    portfolio: ["결과컷 1", "결과컷 2", "시술 과정"],
  },
};

export const POSTS: Post[] = [
  {
    id: "p1",
    category: "헤어",
    title: "레이어드 펌 모델 구해요",
    reward: "무료 + 재료비 5,000원",
    duration: "2시간 30분",
    dateRange: "9/14–9/20",
    heroLabel: "모델 결과컷 · 3:4",
    designer: DESIGNERS.hana,
  },
  {
    id: "p2",
    category: "네일",
    title: "가을 시럽 젤네일 모델",
    reward: "무료",
    duration: "1시간 30분",
    dateRange: "9/12–9/17",
    heroLabel: "손등 결과컷 · 3:4",
    designer: DESIGNERS.jieun,
  },
  {
    id: "p3",
    category: "헤어",
    title: "밝은 애쉬 탈색 모델 (2회)",
    reward: "페이 20,000원",
    duration: "4시간",
    dateRange: "9/18–9/21",
    heroLabel: "모델 결과컷 · 3:4",
    designer: DESIGNERS.taeo,
  },
  {
    id: "p4",
    category: "네일",
    title: "프렌치 익스텐션 모델",
    reward: "무료 + 제거비 지원",
    duration: "2시간",
    dateRange: "9/15–9/19",
    heroLabel: "손등 결과컷 · 3:4",
    designer: DESIGNERS.soy,
  },
];

/** 모집 상세의 "모델 조건" — 카테고리별 문구 */
export const REQUIREMENTS: Record<Category, string[]> = {
  헤어: [
    "어깨 아래 길이, 최근 6개월 내 펌 이력 없음",
    "두피 트러블이 없는 분",
    "시술 후 결과 사진 촬영 및 SNS 게시 동의",
    "평일 오후 2시–6시 방문 가능한 분",
  ],
  네일: [
    "자연 손톱 길이 3mm 이상",
    "최근 2주 내 연장·젤 제거 완료",
    "손 사진 촬영 및 SNS 게시 동의",
    "평일 낮 방문 가능한 분",
  ],
};

/** 지원서 2단계 조건 칩 (각 그룹 단일 선택) */
export const CONDITION_GROUPS: ConditionGroup[] = [
  {
    key: "length",
    label: "현재 상태",
    options: ["단발", "어깨 아래", "허리 길이", "짧은 손톱", "긴 손톱"],
  },
  {
    key: "history",
    label: "최근 시술 이력",
    options: ["없음", "염색 3개월 내", "탈색 이력 있음", "펌 이력 있음"],
  },
  {
    key: "availability",
    label: "가능한 시간",
    options: ["평일 오전", "평일 오후", "주말 오전", "주말 오후"],
  },
];

/** 지원서 3단계에 미리 채워지는 지원자 본인 연결 정보 (로그인 사용자 프로필) */
export const CURRENT_USER = {
  instagram: {
    handle: "seo_yun.k",
    postCount: "128",
    recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
  },
  kakao: { slug: "sYun2f9", verified: true, roomType: "1:1 채팅방" },
};

/** 디자이너 측 화면의 로그인 사용자 */
export const CURRENT_DESIGNER = DESIGNERS.hana;

const photoLabels = {
  main: "메인 · 정면 얼굴",
  current: "추가 1 · 지금 상태",
  desired: "추가 2 · 희망 스타일",
};

export const APPLICANTS: Applicant[] = [
  {
    id: "a1",
    name: "김서윤",
    age: 26,
    length: "어깨 아래",
    history: "시술 이력 없음",
    availability: "평일 오후",
    area: "강남 · 도보 10분",
    note: "두피가 예민한 편이라 탈색은 1회만 가능해요. 평일 오후 3시 이후로 방문할 수 있습니다.",
    status: "신규",
    instagram: {
      handle: "seo_yun.k",
      postCount: "128",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "sYun2f9", verified: true, roomType: "1:1 채팅방" },
    photoLabels,
  },
  {
    id: "a2",
    name: "이하람",
    age: 23,
    length: "단발",
    history: "염색 3개월 내",
    availability: "평일 오전",
    area: "역삼 · 도보 15분",
    note: "단발이라 레이어드가 잘 나올지 궁금해요. 오전 시간대가 가장 편합니다.",
    status: "신규",
    instagram: {
      handle: "haram.dy",
      postCount: "64",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "haram7kd", verified: true, roomType: "1:1 채팅방" },
    photoLabels,
  },
  {
    id: "a3",
    name: "박민지",
    age: 29,
    length: "허리 길이",
    history: "펌 이력 있음",
    availability: "주말 오후",
    area: "선릉 · 버스 20분",
    note: "작년 가을에 펌을 한 번 했고 지금은 많이 풀렸어요. 주말만 시간이 납니다.",
    status: "검토",
    instagram: {
      handle: "minji.log",
      postCount: "311",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "mjPark22", verified: true, roomType: "1:1 채팅방" },
    photoLabels,
  },
  {
    id: "a4",
    name: "정유나",
    age: 21,
    length: "어깨 아래",
    history: "시술 이력 없음",
    availability: "평일 오후",
    area: "논현 · 도보 20분",
    note: "시술 이력이 전혀 없어서 머릿결은 좋은 편이에요. 결과컷 촬영 괜찮습니다.",
    status: "검토",
    instagram: {
      handle: "yuna_ju",
      postCount: "45",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "yunaJ0", verified: true, roomType: "1:1 채팅방" },
    photoLabels,
  },
  {
    id: "a5",
    name: "최다은",
    age: 27,
    length: "단발",
    history: "탈색 이력 있음",
    availability: "주말 오전",
    area: "삼성 · 지하철 10분",
    note: "작년에 탈색을 두 번 했습니다. 손상 상태 보시고 판단해 주세요.",
    status: "보류",
    instagram: {
      handle: "daeun.ch",
      postCount: "202",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "daeun5x", verified: true, roomType: "1:1 채팅방" },
    photoLabels,
  },
  {
    id: "a6",
    name: "한지수",
    age: 24,
    length: "어깨 아래",
    history: "염색 3개월 내",
    availability: "평일 오후",
    area: "신사 · 도보 12분",
    note: "3개월 전 갈색으로 염색했어요. 톤 다운도 괜찮습니다.",
    status: "신규",
    instagram: {
      handle: "jisu.hann",
      postCount: "97",
      recentPosts: ["게시물 1", "게시물 2", "게시물 3"],
    },
    kakao: { slug: "jisuH9", verified: true, roomType: "1:1 채팅방" },
    photoLabels,
  },
];

/** 디자이너 목록 상단 상태 필터 */
export const APPLICANT_FILTERS = ["전체", "신규", "검토"] as const;
export type ApplicantFilter = (typeof APPLICANT_FILTERS)[number];
