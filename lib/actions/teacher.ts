"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormActionState } from "@/lib/actions/form-state";
import { parseGradeFormFields } from "@/lib/grades";
import { createClient } from "@/lib/supabase/server";
import { uploadStorageFile } from "@/lib/supabase/storage";

export async function createLessonAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    revalidatePath("/teacher/lessons/new");
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const classSubjectId = String(formData.get("class_subject_id"));

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .insert({
      class_subject_id: classSubjectId,
      title: String(formData.get("title")),
      content: String(formData.get("content") || ""),
      video_url: String(formData.get("video_url") || ""),
      created_by: user.id
    })
    .select("id")
    .single();

  if (lessonError || !lesson) {
    throw new Error(lessonError?.message || "Les opslaan mislukt.");
  }

  const file = formData.get("file");

  if (lesson && file instanceof File && file.size > 0) {
    const path = `${lesson.id}/${Date.now()}-${file.name}`;
    const upload = await uploadStorageFile("lesson-files", path, file);

    if (upload.error || !upload.path) {
      throw new Error(upload.error || "Bestand uploaden mislukt.");
    }

    const { error: lessonFileError } = await supabase.from("lesson_files").insert({
        lesson_id: lesson.id,
        file_name: file.name,
        file_path: upload.path,
        uploaded_by: user.id
      });

    if (lessonFileError) {
      throw new Error(`Bestand koppelen aan les mislukt: ${lessonFileError.message}`);
    }
  }

  revalidatePath("/teacher");
  revalidatePath("/teacher/subjects");
  revalidatePath(`/subject/${classSubjectId}`);
  redirect(`/subject/${classSubjectId}`);
}

export async function createAssignmentAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    revalidatePath("/teacher/assignments/new");
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const classSubjectId = String(formData.get("class_subject_id"));

  const { data: assignment, error: assignmentError } = await supabase.from("assignments").insert({
    class_subject_id: classSubjectId,
    title: String(formData.get("title")),
    description: String(formData.get("description") || ""),
    due_date: formData.get("due_date") ? new Date(String(formData.get("due_date"))).toISOString() : null,
    created_by: user.id
  }).select("id").single();

  if (assignmentError || !assignment) {
    throw new Error(assignmentError?.message || "Opdracht opslaan mislukt.");
  }

  const file = formData.get("file");

  if (file instanceof File && file.size > 0) {
    const path = `${assignment.id}/${Date.now()}-${file.name}`;
    const upload = await uploadStorageFile("assignment-files", path, file);

    if (upload.error || !upload.path) {
      throw new Error(upload.error || "Bestand uploaden mislukt.");
    }

    const { error: assignmentFileError } = await supabase.from("assignment_files").insert({
      assignment_id: assignment.id,
      file_name: file.name,
      file_path: upload.path,
      uploaded_by: user.id
    });

    if (assignmentFileError) {
      throw new Error(`Bestand koppelen aan opdracht mislukt: ${assignmentFileError.message}`);
    }
  }

  revalidatePath("/teacher");
  revalidatePath("/teacher/subjects");
  revalidatePath(`/subject/${classSubjectId}`);
  redirect(`/teacher/submissions/${assignment.id}`);
}

export async function reviewSubmissionAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    revalidatePath("/teacher");
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const submissionId = String(formData.get("submission_id"));
  const assignmentId = String(formData.get("assignment_id"));
  const status = String(formData.get("status"));
  const scoreRaw = String(formData.get("score") || "");

  const { error: submissionError } = await supabase.from("submissions").update({ status }).eq("id", submissionId);

  if (submissionError) {
    throw new Error(submissionError.message);
  }

  const { error: reviewError } = await supabase.from("submission_reviews").upsert({
    submission_id: submissionId,
    teacher_id: user.id,
    score: scoreRaw ? Number(scoreRaw) : null,
    feedback: String(formData.get("feedback") || "")
  });

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  revalidatePath("/teacher");
  revalidatePath(`/teacher/submissions/${assignmentId}`);
  revalidatePath("/student/submissions");
  redirect(`/teacher/submissions/${assignmentId}`);
}

export async function upsertGradeAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const supabase = await createClient();

  if (!supabase) {
    return { status: "error", message: "Verbinding met Supabase ontbreekt." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Geen actieve sessie gevonden." };
  }

  const parsed = parseGradeFormFields(formData);

  if (!parsed.ok) {
    return { status: "error", message: parsed.error };
  }

  const { id, payload } = parsed;

  if (id) {
    const { error } = await supabase
      .from("grades")
      .update({
        title: payload.title,
        grade_type: payload.grade_type,
        score: payload.score,
        weight: payload.weight,
        comment: payload.comment
      })
      .eq("id", id);

    if (error) {
      return { status: "error", message: `Cijfer bijwerken mislukt: ${error.message}` };
    }
  } else {
    const { error } = await supabase.from("grades").insert({
      class_subject_id: payload.class_subject_id,
      student_id: payload.student_id,
      title: payload.title,
      grade_type: payload.grade_type,
      score: payload.score,
      weight: payload.weight,
      comment: payload.comment,
      graded_by: user.id
    });

    if (error) {
      return { status: "error", message: `Cijfer opslaan mislukt: ${error.message}` };
    }
  }

  revalidatePath(`/teacher/grades/${payload.class_subject_id}`);
  revalidatePath("/student/results");
  revalidatePath("/admin/grades");

  return { status: "success", message: id ? "Cijfer is bijgewerkt." : "Cijfer is opgeslagen." };
}

export async function deleteGradeAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Verbinding met Supabase ontbreekt.");
  }

  const id = String(formData.get("id"));
  const classSubjectId = String(formData.get("class_subject_id"));

  if (!id) {
    throw new Error("Cijfer-id ontbreekt.");
  }

  const { error } = await supabase.from("grades").delete().eq("id", id);

  if (error) {
    throw new Error(`Cijfer verwijderen mislukt: ${error.message}`);
  }

  if (classSubjectId) {
    revalidatePath(`/teacher/grades/${classSubjectId}`);
  }
  revalidatePath("/student/results");
  revalidatePath("/admin/grades");
}
