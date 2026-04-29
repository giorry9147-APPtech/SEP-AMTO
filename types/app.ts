import type {
  Assignment,
  AssignmentFile,
  ClassRoom,
  ClassSubject,
  Grade,
  Lesson,
  LessonFile,
  Profile,
  School,
  StudyProgram,
  Subject,
  Submission,
  SubmissionReview
} from "@/types/database";

export type DashboardStat = {
  label: string;
  value: string;
  helper: string;
};

export type ClassWithProgram = ClassRoom & {
  study_program: Pick<StudyProgram, "id" | "name" | "code">;
  student_count: number;
};

export type SubjectWithTeacher = ClassSubject & {
  subject: Pick<Subject, "name" | "subject_type">;
  class_room: Pick<ClassRoom, "name" | "year_level"> & {
    study_program?: Pick<StudyProgram, "id" | "name" | "code"> | null;
  };
  teacher: Pick<Profile, "full_name" | "email">;
};

export type LessonFileWithUrl = LessonFile & {
  download_url?: string | null;
};

export type AssignmentFileWithUrl = AssignmentFile & {
  download_url?: string | null;
};

export type LessonWithFiles = Lesson & {
  files: LessonFileWithUrl[];
};

export type AssignmentSummary = Assignment & {
  subject_name: string;
  class_name: string;
  files?: AssignmentFileWithUrl[];
};

export type SubmissionWithReview = Submission & {
  assignment: Pick<Assignment, "title" | "due_date">;
  student: Pick<Profile, "full_name" | "email">;
  review: SubmissionReview | null;
  file_url?: string | null;
};

export type AdminOverview = {
  school: School | null;
  stats: DashboardStat[];
  classes: ClassWithProgram[];
  programs: StudyProgram[];
  subjects: Subject[];
  users: Profile[];
};

export type TeacherOverview = {
  profile: Profile | null;
  stats: DashboardStat[];
  subjects: SubjectWithTeacher[];
  lessons: LessonWithFiles[];
  assignments: AssignmentSummary[];
  submissions: SubmissionWithReview[];
};

export type StudentOverview = {
  profile: Profile | null;
  stats: DashboardStat[];
  subjects: SubjectWithTeacher[];
  lessons: LessonWithFiles[];
  assignments: AssignmentSummary[];
  submissions: SubmissionWithReview[];
};

export type StudentProgramOption = Pick<StudyProgram, "id" | "name" | "code"> & {
  description?: string | null;
};

export type ClassRosterItem = {
  id: string;
  name: string;
  year_level: number;
  program_name: string;
  program_code: string;
  students: Array<{ id: string; full_name: string; email: string }>;
};

export type TeacherRosterItem = {
  teacher_id: string;
  teacher_name: string;
  teacher_email: string;
  assignments: Array<{
    subject_name: string;
    class_name: string;
    year_level: number;
    program_name: string;
  }>;
};

export type StudentEnrollmentItem = {
  student_id: string;
  student_name: string;
  student_email: string;
  class_name: string;
  year_level: number;
  program_name: string;
  program_code: string;
};

export type AdminListsData = {
  classRosters: ClassRosterItem[];
  teacherRosters: TeacherRosterItem[];
  studentEnrollments: StudentEnrollmentItem[];
};

export type GradedByMeta = Pick<Profile, "full_name"> & { role: Profile["role"] };

export type GradeStudentMeta = Pick<Profile, "id" | "full_name" | "email">;

export type GradeWithMeta = Grade & {
  student: GradeStudentMeta | null;
  graded_by_profile: GradedByMeta | null;
};

export type ClassSubjectSummary = {
  id: string;
  subject_name: string;
  subject_type: Subject["subject_type"];
  class_name: string;
  year_level: number;
  program_name: string;
  program_code: string;
  teacher_id: string;
  teacher_name: string;
};

export type GradebookStudent = {
  id: string;
  full_name: string;
  email: string;
  grades: Grade[];
  average: number | null;
};

export type TeacherGradebook = {
  classSubject: ClassSubjectSummary;
  students: GradebookStudent[];
};

export type StudentSubjectResults = {
  class_subject_id: string;
  subject_name: string;
  subject_type: Subject["subject_type"];
  class_name: string;
  year_level: number;
  teacher_name: string;
  grades: Grade[];
  average: number | null;
};

export type AdminGradesData = {
  classSubjects: ClassSubjectSummary[];
  selectedClassSubjectId: string | null;
  selectedGradebook: TeacherGradebook | null;
};
