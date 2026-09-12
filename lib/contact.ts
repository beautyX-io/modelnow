import { isValidInstagramHandle, isValidOpenChatLink } from "./validation";

/** 지원자가 고를 수 있는 연락 방법 */
export type ContactChannel = "instagram" | "phone" | "kakao";

export interface ContactInfo {
  /** 고른 연락 방법. 순서는 CONTACT_CHANNELS 를 따른다 */
  channels: ContactChannel[];
  instagram: string;
  phone: string;
  kakaoUrl: string;
}

export const EMPTY_CONTACT: ContactInfo = {
  channels: [],
  instagram: "",
  phone: "",
  kakaoUrl: "",
};

interface ChannelMeta {
  key: ContactChannel;
  /** 선택 칩에 쓰는 짧은 이름 */
  label: string;
  /** 게시물에서 쓰는 행동 문구 */
  action: string;
  /** 입력 카드 아래 안내 */
  hint: string;
}

/** 선언 순서가 곧 우선순위다. 게시물의 대표 연락 버튼은 이 중 먼저 오는 것을 쓴다. */
export const CONTACT_CHANNELS: ChannelMeta[] = [
  {
    key: "instagram",
    label: "인스타그램 DM",
    action: "인스타 DM 보내기",
    hint: "디자이너가 계정을 보고 DM 을 보냅니다.",
  },
  {
    key: "phone",
    label: "문자 · 전화",
    action: "문자 보내기",
    hint: "번호는 게시물에 그대로 공개됩니다. 공개가 꺼려지면 다른 방법을 고르세요.",
  },
  {
    key: "kakao",
    label: "카카오톡 오픈채팅",
    action: "오픈채팅 열기",
    hint: "open.kakao.com 으로 시작하는 링크만 등록됩니다.",
  },
];

export function channelMeta(channel: ContactChannel): ChannelMeta {
  return CONTACT_CHANNELS.find((c) => c.key === channel) ?? CONTACT_CHANNELS[0];
}

/** 휴대폰 번호 — 숫자만 남긴 값으로 검사한다 */
const PHONE = /^01[016789]\d{7,8}$/;

export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean {
  return PHONE.test(digitsOnly(phone));
}

/** 010-1234-5678 꼴로 다듬는다 */
export function formatPhone(phone: string): string {
  const d = digitsOnly(phone).slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  const mid = d.length === 10 ? 6 : 7;
  return `${d.slice(0, 3)}-${d.slice(3, mid)}-${d.slice(mid)}`;
}

/** 그 방법에 쓸 값이 제대로 들어왔는지 */
export function isChannelReady(
  channel: ContactChannel,
  contact: ContactInfo,
): boolean {
  if (channel === "instagram") return isValidInstagramHandle(contact.instagram);
  if (channel === "phone") return isValidPhone(contact.phone);
  return isValidOpenChatLink(contact.kakaoUrl);
}

/** 고른 방법 중 값까지 갖춘 것들. 우선순위 순서로 돌려준다. */
export function readyChannels(contact: ContactInfo): ContactChannel[] {
  return CONTACT_CHANNELS.filter(
    (c) => contact.channels.includes(c.key) && isChannelReady(c.key, contact),
  ).map((c) => c.key);
}

/** 최소 한 가지는 연락이 닿아야 글을 올릴 수 있다 */
export function hasReadyContact(contact: ContactInfo): boolean {
  return readyChannels(contact).length > 0;
}

/** 게시물 하단 대표 버튼이 열 주소 */
export function contactHref(
  channel: ContactChannel,
  contact: ContactInfo,
): string {
  if (channel === "instagram") {
    return `https://instagram.com/${contact.instagram.replace(/^@/, "")}`;
  }
  if (channel === "phone") return `sms:${digitsOnly(contact.phone)}`;
  return `https://${contact.kakaoUrl.replace(/^https?:\/\//, "")}`;
}
