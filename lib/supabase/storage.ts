import { createAdminClient, createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

type StorageBucket = "lesson-files" | "submission-files" | "assignment-files";

export async function uploadStorageFile(bucket: StorageBucket, path: string, file: File) {
  if (!isSupabaseConfigured()) {
    return { path, error: null };
  }

  const adminClient = createAdminClient();
  const supabase = adminClient ?? (await createClient());

  if (!supabase) {
    return { path: null, error: "Supabase is niet beschikbaar." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadOptions = {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: true
  };
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, uploadOptions);

  if (error && adminClient && error.message.toLowerCase().includes("bucket")) {
    await adminClient.storage.createBucket(bucket, { public: false });
    const retry = await adminClient.storage.from(bucket).upload(path, buffer, uploadOptions);

    return { path: retry.error ? null : path, error: retry.error?.message ?? null };
  }

  return { path: error ? null : path, error: error?.message ?? null };
}

export async function getStorageObjectUrl(bucket: StorageBucket, path?: string | null) {
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
