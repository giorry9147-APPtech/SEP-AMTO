export type UserRole = "admin" | "teacher" | "student";
export type SubjectType = "general" | "vocational";
export type SubmissionStatus = "submitted" | "reviewed" | "late";

export type Profile = {
  id: string;
  school_id: string | null;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type School = {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
};

export type StudyProgram = {
  id: string;
  school_id: string;
  name: string;
  code: string;
  created_at: string;
};

export type ClassRoom = {
  id: string;
  school_id: string;
  study_program_id: string;
  name: string;
  year_level: number;
  cohort_year: number;
  created_at: string;
};

export type Subject = {
  id: string;
  name: string;
  subject_type: SubjectType;
  created_at: string;
};

export type ClassSubject = {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  created_at: string;
};

export type Lesson = {
  id: string;
  class_subject_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  created_by: string;
  created_at: string;
};

export type LessonFile = {
  id: string;
  lesson_id: string;
  file_name: string;
  file_path: string;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type Assignment = {
  id: string;
  class_subject_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
};

export type Submission = {
  id: string;
  assignment_id: string;
  student_id: string;
  file_path: string | null;
  comment: string | null;
  status: SubmissionStatus;
  submitted_at: string;
};

export type SubmissionReview = {
  id: string;
  submission_id: string;
  teacher_id: string;
  score: number | null;
  feedback: string | null;
  reviewed_at: string;
};
