/** 업로드 이미지 장변 상한. localStorage 용량과 전송량을 같이 잡는다. */
const MAX_EDGE = 1280;
const QUALITY = 0.75;

/**
 * 고른 이미지를 리사이즈해 dataURL 로 만든다.
 * createImageBitmap 의 imageOrientation 으로 EXIF 회전까지 바로잡는다.
 *
 * 서버 업로드로 바꿀 때는 여기서 만든 Blob 을 서명 URL 로 PUT 하고
 * 반환값만 업로드된 이미지 URL 로 바꾸면 화면 쪽은 그대로 둬도 된다.
 */
export async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 올릴 수 있어요.");
  }

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context 없음");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    return canvas.toDataURL("image/jpeg", QUALITY);
  } catch {
    // createImageBitmap 미지원 브라우저 대비
    return readAsDataUrl(file);
  }
}

/**
 * fileToDataUrl 이 만든 dataURL 을 Supabase Storage 업로드용 Blob 으로 되돌린다.
 * 리사이즈는 이미 dataURL 을 만들 때 끝났으니 여기서는 형식만 바꾼다.
 */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("이미지를 읽지 못했어요."));
    reader.onerror = () => reject(new Error("이미지를 읽지 못했어요."));
    reader.readAsDataURL(file);
  });
}
