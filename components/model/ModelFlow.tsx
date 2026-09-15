"use client";

import { useState } from "react";
import ApplyScreen from "@/components/model/ApplyScreen";
import DoneScreen from "@/components/model/DoneScreen";
import FeedScreen from "@/components/model/FeedScreen";
import PostDetailScreen from "@/components/model/PostDetailScreen";
import type { ContactInfo } from "@/lib/contact";
import { CURRENT_USER } from "@/lib/mock-data";
import { EMPTY_PHOTOS } from "@/lib/photo-slots";
import { useRecruitPosts } from "@/lib/use-recruit-posts";
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

const EMPTY_CONDITIONS: Conditions = { length: [], history: [], availability: [] };

/** 로그인 사용자의 프로필에서 가져온 기본 연락 방법 */
const INITIAL_CONTACT: ContactInfo = {
  channels: ["instagram", "kakao"],
  instagram: CURRENT_USER.instagram.handle,
  phone: "",
  kakaoUrl: openChatUrl(CURRENT_USER.kakao.slug),
};

/**
 * 모델(지원자) 측 플로우: feed → detail → apply(1→2→3) → done.
 * 화면 전환과 지원서 상태를 한곳에서 들고 있고, 각 화면은 값과 콜백만 받는다.
 */
export default function ModelFlow() {
  const posts = useRecruitPosts();
  const [screen, setScreen] = useState<ModelScreen>("feed");
  const [filter, setFilter] = useState<CategoryFilter>("전체");
  const [postId, setPostId] = useState(posts[0].id);

  const [step, setStep] = useState<ApplyStep>(1);
  const [photos, setPhotos] = useState<Photos>(EMPTY_PHOTOS);
  const [conditions, setConditions] = useState<Conditions>(EMPTY_CONDITIONS);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState<ContactInfo>(INITIAL_CONTACT);

  const post = posts.find((p) => p.id === postId) ?? posts[0];

  /** 완료 화면을 떠날 때 지원서를 초기화한다 */
  function resetApplication() {
    setStep(1);
    setPhotos(EMPTY_PHOTOS);
    setConditions(EMPTY_CONDITIONS);
    setNote("");
    setContact(INITIAL_CONTACT);
  }

  function handlePhotoChange(key: PhotoKey, dataUrl: string) {
    setPhotos((prev) => ({ ...prev, [key]: dataUrl }));
  }

  function handleConditionChange(key: ConditionKey, value: string) {
    setConditions((prev) => {
      const picked = prev[key];
      return {
        ...prev,
        [key]: picked.includes(value)
          ? picked.filter((v) => v !== value)
          : [...picked, value],
      };
    });
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
        contact={contact}
        onPhotoChange={handlePhotoChange}
        onConditionChange={handleConditionChange}
        onNoteChange={setNote}
        onContactChange={setContact}
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
