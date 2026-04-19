import { demoStudentOverview } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { getStorageObjectUrl } from "@/lib/supabase/storage";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { StudentOverview } from "@/types/app";

function createEmptyStudentOverview(profile: StudentOverview["profile"] = null): StudentOverview {
  return {
    profile,
    subjects: [],
    lessons: [],
    assignments: [],
    submissions: [],
    stats: [
      { label: "Mijn vakken", value: "0", helper: "Nog geen vakken gekoppeld aan jouw account." },
      { label: "Opdrachten", value: "0", helper: "Er zijn nog geen opdrachten beschikbaar." },
      { label: "Inzendingen", value: "0", helper: "Je ingediende werk verschijnt hier zodra je iets uploadt." }
    ]
  };
}

export async function getStudentOverview(profileId?: string): Promise<StudentOverview> {
  if (!isSupabaseConfigured() || !profileId) {
    return demoStudentOverview;
  }

  try {
    const supabase = createAdminClient() ?? (await createClient());

    if (!supabase) {
      return createEmptyStudentOverview();
    }

    const [profileResult, classSubjectsResult, submissionsResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", profileId).maybeSingle(),
      supabase
        .from("class_students")
        .select("class_room:classes(class_subjects(*, subject:subjects(name, subject_type), teacher:profiles!class_subjects_teacher_id_fkey(full_name, email), class_room:classes(name, year_level, study_program:study_programs(id, name, code)), lessons(*, lesson_files(*)), assignments(*)))")
        .eq("student_id", profileId),
      supabase
        .from("submissions")
        .select("*, assignment:assignments(title, due_date), student:profiles!submissions_student_id_fkey(full_name, email), review:submission_reviews(*)")
        .eq("student_id", profileId)
        .order("submitted_at", { ascending: false })
    ]);

    const profile = profileResult.data;

    if (profileResult.error || !profile) {
      return createEmptyStudentOverview();
    }

    if (profile.role !== "student" && profile.role !== "admin") {
      return createEmptyStudentOverview(profile);
    }

    const classSubjects = classSubjectsResult.data;
    const submissions = submissionsResult.data ?? [];

    const classSubjectRows =
      ((classSubjects as Array<{ class_room?: { class_subjects?: any[] } }> | null) ?? []).flatMap(
        (entry) => entry.class_room?.class_subjects ?? []
      );

    const subjects = classSubjectRows.map((item) => ({
      ...item,
      review: undefined
    })) as StudentOverview["subjects"];

    const lessons = await Promise.all(
      classSubjectRows.flatMap((item) => item.lessons ?? []).map(async (lesson) => ({
        ...lesson,
        files: await Promise.all(
          ((lesson.lesson_files ?? []) as Array<{ file_path?: string | null }>).map(async (file) => ({
            ...file,
            download_url: await getStorageObjectUrl("lesson-files", file.file_path ?? null)
          }))
        )
      }))
    ) as StudentOverview["lessons"];

    const assignments = classSubjectRows.flatMap((item) =>
      (item.assignments ?? []).map((assignment: any) => ({
        ...assignment,
        subject_name: item.subject?.name ?? "Vak",
        class_name: item.class_room?.name ?? "Klas"
      }))
    ) as StudentOverview["assignments"];

    return {
      profile,
      subjects,
      lessons,
      assignments,
      submissions: submissions.map((item) => ({
        ...item,
        review: Array.isArray(item.review) ? item.review[0] ?? null : item.review
      })),
      stats: [
        { label: "Mijn vakken", value: String(subjects.length), helper: "Vakken binnen jouw klas." },
        { label: "Opdrachten", value: String(assignments.length), helper: "Beschikbare opdrachten." },
        { label: "Inzendingen", value: String(submissions.length), helper: "Jouw ingediende werk." }
      ]
    };
  } catch {
    return createEmptyStudentOverview();
  }
}
