import Link from "next/link";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { formatRelative, type ModelPost } from "@/lib/model-posts";

/** 게시판 목록의 카드 한 장 */
export default function ModelPostCard({ post }: { post: ModelPost }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="flex gap-[13px] rounded-card border border-line bg-card p-[13px] shadow-lift transition-shadow duration-150 active:shadow-none"
    >
      {post.photos.main ? (
        <div
          className="aspect-4/5 w-[88px] flex-none rounded-slot bg-surface-3 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.photos.main})` }}
        />
      ) : (
        <PhotoPlaceholder
          step={7}
          className="aspect-4/5 w-[88px] flex-none rounded-slot"
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[6px]">
          <span className="rounded-md bg-ink px-[7px] py-[3px] text-[10px] font-semibold text-white">
            {post.category}
          </span>
          <span className="truncate text-[11.5px] text-ink-faint">
            {post.region}
          </span>
          <span className="ml-auto flex-none font-mono text-[10.5px] text-ink-faint">
            {formatRelative(post.createdAt)}
          </span>
        </div>

        <div className="mt-[7px] line-clamp-1 text-sub font-semibold">
          {post.title}
        </div>
        <p className="mt-[4px] line-clamp-2 text-[12.5px] leading-[1.5] text-ink-soft">
          {post.body}
        </p>

        <div className="mt-[8px] flex flex-wrap gap-[5px]">
          <span className="rounded-md bg-accent-soft px-[7px] py-[4px] text-[11px] font-medium text-accent-deep">
            {post.availability}
          </span>
          <span className="rounded-md bg-surface-2 px-[7px] py-[4px] text-[11px] font-medium text-ink-muted">
            {post.condition}
          </span>
        </div>
      </div>
    </Link>
  );
}
