import type {
  Assignment,
  AssignmentFile,
  ClassRoom,
  ClassSubject,
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
