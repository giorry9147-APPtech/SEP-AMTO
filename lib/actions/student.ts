"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadStorageFile } from "@/lib/supabase/storage";

export async function uploadSubmissionAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    revalidatePath("/student/submissions");
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const assignmentId = String(formData.get("assignment_id"));
  const file = formData.get("file");
  let filePath: string | null = null;

  if (!assignmentId) {
    throw new Error("Kies eerst een opdracht.");
  }

  if (file instanceof File && file.size > 0) {
    const path = `${user.id}/${assignmentId}/${Date.now()}-${file.name}`;
    const upload = await uploadStorageFile("submission-files", path, file);

    if (upload.error || !upload.path) {
      throw new Error(upload.error || "Bestand uploaden mislukt.");
    }

    filePath = upload.path;
  }

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
    throw new Error(error.message);
  }

  revalidatePath("/student");
  revalidatePath("/student/assignments");
  revalidatePath("/student/submissions");
  redirect("/student/submissions");
}
