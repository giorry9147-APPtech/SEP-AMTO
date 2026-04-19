import { createClient } from "@/lib/supabase/server";
import type { TeacherOverview } from "@/types/app";

function createEmptyTeacherOverview(profile: TeacherOverview["profile"] = null): TeacherOverview {
  return {
    profile,
    subjects: [],
    lessons: [],
    assignments: [],
    submissions: [],
    stats: [
      { label: "Mijn vakken", value: "0", helper: "Vakken waar jij aan gekoppeld bent." },
      { label: "Opdrachten", value: "0", helper: "Door jou geplaatste opdrachten." },
      { label: "Submissions", value: "0", helper: "Inzendingen voor jouw opdrachten." }
    ]
  };
}

export async function getTeacherOverview(profileId?: string): Promise<TeacherOverview> {
  if (!profileId) {
    return createEmptyTeacherOverview();
  }

  try {
    const supabase = await createClient();

    if (!supabase) {
      return createEmptyTeacherOverview();
    }

    const [profileResult, subjectsResult, assignmentsResult, submissionsResult] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", profileId).maybeSingle(),
        supabase
          .from("class_subjects")
          .select("*, subject:subjects(name, subject_type), class_room:classes(name, year_level, study_program:study_programs(id, name, code)), teacher:profiles!class_subjects_teacher_id_fkey(full_name, email), lessons(*, lesson_files(*))")
          .eq("teacher_id", profileId)
          .order("created_at", { ascending: false }),
        supabase
          .from("assignments")
          .select("*, class_subject:class_subjects(subject:subjects(name), class_room:classes(name))")
          .eq("created_by", profileId)
          .order("created_at", { ascending: false }),
        supabase
          .from("submissions")
          .select("*, assignment:assignments(title, due_date), student:profiles!submissions_student_id_fkey(full_name, email), review:submission_reviews(*)")
          .order("submitted_at", { ascending: false })
      ]);

    const profile = profileResult.data;

    if (profileResult.error || !profile) {
      return createEmptyTeacherOverview();
    }

    if (profile.role !== "teacher" && profile.role !== "admin") {
      return createEmptyTeacherOverview(profile);
    }

    const subjects = (subjectsResult.data as TeacherOverview["subjects"]) ?? [];
    const lessons = ((subjectsResult.data as Array<{ lessons?: any[] }> | null) ?? [])
      .flatMap((item) => item.lessons ?? [])
      .map((lesson) => ({
        ...lesson,
        files: lesson.lesson_files ?? []
      })) as TeacherOverview["lessons"];
    const assignments = assignmentsResult.data ?? [];
    const submissions = submissionsResult.data ?? [];

    const assignmentItems = assignments.map((item) => ({
      id: item.id,
      class_subject_id: item.class_subject_id,
      title: item.title,
      description: item.description,
      due_date: item.due_date,
      created_by: item.created_by,
      created_at: item.created_at,
      subject_name: item.class_subject?.subject?.name ?? "Vak",
      class_name: item.class_subject?.class_room?.name ?? "Klas"
    }));

    return {
      profile,
      subjects,
      lessons,
      assignments: assignmentItems,
      submissions: submissions.map((item) => ({
        ...item,
        review: Array.isArray(item.review) ? item.review[0] ?? null : item.review
      })),
      stats: [
        { label: "Mijn vakken", value: String(subjects.length), helper: "Vakken waar jij aan gekoppeld bent." },
        { label: "Opdrachten", value: String(assignmentItems.length), helper: "Door jou geplaatste opdrachten." },
        { label: "Submissions", value: String(submissions.length), helper: "Inzendingen voor jouw opdrachten." }
      ]
    };
  } catch {
    return createEmptyTeacherOverview();
  }
}
