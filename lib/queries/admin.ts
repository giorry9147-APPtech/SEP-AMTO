import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { AdminOverview } from "@/types/app";

function createEmptyAdminOverview(): AdminOverview {
  return {
    school: null,
    programs: [],
    subjects: [],
    users: [],
    classes: [],
    stats: [
      { label: "Studenten", value: "0", helper: "Actieve studenten in de database." },
      { label: "Docenten", value: "0", helper: "Actieve docentaccounts." },
      { label: "Klassen", value: "0", helper: "Beschikbare klassen." },
      { label: "Vakken", value: "0", helper: "Geregistreerde vakken." }
    ]
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = createAdminClient() ?? (await createClient());

  if (!supabase) {
    return createEmptyAdminOverview();
  }

  const [schoolResult, programsResult, subjectsResult, usersResult, classesResult] =
    await Promise.all([
      supabase.from("schools").select("*").limit(1).maybeSingle(),
      supabase.from("study_programs").select("*").order("name"),
      supabase.from("subjects").select("*").order("name"),
      supabase.from("profiles").select("*").order("full_name"),
      supabase
        .from("classes")
        .select("*, study_program:study_programs(id, name, code), class_students(id)")
        .order("name")
    ]);

  if (programsResult.error) {
    throw new Error(`study_programs laden mislukt: ${programsResult.error.message}`);
  }

  if (subjectsResult.error) {
    throw new Error(`subjects laden mislukt: ${subjectsResult.error.message}`);
  }

  if (usersResult.error) {
    throw new Error(`profiles laden mislukt: ${usersResult.error.message}`);
  }

  if (classesResult.error) {
    throw new Error(`classes laden mislukt: ${classesResult.error.message}`);
  }

  const school = schoolResult.data ?? null;
  const programs = programsResult.data ?? [];
  const subjects = subjectsResult.data ?? [];
  const users = usersResult.data ?? [];
  const classes = classesResult.data ?? [];

  const mappedClasses = classes.map((item) => ({
    id: item.id,
    school_id: item.school_id,
    study_program_id: item.study_program_id,
    name: item.name,
    year_level: item.year_level,
    cohort_year: item.cohort_year,
    created_at: item.created_at,
    study_program: item.study_program,
    student_count: item.class_students?.length ?? 0
  }));

  return {
    school,
    programs,
    subjects,
    users,
    classes: mappedClasses,
    stats: [
      { label: "Studenten", value: String(users.filter((user) => user.role === "student").length), helper: "Actieve studenten in de database." },
      { label: "Docenten", value: String(users.filter((user) => user.role === "teacher").length), helper: "Actieve docentaccounts." },
      { label: "Klassen", value: String(mappedClasses.length), helper: "Beschikbare klassen." },
      { label: "Vakken", value: String(subjects.length), helper: "Geregistreerde vakken." }
    ]
  };
}
