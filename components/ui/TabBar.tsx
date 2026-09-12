"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoardIcon,
  BriefcaseIcon,
  PencilIcon,
  ScissorsIcon,
} from "@/components/ui/icons";

const TABS = [
  { href: "/", label: "게시판", Icon: BoardIcon },
  { href: "/new", label: "글쓰기", Icon: PencilIcon },
  { href: "/recruit", label: "구인", Icon: BriefcaseIcon },
  { href: "/designer", label: "디자이너", Icon: ScissorsIcon },
] as const;

/** 하단 탭바 */
export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-blur fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[480px] border-t border-line px-[18px] pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-[10px]">
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-[5px] transition-colors duration-150 ${
              active ? "text-ink" : "text-ink-disabled"
            }`}
          >
            <Icon className={active ? "text-accent-deep" : undefined} />
            <span className="text-micro font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
