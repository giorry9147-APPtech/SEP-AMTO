import { calculateWeightedAverage } from "@/lib/grades";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type {
  AdminGradesData,
  ClassSubjectSummary,
  GradebookStudent,
  StudentSubjectResults,
  TeacherGradebook
} from "@/types/app";
import type { Grade } from "@/types/database";

type SupabaseLike = NonNullable<Awaited<ReturnType<typeof createClient>>>;

type ClassSubjectRow = {
  id: string;
  teacher_id: string;
  subject: { name: string; subject_type: "general" | "vocational" } | null;
  teacher: { full_name: string | null } | null;
  class_room:
    | {
        name: string;
        year_level: number;
        study_program: { name: string; code: string } | null;
      }
    | null;
};

function mapClassSubjectSummary(row: ClassSubjectRow): ClassSubjectSummary {
  return {
    id: row.id,
    subject_name: row.subject?.name ?? "Vak",
    subject_type: row.subject?.subject_type ?? "general",
    class_name: row.class_room?.name ?? "Klas",
    year_level: row.class_room?.year_level ?? 0,
    program_name: row.class_room?.study_program?.name ?? "Onbekend",
    program_code: row.class_room?.study_program?.code ?? "",
    teacher_id: row.teacher_id,
    teacher_name: row.teacher?.full_name ?? "Onbekend"
  };
}

async function loadGradebookForClassSubject(
  supabase: SupabaseLike,
  classSubjectRow: ClassSubjectRow
): Promise<TeacherGradebook> {
  const classSubject = mapClassSubjectSummary(classSubjectRow);

  const { data: classSubjectDetail } = await supabase
    .from("class_subjects")
    .select("class_id")
    .eq("id", classSubject.id)
    .maybeSingle();

  const classId = classSubjectDetail?.class_id ?? null;

  let students: Array<{ id: string; full_name: string; email: string }> = [];

  if (classId) {
    const { data: classStudents } = await supabase
      .from("class_students")
      .select("student:profiles!class_students_student_id_fkey(id, full_name, email)")
      .eq("class_id", classId);

    students = ((classStudents ?? []) as unknown as Array<{
      student: { id: string; full_name: string; email: string } | null;
    }>)
      .map((row) => row.student)
      .filter((student): student is { id: string; full_name: string; email: string } => Boolean(student));
  }

  const { data: gradesData } = await supabase
    .from("grades")
    .select("*")
    .eq("class_subject_id", classSubject.id)
    .order("graded_at", { ascending: false });

  const grades = (gradesData ?? []) as Grade[];
  const gradesByStudent = new Map<string, Grade[]>();
  for (const grade of grades) {
    const list = gradesByStudent.get(grade.student_id) ?? [];
    list.push(grade);
    gradesByStudent.set(grade.student_id, list);
  }

  const gradebookStudents: GradebookStudent[] = students
    .sort((a, b) => a.full_name.localeCompare(b.full_name))
    .map((student) => {
      const studentGrades = gradesByStudent.get(student.id) ?? [];
      return {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        grades: studentGrades,
        average: calculateWeightedAverage(studentGrades)
      };
    });

  return {
    classSubject,
    students: gradebookStudents
  };
}

export async function getTeacherGradebook(
  teacherId: string,
  classSubjectId: string
): Promise<TeacherGradebook | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("class_subjects")
    .select(
      "id, teacher_id, subject:subjects(name, subject_type), teacher:profiles!class_subjects_teacher_id_fkey(full_name), class_room:classes(name, year_level, study_program:study_programs(name, code))"
    )
    .eq("id", classSubjectId)
    .eq("teacher_id", teacherId)
    .maybeSingle();

  if (error || !data) return null;

  return loadGradebookForClassSubject(supabase, data as unknown as ClassSubjectRow);
}

