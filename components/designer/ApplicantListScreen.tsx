"use client";

import Chip from "@/components/ui/Chip";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import {
  APPLICANT_FILTERS,
  APPLICANTS,
  CURRENT_DESIGNER,
  type ApplicantFilter,
} from "@/lib/mock-data";
import type { Applicant, ApplicantStatus } from "@/lib/types";

/**
 * 상태 배지 색. 프로토타입은 '신규' 배지에 회색 글씨를 썼지만
 * 대비가 너무 낮아 채워진 배지는 흰 글씨로 통일했다.
 */
const STATUS_STYLE: Record<ApplicantStatus, string> = {
  신규: "bg-badge-new text-white",
  검토: "bg-ink text-white",
  보류: "bg-white text-ink-muted ring-1 ring-line",
  수락: "bg-accent text-accent-ink",
};

interface ApplicantListScreenProps {
  filter: ApplicantFilter;
  onFilterChange: (filter: ApplicantFilter) => void;
  onOpenApplicant: (applicantId: string) => void;
}

/** B1. 지원자 목록 */
export default function ApplicantListScreen({
  filter,
  onFilterChange,
  onOpenApplicant,
}: ApplicantListScreenProps) {
  const applicants = APPLICANTS.filter(
    (a) => filter === "전체" || a.status === filter,
  );

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <header className="px-5 pb-[10px] pt-[calc(env(safe-area-inset-top,0px)+18px)]">
        <div className="text-meta text-ink-soft">
          {CURRENT_DESIGNER.salon} · {CURRENT_DESIGNER.area}
        </div>
        <h1 className="mt-1 text-title">지원자 {APPLICANTS.length}명</h1>
      </header>

      <div className="flex gap-[7px] px-5 pt-2">
        {APPLICANT_FILTERS.map((f) => (
          <Chip
            key={f}
            label={f}
            size="compact"
            selected={filter === f}
            onSelect={() => onFilterChange(f)}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 content-start gap-3 px-5 pb-10 pt-4">
        {applicants.map((applicant) => (
          <ApplicantCard
            key={applicant.id}
            applicant={applicant}
            onOpen={() => onOpenApplicant(applicant.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ApplicantCard({
  applicant,
  onOpen,
}: {
  applicant: Applicant;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className="cursor-pointer text-left">
      <PhotoPlaceholder
        label={applicant.photoLabels.main.replace("메인 · ", "")}
        labelClassName="text-[9px]"
        className="aspect-3/4 rounded-slot-lg p-2"
      >
        <span
          className={`absolute right-2 top-2 rounded-md px-[7px] py-1 text-[10px] font-semibold ${
            STATUS_STYLE[applicant.status]
          }`}
        >
          {applicant.status}
        </span>
      </PhotoPlaceholder>
      <div className="mt-2 text-sub font-semibold">{applicant.name}</div>
      <div className="text-[12px] text-ink-faint">
        {applicant.age} · {applicant.length}
      </div>
    </button>
  );
}
