"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InstagramCard from "@/components/connect/InstagramCard";
import KakaoOpenChatCard from "@/components/connect/KakaoOpenChatCard";
import PhoneCard from "@/components/connect/PhoneCard";
import BottomBar from "@/components/ui/BottomBar";
import PhotoFrame from "@/components/ui/PhotoFrame";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { deletePostWithPin, formatRelative, maskName, type ModelPost } from "@/lib/model-posts";
import { useModelPosts } from "@/lib/use-model-posts";
import {
  channelMeta,
  contactHref,
  readyChannels,
} from "@/lib/contact";
import { getPhotoSlots } from "@/lib/photo-slots";
import { isValidPin, sanitizePinInput } from "@/lib/post-password";

/** 게시물 상세 — 사진 3장과 소개, 연락 수단 */
export default function PostDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { posts, loading, error, refresh } = useModelPosts();
  const post = posts.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sub text-ink-faint">
        불러오는 중…
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="text-cardtitle font-semibold">불러오지 못했어요</p>
        <p className="text-sub leading-[1.7] text-ink-soft">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-2 rounded-btn bg-ink px-6 py-[13px] text-section font-semibold text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="text-cardtitle font-semibold">게시물을 찾을 수 없어요</p>
        <p className="text-sub leading-[1.7] text-ink-soft">
          내려갔거나 주소가 잘못됐을 수 있습니다.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-btn bg-ink px-6 py-[13px] text-section font-semibold text-white"
        >
          게시판으로
        </Link>
      </div>
    );
  }

  const slots = getPhotoSlots(post.category);
  const [mainSlot, ...subSlots] = slots;
  // 지원자가 고른 연락 방법 중 값까지 갖춘 것만 공개한다
  const channels = readyChannels(post.contact);
  const primary = channels[0];

  // 글쓰기에서 고른 항목이 그대로 정리돼 올라온다
  const specs = [
    { k: "분류", v: [post.category] },
    { k: "시술희망지역", v: post.regions },
    { k: "가능한 시간", v: post.availabilities },
    { k: "현재 상태", v: post.conditions },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader
        title={post.category === "네일" ? "네일 모델 지원" : "헤어 모델 지원"}
        onBack={() => router.push("/")}
        trailing={
          <span className="flex-none font-mono text-[11px] text-ink-faint">
            {formatRelative(post.createdAt)}
          </span>
        }
      />

      <div className="flex-1 px-5 pb-[140px] pt-2">
        <PhotoFrame
          src={post.photos.main}
          badge={mainSlot.badge}
          className="aspect-4/5 rounded-panel-lg"
          large
        />

        <div className="mt-[10px] grid grid-cols-2 gap-[10px]">
          {subSlots.map((slot) => (
            <PhotoFrame
              key={slot.key}
              src={post.photos[slot.key]}
              badge={slot.badge}
              className="aspect-square rounded-slot-lg"
            />
          ))}
        </div>

        <section className="mt-5 rounded-panel-lg border border-line bg-card p-[17px] shadow-lift">
          <h1 className="text-detail font-semibold">{post.title}</h1>
          {post.name ? (
            <div className="mt-[4px] text-[12px] font-medium text-ink-faint">
              작성자 {maskName(post.name)}
            </div>
          ) : null}
          <dl className="mt-[14px] flex flex-col gap-[10px]">
            {specs
              .filter((s) => s.v.length > 0)
              .map((s) => (
                <div key={s.k} className="flex gap-3">
                  <dt className="w-[80px] flex-none pt-[3px] text-[12px] text-ink-faint">
                    {s.k}
                  </dt>
                  <dd className="flex flex-1 flex-wrap gap-[5px]">
                    {s.v.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-surface-2 px-[8px] py-[4px] text-[12.5px] font-medium text-ink-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
          </dl>
          <p className="mt-[14px] whitespace-pre-wrap border-t border-hairline pt-[13px] text-sub leading-[1.65] text-ink-body">
            {post.body}
          </p>
        </section>

        {channels.length > 0 ? (
          <section className="mt-[18px]">
            <h2 className="text-section font-semibold">연락 가능한 방법</h2>
            <div className="mt-[10px] flex flex-col gap-[9px]">
              {channels.map((channel) => (
                <div key={channel}>
                  {channel === "instagram" ? (
                    <InstagramCard
                      account={{
                        handle: post.contact.instagram,
                        postCount: "",
                        recentPosts: ["1", "2", "3"],
                      }}
                      variant="thumbs"
                    />
                  ) : null}
                  {channel === "phone" ? (
                    <PhoneCard phone={post.contact.phone} />
                  ) : null}
                  {channel === "kakao" ? (
                    <KakaoOpenChatCard
                      url={post.contact.kakaoUrl}
                      title="오픈채팅으로 대화"
                      actionLabel="열기"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <DeletePostControl post={post} onDeleted={() => router.push("/")} />
      </div>

      <BottomBar>
        {primary ? (
          <a
            href={contactHref(primary, post.contact)}
            target="_blank"
            rel="noreferrer noopener"
            className="flex h-[54px] w-full items-center justify-center rounded-btn bg-accent text-cardtitle font-bold text-accent-ink"
          >
            {channelMeta(primary).action}
          </a>
        ) : (
          <div className="flex h-[54px] w-full items-center justify-center rounded-btn bg-line-strong text-cardtitle font-semibold text-ink-disabled">
            연락처가 없는 글이에요
          </div>
        )}
      </BottomBar>
    </div>
  );
}

/**
 * 게시물 삭제 버튼과 비밀번호 확인 패널.
 * 회원가입이 없어 4자리 비밀번호가 유일한 본인 확인 수단이다.
 * 비밀번호가 없는 예전 글(pinHash === null)은 확인 절차 없이 바로 지운다.
 */
function DeletePostControl({
  post,
  onDeleted,
}: {
  post: ModelPost;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  function close() {
    setOpen(false);
    setPin("");
    setError("");
    setChecking(false);
  }

  async function handleConfirm() {
    if (post.pinHash && (!isValidPin(pin) || checking)) return;
    if (checking) return;

    setChecking(true);
    setError("");
    try {
      // 실제 비교는 delete_post_with_pin 함수가 서버에서 한다 — 이 값이
      // 맞는지는 삭제가 되고 안 되고로만 알 수 있다.
      const ok = await deletePostWithPin(post.id, pin);
      if (ok) {
        onDeleted();
        return;
      }
      setError("비밀번호가 일치하지 않습니다.");
      setPin("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "게시물을 지우지 못했어요.");
    } finally {
      setChecking(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 h-[48px] w-full rounded-btn border border-line-strong text-[13px] font-semibold text-ink-muted"
      >
        삭제하기
      </button>
    );
  }

  return (
    <div className="mt-6 rounded-panel-lg border border-line bg-card p-[16px]">
      {post.pinHash ? (
        <>
          <div className="text-[12.5px] font-semibold text-ink-body">
            삭제 비밀번호 4자리를 입력해주세요
          </div>
          <input
            value={pin}
            onChange={(e) => {
              setPin(sanitizePinInput(e.target.value));
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
            inputMode="numeric"
            type="password"
            maxLength={4}
            autoFocus
            placeholder="숫자 4자리"
            aria-label="삭제 비밀번호 4자리"
            className="mt-[10px] w-full rounded-panel border border-line bg-surface p-[13px] text-center text-section font-semibold tracking-[0.3em] outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-ghost focus:border-line-chip"
          />
          {error ? (
            <p className="mt-[8px] text-[12px] font-medium text-accent-deeper">
              {error}
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-[12.5px] leading-[1.6] text-ink-body">
          비밀번호가 설정되지 않은 게시물이에요. 바로 삭제할까요? 사진도 함께
          지워집니다.
        </p>
      )}

      <div className="mt-[14px] flex gap-[10px]">
        <button
          type="button"
          onClick={close}
          className="h-[44px] flex-1 rounded-btn border border-line-strong text-[13px] font-semibold text-ink-muted"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={Boolean(post.pinHash) && (!isValidPin(pin) || checking)}
          className={`h-[44px] flex-1 rounded-btn text-[13px] font-bold transition-colors duration-150 ${
            !post.pinHash || (isValidPin(pin) && !checking)
              ? "cursor-pointer bg-ink text-white"
              : "cursor-not-allowed bg-line-strong text-ink-disabled"
          }`}
        >
          {checking ? "확인 중…" : "삭제"}
        </button>
      </div>
    </div>
  );
}
