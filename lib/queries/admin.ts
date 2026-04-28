import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { AdminListsData, AdminOverview, StudentEnrollmentItem, TeacherRosterItem } from "@/types/app";

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

export async function getAdminLists(): Promise<AdminListsData> {
  const supabase = createAdminClient() ?? (await createClient());

  if (!supabase) {
    return { classRosters: [], teacherRosters: [], studentEnrollments: [] };
  }

  const [classesResult, classSubjectsResult, classStudentsResult] = await Promise.all([
    supabase
      .from("classes")
      .select("id, name, year_level, study_program:study_programs(name, code), class_students(student:profiles!class_students_student_id_fkey(id, full_name, email))")
      .order("name"),
    supabase
      .from("class_subjects")
      .select("teacher:profiles!class_subjects_teacher_id_fkey(id, full_name, email), subject:subjects(name), class_room:classes(name, year_level, study_program:study_programs(name, code))"),
    supabase
      .from("class_students")
      .select("student:profiles!class_students_student_id_fkey(id, full_name, email), class_room:classes(name, year_level, study_program:study_programs(name, code))")
  ]);

  const classRosters = (classesResult.data ?? []).map((cls: any) => ({
    id: cls.id,
    name: cls.name,
    year_level: cls.year_level,
    program_name: cls.study_program?.name ?? "Onbekend",
    program_code: cls.study_program?.code ?? "",
    students: (cls.class_students ?? [])
      .map((cs: any) => cs.student)
      .filter(Boolean)
      .map((s: any) => ({ id: s.id, full_name: s.full_name, email: s.email }))
  }));

  const teacherMap = new Map<string, TeacherRosterItem>();
  for (const row of (classSubjectsResult.data ?? []) as any[]) {
    const teacher = row.teacher;
    if (!teacher) continue;
    const entry: TeacherRosterItem = teacherMap.get(teacher.id) ?? {
      teacher_id: teacher.id,
      teacher_name: teacher.full_name,
      teacher_email: teacher.email,
      assignments: []
    };
    const cr = row.class_room;
    entry.assignments.push({
      subject_name: row.subject?.name ?? "Onbekend",
      class_name: cr?.name ?? "Onbekend",
      year_level: cr?.year_level ?? 0,
      program_name: cr?.study_program?.name ?? "Onbekend"
    });
    teacherMap.set(teacher.id, entry);
  }

  const studentEnrollments = (classStudentsResult.data ?? [])
    .map((row: any) => {
      const s = row.student;
      const cr = row.class_room;
      if (!s || !cr) return null;
      return {
        student_id: s.id,
        student_name: s.full_name,
        student_email: s.email,
        class_name: cr.name,
        year_level: cr.year_level,
        program_name: cr.study_program?.name ?? "Onbekend",
        program_code: cr.study_program?.code ?? ""
      };
    })
    .filter(Boolean) as StudentEnrollmentItem[];

  return {
    classRosters,
    teacherRosters: Array.from(teacherMap.values()).sort((a, b) =>
      a.teacher_name.localeCompare(b.teacher_name)
    ),
    studentEnrollments
  };
}
