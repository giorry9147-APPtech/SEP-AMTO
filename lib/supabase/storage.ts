import { createAdminClient, createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function uploadStorageFile(bucket: "lesson-files" | "submission-files", path: string, file: File) {
  if (!isSupabaseConfigured()) {
    return { path, error: null };
  }

  const supabase = createAdminClient() ?? (await createClient());

  if (!supabase) {
    return { path: null, error: "Supabase is niet beschikbaar." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: true
  });

  return { path: error ? null : path, error: error?.message ?? null };
}

export async function getStorageObjectUrl(bucket: "lesson-files" | "submission-files", path?: string | null) {
  if (!path) {
    return null;
  }

  if (!isSupabaseConfigured()) {
    return "#";
  }

  const supabase = createAdminClient() ?? (await createClient());

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
