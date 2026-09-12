import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MODELNOW — 헤어·네일 모델 매칭",
  description:
    "헤어·네일 모델을 하고 싶은 사람이 사진 3장과 소개를 올리고, 디자이너가 보고 연락하는 게시판",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "MODELNOW", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FBF9F6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Pretendard — README 지정 CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="min-h-full">
        {/* 기준 폭 402px(iPhone). 데스크톱에서는 중앙 정렬 max-width 480px */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-app">
          {children}
        </div>
      </body>
    </html>
  );
}
