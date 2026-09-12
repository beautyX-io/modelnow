"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import InstagramCard from "@/components/connect/InstagramCard";
import KakaoOpenChatCard from "@/components/connect/KakaoOpenChatCard";
import BottomBar from "@/components/ui/BottomBar";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { deletePost, formatRelative } from "@/lib/model-posts";
import { useHydrated, useModelPosts } from "@/lib/use-model-posts";
import { getPhotoSlots } from "@/lib/photo-slots";
import { isValidInstagramHandle, isValidOpenChatLink } from "@/lib/validation";

/** 게시물 상세 — 사진 3장과 소개, 연락 수단 */
export default function PostDetailView({ id }: { id: string }) {
  const router = useRouter();
  const posts = useModelPosts();
  const hydrated = useHydrated();
  const post = posts.find((p) => p.id === id);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center text-sub text-ink-faint">
        불러오는 중…
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
  const hasInstagram = isValidInstagramHandle(post.instagram);
  const hasKakao = isValidOpenChatLink(post.kakaoUrl);

  const specs = [
    { k: "분류", v: post.category },
    { k: "지역", v: post.region },
    { k: "가능 시간", v: post.availability },
    { k: "현재 상태", v: post.condition },
  ];

  function handleDelete() {
    if (!post) return;
    if (!window.confirm("이 게시물을 삭제할까요? 사진도 함께 지워집니다.")) return;
    deletePost(post.id);
    router.push("/");
  }

  const contactHref = hasKakao
    ? `https://${post.kakaoUrl.replace(/^https?:\/\//, "")}`
    : hasInstagram
      ? `https://instagram.com/${post.instagram}`
      : undefined;

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
          label={mainSlot.title}
          className="aspect-4/5 rounded-panel-lg"
          large
        />

        <div className="mt-[10px] grid grid-cols-2 gap-[10px]">
          {subSlots.map((slot) => (
            <PhotoFrame
              key={slot.key}
              src={post.photos[slot.key]}
              label={slot.title}
              className="aspect-square rounded-slot-lg"
            />
          ))}
        </div>

        <section className="mt-5 rounded-panel-lg border border-line bg-card p-[17px] shadow-lift">
          <h1 className="text-detail font-semibold">{post.title}</h1>
          <dl className="mt-[14px] grid grid-cols-2 gap-[14px]">
            {specs.map((s) => (
              <div key={s.k}>
                <dt className="text-[11px] font-medium text-ink-faint">{s.k}</dt>
                <dd className="mt-[3px] text-section font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-[14px] whitespace-pre-wrap border-t border-hairline pt-[13px] text-sub leading-[1.65] text-ink-body">
            {post.body}
          </p>
        </section>

        {hasInstagram || hasKakao ? (
          <div className="mt-[18px] flex flex-col gap-[9px]">
            {hasInstagram ? (
              <InstagramCard
                account={{
                  handle: post.instagram,
                  postCount: "",
                  recentPosts: ["1", "2", "3"],
                }}
                variant="thumbs"
              />
            ) : null}
            {hasKakao ? (
              <KakaoOpenChatCard
                url={post.kakaoUrl}
                title="오픈채팅으로 대화"
                actionLabel="열기"
              />
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleDelete}
          className="mt-6 w-full py-2 text-[12.5px] font-medium text-ink-faint underline underline-offset-4"
        >
          게시물 삭제
        </button>
      </div>

      <BottomBar>
        {contactHref ? (
          <a
            href={contactHref}
            target="_blank"
            rel="noreferrer noopener"
            className="flex h-[54px] w-full items-center justify-center rounded-btn bg-accent text-cardtitle font-bold text-accent-ink"
          >
            연락하기
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

function PhotoFrame({
  src,
  label,
  className,
  large = false,
}: {
  src: string | null;
  label: string;
  className: string;
  large?: boolean;
}) {
  if (src) {
    return (
      <div
        className={`bg-surface-3 bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={label}
      />
    );
  }

  return (
    <PhotoPlaceholder
      label={label}
      labelPill
      large={large}
      labelClassName="text-[9.5px]"
      className={`${className} p-2`}
    />
  );
}
