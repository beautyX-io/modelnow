"use client";

import Chip from "@/components/ui/Chip";
import { CONDITION_GROUPS } from "@/lib/mock-data";
import type { ConditionKey, Conditions } from "@/lib/types";

interface StepConditionsProps {
  conditions: Conditions;
  onConditionChange: (key: ConditionKey, value: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
}

/** A3 · 2단계. 내 조건 (그룹별 단일 선택 + 자유 서술) */
export default function StepConditions({
  conditions,
  onConditionChange,
  note,
  onNoteChange,
}: StepConditionsProps) {
  return (
    <div className="screen-enter">
      {CONDITION_GROUPS.map((group) => (
        <fieldset key={group.key} className="mb-[22px]">
          <legend className="text-section font-semibold">{group.label}</legend>
          <div className="mt-[10px] flex flex-wrap gap-[7px]">
            {group.options.map((option) => (
              <Chip
                key={option}
                label={option}
                size="option"
                selected={conditions[group.key] === option}
                onSelect={() => onConditionChange(group.key, option)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <label htmlFor="apply-note" className="text-section font-semibold">
        추가로 알릴 점
      </label>
      <textarea
        id="apply-note"
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="두피가 예민한 편이라 탈색은 1회만 가능해요. 평일 오후 3시 이후로 방문할 수 있습니다."
        className="mt-[10px] min-h-[88px] w-full resize-y rounded-panel border border-line bg-card p-[15px] text-sub leading-[1.6] text-ink outline-none placeholder:text-ink-ghost focus:border-line-chip"
      />
    </div>
  );
}
