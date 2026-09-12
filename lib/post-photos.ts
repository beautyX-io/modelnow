import { dataUrlToBlob } from "./image";
import { POST_PHOTO_BUCKET, supabase } from "./supabase/client";
import type { PhotoKey, Photos } from "./types";

/**
 * 미리보기로 들고 있던 dataURL 사진 3장을 Supabase Storage 에 올리고
 * 공개 URL로 바꾼다. 업로드는 글을 실제로 등록할 때(제출 시점)만 한다 —
 * 사진을 고르는 동안 계속 올렸다 지웠다 하지 않기 위해서다.
 */
export async function uploadPostPhotos(photos: Photos): Promise<Photos> {
  const keys = Object.keys(photos) as PhotoKey[];

  const uploaded = await Promise.all(
    keys.map(async (key) => {
      const value = photos[key];
      if (!value) return [key, null] as const;

      const blob = await dataUrlToBlob(value);
      const path = `${crypto.randomUUID()}.jpg`;

      const { error } = await supabase.storage
        .from(POST_PHOTO_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });

      if (error) {
        throw new Error(`사진을 올리지 못했어요. (${error.message})`);
      }

      const { data } = supabase.storage.from(POST_PHOTO_BUCKET).getPublicUrl(path);
      return [key, data.publicUrl] as const;
    }),
  );

  return Object.fromEntries(uploaded) as Photos;
}
