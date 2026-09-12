/**
 * 게시물 삭제용 4자리 숫자 비밀번호.
 * 회원가입이 없는 사이트라 이 번호가 유일한 본인 확인 수단이다.
 *
 * 평문은 절대 저장하지 않는다 — 글을 올릴 때 여기서 SHA-256 해시를 만들어
 * `posts.pin_hash` 에만 남긴다. 삭제할 때 값이 맞는지 비교하는 건 이 해시와
 * 같은 방식(`digest('modelnow-post-pin:' || pin, 'sha256')`)을 쓰는
 * `delete_post_with_pin` 데이터베이스 함수가 서버에서 한다 — 클라이언트는
 * 비교할 방법이 없고, 그래서 anon 키로도 다른 사람 글을 지울 수 없다.
 */

const PIN_PATTERN = /^\d{4}$/;

export function isValidPin(pin: string): boolean {
  return PIN_PATTERN.test(pin);
}

/** 입력 중인 값에서 숫자만, 최대 4자리만 남긴다 */
export function sanitizePinInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export async function hashPin(pin: string): Promise<string> {
  const bytes = new TextEncoder().encode(`modelnow-post-pin:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
