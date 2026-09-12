"use client";

import { useState } from "react";
import ApplicantDetailScreen from "@/components/designer/ApplicantDetailScreen";
import ApplicantListScreen from "@/components/designer/ApplicantListScreen";
import { APPLICANTS, type ApplicantFilter } from "@/lib/mock-data";

/**
 * 디자이너 측 플로우: list → detail.
 * 수락 상태는 목록으로 돌아가면 초기화된다(아직 서버 반영 없음).
 */
export default function DesignerFlow() {
  const [screen, setScreen] = useState<"list" | "detail">("list");
  const [filter, setFilter] = useState<ApplicantFilter>("전체");
  const [applicantId, setApplicantId] = useState(APPLICANTS[0].id);
  const [accepted, setAccepted] = useState(false);

  const index = Math.max(
    APPLICANTS.findIndex((a) => a.id === applicantId),
    0,
  );
  const applicant = APPLICANTS[index];

  function backToList() {
    setAccepted(false);
    setScreen("list");
  }

  if (screen === "detail") {
    return (
      <ApplicantDetailScreen
        applicant={applicant}
        position={index + 1}
        total={APPLICANTS.length}
        accepted={accepted}
        onBack={backToList}
        onHold={backToList}
        onAccept={() => setAccepted(true)}
      />
    );
  }

  return (
    <ApplicantListScreen
      filter={filter}
      onFilterChange={setFilter}
      onOpenApplicant={(id) => {
        setApplicantId(id);
        setAccepted(false);
        setScreen("detail");
      }}
    />
  );
}
