import PostDetailView from "@/components/board/PostDetailView";

/** 게시물 상세. 본문은 클라이언트 저장소에서 읽는다. */
export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  return <PostDetailView id={id} />;
}
