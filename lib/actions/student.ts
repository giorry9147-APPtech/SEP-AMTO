"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormActionState } from "@/lib/actions/form-state";
import { createClient } from "@/lib/supabase/server";
import { uploadStorageFile } from "@/lib/supabase/storage";

function getUploadErrorMessage(message: string) {
  if (message.toLowerCase().includes("bucket")) {
    return "Bestandenopslag is nog niet goed ingesteld. Maak de bucket 'submission-files' aan in Supabase en probeer opnieuw.";
  }

  if (message.toLowerCase().includes("row-level security")) {
    return "Je hebt nu geen rechten om deze opdracht in te leveren. Controleer of je aan de juiste klas gekoppeld bent.";
  }

  return message;
}

export async function uploadSubmissionAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const supabase = await createClient();

  if (!supabase) {
    revalidatePath("/student/submissions");
    return {
      status: "error",
      message: "Verbinding met Supabase ontbreekt."
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Log opnieuw in voordat je een opdracht inlevert."
    };
  }

  const assignmentId = String(formData.get("assignment_id"));
  const file = formData.get("file");
  let filePath: string | null = null;

  if (!assignmentId) {
    return {
      status: "warning",
      message: "Kies eerst een opdracht."
    };
  }

  if (!(file instanceof File) || file.size <= 0) {
    return {
      status: "warning",
      message: "Kies eerst een bestand om in te leveren."
    };
  }

  const path = `${user.id}/${assignmentId}/${Date.now()}-${file.name}`;
  const upload = await uploadStorageFile("submission-files", path, file);

  if (upload.error || !upload.path) {
    return {
      status: "error",
      message: getUploadErrorMessage(upload.error || "Bestand uploaden mislukt.")
    };
  }

  filePath = upload.path;

  const submissionData: Record<string, string | null> = {
    assignment_id: assignmentId,
    student_id: user.id,
    comment: String(formData.get("comment") || ""),
    status: "submitted",
    submitted_at: new Date().toISOString()
  };

  if (filePath) {
    submissionData.file_path = filePath;
  }

  const { error } = await supabase
    .from("submissions")
    .upsert(submissionData, { onConflict: "assignment_id,student_id" });

  if (error) {
    return {
      status: "error",
      message: getUploadErrorMessage(error.message)
    };
  }

  revalidatePath("/student");
  revalidatePath("/student/assignments");
  revalidatePath("/student/submissions");
  redirect("/student/submissions");
}
