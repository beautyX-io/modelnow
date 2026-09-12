/** 인스타그램 핸들 규칙: 영문·숫자·밑줄·마침표 1–30자 */
const INSTAGRAM_HANDLE = /^[A-Za-z0-9._]{1,30}$/;

/** 카카오 오픈채팅은 open.kakao.com 도메인만 허용한다 */
const OPEN_CHAT = /^(https?:\/\/)?open\.kakao\.com\/o\/[A-Za-z0-9]+$/;

export function isValidInstagramHandle(handle: string): boolean {
  return INSTAGRAM_HANDLE.test(handle.trim().replace(/^@/, ""));
}

export function isValidOpenChatLink(link: string): boolean {
  return OPEN_CHAT.test(link.trim());
}

export function openChatUrl(slug: string): string {
  return `open.kakao.com/o/${slug}`;
}
