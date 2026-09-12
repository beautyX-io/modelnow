"use client";

import InstagramCard from "@/components/connect/InstagramCard";
import KakaoOpenChatCard from "@/components/connect/KakaoOpenChatCard";
import PhoneCard from "@/components/connect/PhoneCard";
import Chip from "@/components/ui/Chip";
import {
  channelMeta,
  CONTACT_CHANNELS,
  type ContactChannel,
  type ContactInfo,
} from "@/lib/contact";

interface ContactMethodPickerProps {
  value: ContactInfo;
  onChange: (next: ContactInfo) => void;
}

/**
 * 연락 가능한 방법 고르기. 고른 것만 입력 칸이 열리고,
 * 최소 한 가지는 값까지 채워야 글을 올릴 수 있다.
 */
export default function ContactMethodPicker({
  value,
  onChange,
}: ContactMethodPickerProps) {
  function toggle(channel: ContactChannel) {
    const on = value.channels.includes(channel);
    const channels = on
      ? value.channels.filter((c) => c !== channel)
      : // 우선순위(선언 순서)를 유지한다
        CONTACT_CHANNELS.map((c) => c.key).filter(
          (key) => key === channel || value.channels.includes(key),
        );
    onChange({ ...value, channels });
  }

  const selected = CONTACT_CHANNELS.filter((c) =>
    value.channels.includes(c.key),
  );

  return (
    <div>
      <div className="flex flex-wrap gap-[7px]">
        {CONTACT_CHANNELS.map((c) => (
          <Chip
            key={c.key}
            label={c.label}
            size="option"
            multi
            selected={value.channels.includes(c.key)}
            onSelect={() => toggle(c.key)}
          />
        ))}
      </div>

      {selected.length === 0 ? (
        <p className="mt-3 rounded-btn bg-surface-2 p-[14px] text-note leading-[1.6] text-ink-soft">
          연락 방법을 하나 이상 골라주세요. 고른 방법만 게시물에 공개됩니다.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-[10px]">
          {selected.map((c) => (
            <div key={c.key}>
              {c.key === "instagram" ? (
                <InstagramCard
                  account={{
                    handle: value.instagram,
                    postCount: "",
                    recentPosts: [],
                  }}
                  variant="embed"
                  editable
                  onHandleChange={(handle) => onChange({ ...value, instagram: handle })}
                />
              ) : null}
              {c.key === "phone" ? (
                <PhoneCard
                  phone={value.phone}
                  variant="form"
                  onPhoneChange={(phone) => onChange({ ...value, phone })}
                />
              ) : null}
              {c.key === "kakao" ? (
                <KakaoOpenChatCard
                  url={value.kakaoUrl}
                  variant="form"
                  editable
                  onUrlChange={(kakaoUrl) => onChange({ ...value, kakaoUrl })}
                />
              ) : null}
              <p className="mt-[6px] px-[2px] text-[11.5px] leading-[1.5] text-ink-faint">
                {channelMeta(c.key).hint}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
