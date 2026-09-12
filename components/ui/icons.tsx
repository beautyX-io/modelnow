import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** 공통 스트로크 아이콘. 색은 currentColor 를 따른다. */
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function BoardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3.5" />
      <path d="M3.5 9.5h17M9 9.5v10" />
    </Icon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.6 19.4l3.7-.8L19 7.9a1.9 1.9 0 0 0 0-2.7l-.6-.6a1.9 1.9 0 0 0-2.7 0L5 15.7l-.4 3.7z" />
      <path d="M14.4 6.6l3.4 3.4" />
    </Icon>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="7.5" width="17" height="12" rx="3" />
      <path d="M9 7.5V6.2A2.2 2.2 0 0 1 11.2 4h1.6A2.2 2.2 0 0 1 15 6.2v1.3" />
      <path d="M3.5 12.5h17" />
    </Icon>
  );
}

export function ScissorsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="6.8" cy="17.2" r="2.6" />
      <circle cx="6.8" cy="6.8" r="2.6" />
      <path d="M9 8.6L19.5 19.2M19.5 4.8L9 15.4" />
    </Icon>
  );
}
