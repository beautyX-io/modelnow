"use client";

import { useState } from "react";
import ApplyScreen from "@/components/model/ApplyScreen";
import DoneScreen from "@/components/model/DoneScreen";
import FeedScreen from "@/components/model/FeedScreen";
import PostDetailScreen from "@/components/model/PostDetailScreen";
import { CURRENT_USER, POSTS } from "@/lib/mock-data";
import { EMPTY_PHOTOS } from "@/lib/photo-slots";
import type {
  ApplyStep,
  CategoryFilter,
  Conditions,
  ConditionKey,
  PhotoKey,
  Photos,
} from "@/lib/types";
import { openChatUrl } from "@/lib/validation";

type ModelScreen = "feed" | "detail" | "apply" | "done";

const INITIAL_KAKAO_URL = openChatUrl(CURRENT_USER.kakao.slug);

/**
 * 모델(지원자) 측 플로우: feed → detail → apply(1→2→3) → done.
 * 화면 전환과 지원서 상태를 한곳에서 들고 있고, 각 화면은 값과 콜백만 받는다.
 */
export default function ModelFlow() {
  const [screen, setScreen] = useState<ModelScreen>("feed");
  const [filter, setFilter] = useState<CategoryFilter>("전체");
  const [postId, setPostId] = useState(POSTS[0].id);

  const [step, setStep] = useState<ApplyStep>(1);
  const [photos, setPhotos] = useState<Photos>(EMPTY_PHOTOS);
  const [conditions, setConditions] = useState<Conditions>({});
  const [note, setNote] = useState("");
  const [instagramHandle, setInstagramHandle] = useState(
    CURRENT_USER.instagram.handle,
  );
  const [kakaoUrl, setKakaoUrl] = useState(INITIAL_KAKAO_URL);

  const post = POSTS.find((p) => p.id === postId) ?? POSTS[0];

  /** 완료 화면을 떠날 때 지원서를 초기화한다 */
  function resetApplication() {
    setStep(1);
    setPhotos(EMPTY_PHOTOS);
    setConditions({});
    setNote("");
    setInstagramHandle(CURRENT_USER.instagram.handle);
    setKakaoUrl(INITIAL_KAKAO_URL);
  }

  function handlePhotoChange(key: PhotoKey, dataUrl: string) {
    setPhotos((prev) => ({ ...prev, [key]: dataUrl }));
  }

  function handleConditionChange(key: ConditionKey, value: string) {
    setConditions((prev) => ({ ...prev, [key]: value }));
  }

  function handleApplyNext() {
    if (step === 3) {
      setScreen("done");
      return;
    }
    setStep((prev) => (prev + 1) as ApplyStep);
  }

  function handleApplyBack() {
    if (step === 1) {
      setScreen("detail");
      return;
    }
    setStep((prev) => (prev - 1) as ApplyStep);
  }

  function handleBackToFeed() {
    resetApplication();
    setScreen("feed");
  }

  if (screen === "detail") {
    return (
      <PostDetailScreen
        post={post}
        onBack={() => setScreen("feed")}
        onApply={() => {
          setStep(1);
          setScreen("apply");
        }}
      />
    );
  }

  if (screen === "apply") {
    return (
      <ApplyScreen
        post={post}
        step={step}
        photos={photos}
        conditions={conditions}
        note={note}
        instagramHandle={instagramHandle}
        kakaoUrl={kakaoUrl}
        onPhotoChange={handlePhotoChange}
        onConditionChange={handleConditionChange}
        onNoteChange={setNote}
        onInstagramHandleChange={setInstagramHandle}
        onKakaoUrlChange={setKakaoUrl}
        onBack={handleApplyBack}
        onNext={handleApplyNext}
      />
    );
  }

  if (screen === "done") {
    return <DoneScreen post={post} onBackToFeed={handleBackToFeed} />;
  }

  return (
    <FeedScreen
      filter={filter}
      onFilterChange={setFilter}
      onOpenPost={(id) => {
        setPostId(id);
        setScreen("detail");
      }}
    />
  );
}
