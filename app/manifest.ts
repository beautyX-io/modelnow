import type { MetadataRoute } from "next";

/** 홈 화면에 추가해 앱처럼 띄울 수 있게 하는 웹앱 매니페스트 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MODELNOW — 헤어·네일 모델 매칭",
    short_name: "MODELNOW",
    description:
      "헤어·네일 모델을 하고 싶은 사람이 사진 3장과 소개를 올리고, 디자이너가 보고 연락하는 게시판",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF9F6",
    theme_color: "#FBF9F6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