export async function getTeacherClassSubjects(teacherId: string): Promise<ClassSubjectSummary[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("class_subjects")
    .select(
      "id, teacher_id, subject:subjects(name, subject_type), teacher:profiles!class_subjects_teacher_id_fkey(full_name), class_room:classes(name, year_level, study_program:study_programs(name, code))"
    )
    .eq("teacher_id", teacherId);

  if (error || !data) return [];

  return (data as unknown as ClassSubjectRow[])
    .map(mapClassSubjectSummary)
    .sort((a, b) => a.subject_name.localeCompare(b.subject_name));
}

export async function getStudentResults(studentId: string): Promise<StudentSubjectResults[]> {
  const supabase = createAdminClient() ?? (await createClient());
  if (!supabase) return [];

  const { data: classRows } = await supabase
    .from("class_students")
    .select(
      "class_room:classes(class_subjects(id, teacher_id, subject:subjects(name, subject_type), teacher:profiles!class_subjects_teacher_id_fkey(full_name), class_room:classes(name, year_level, study_program:study_programs(name, code))))"
    )
    .eq("student_id", studentId);

  const classSubjectRows: ClassSubjectRow[] = (
    (classRows as Array<{ class_room?: { class_subjects?: ClassSubjectRow[] } }> | null) ?? []
  ).flatMap((entry) => entry.class_room?.class_subjects ?? []);

  if (!classSubjectRows.length) return [];

  const classSubjectIds = classSubjectRows.map((row) => row.id);

  const { data: gradesData } = await supabase
    .from("grades")
    .select("*")
    .eq("student_id", studentId)
    .in("class_subject_id", classSubjectIds)
    .order("graded_at", { ascending: false });

  const grades = (gradesData ?? []) as Grade[];
  const gradesBySubject = new Map<string, Grade[]>();
  for (const grade of grades) {
    const list = gradesBySubject.get(grade.class_subject_id) ?? [];
    list.push(grade);
    gradesBySubject.set(grade.class_subject_id, list);
  }

  return classSubjectRows
    .map((row) => {
      const summary = mapClassSubjectSummary(row);
      const subjectGrades = gradesBySubject.get(summary.id) ?? [];
      return {
        class_subject_id: summary.id,
        subject_name: summary.subject_name,
        subject_type: summary.subject_type,
        class_name: summary.class_name,
        year_level: summary.year_level,
        teacher_name: summary.teacher_name,
        grades: subjectGrades,
        average: calculateWeightedAverage(subjectGrades)
      };
    })
    .sort((a, b) => a.subject_name.localeCompare(b.subject_name));
}

export async function getAdminGradesData(
  selectedClassSubjectId?: string | null
): Promise<AdminGradesData> {
  const supabase = createAdminClient() ?? (await createClient());
  if (!supabase) {
    return { classSubjects: [], selectedClassSubjectId: null, selectedGradebook: null };
  }

  const { data, error } = await supabase
    .from("class_subjects")
    .select(
      "id, teacher_id, subject:subjects(name, subject_type), teacher:profiles!class_subjects_teacher_id_fkey(full_name), class_room:classes(name, year_level, study_program:study_programs(name, code))"
    );

  if (error || !data) {
    return { classSubjects: [], selectedClassSubjectId: null, selectedGradebook: null };
  }

  const rows = data as unknown as ClassSubjectRow[];
  const classSubjects = rows
    .map(mapClassSubjectSummary)
    .sort((a, b) => {
      const cls = a.class_name.localeCompare(b.class_name);
      if (cls !== 0) return cls;
      return a.subject_name.localeCompare(b.subject_name);
    });

  const targetId =
    selectedClassSubjectId && classSubjects.some((cs) => cs.id === selectedClassSubjectId)
      ? selectedClassSubjectId
      : classSubjects[0]?.id ?? null;

  if (!targetId) {
    return { classSubjects, selectedClassSubjectId: null, selectedGradebook: null };
  }

  const targetRow = rows.find((row) => row.id === targetId);
  if (!targetRow) {
    return { classSubjects, selectedClassSubjectId: targetId, selectedGradebook: null };
  }

  const gradebook = await loadGradebookForClassSubject(supabase, targetRow);

  return {
    classSubjects,
    selectedClassSubjectId: targetId,
    selectedGradebook: gradebook
  };
}
