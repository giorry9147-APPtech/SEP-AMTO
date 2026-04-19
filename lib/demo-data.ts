import type { AdminOverview, StudentOverview, TeacherOverview } from "@/types/app";
import type { Profile } from "@/types/database";

const schoolId = "11111111-1111-1111-1111-111111111111";

export const demoProfiles: Record<"admin" | "teacher" | "student", Profile> = {
  admin: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    school_id: schoolId,
    full_name: "Demo Admin",
    email: "admin@amto.demo",
    role: "admin",
    created_at: new Date().toISOString()
  },
  teacher: {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    school_id: schoolId,
    full_name: "Ir. K. Jubitana",
    email: "docent@amto.demo",
    role: "teacher",
    created_at: new Date().toISOString()
  },
  student: {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    school_id: schoolId,
    full_name: "Naomi Simons",
    email: "student@amto.demo",
    role: "student",
    created_at: new Date().toISOString()
  }
};

export const demoAdminOverview: AdminOverview = {
  school: {
    id: schoolId,
    name: "AMTO Avond Middelbare Technische Opleiding",
    address: "Paramaribo",
    created_at: new Date().toISOString()
  },
  stats: [
    { label: "Studenten", value: "128", helper: "Actief gekoppeld aan klassen." },
    { label: "Docenten", value: "14", helper: "Verdeling over algemene en beroepsvakken." },
    { label: "Klassen", value: "8", helper: "Leerjaar 1 t/m 4 binnen vier richtingen." },
    { label: "Vakken", value: "11", helper: "Inclusief algemene AMTO-vakken." }
  ],
  classes: [
    {
      id: "class-1",
      school_id: schoolId,
      study_program_id: "program-et",
      name: "ET-1A",
      year_level: 1,
      cohort_year: 2026,
      created_at: new Date().toISOString(),
      study_program: { id: "program-et", name: "Elektrotechniek", code: "ELEK" },
      student_count: 28
    },
    {
      id: "class-2",
      school_id: schoolId,
      study_program_id: "program-bouw",
      name: "BK-2A",
      year_level: 2,
      cohort_year: 2025,
      created_at: new Date().toISOString(),
      study_program: { id: "program-bouw", name: "Bouwkunde", code: "BOUW" },
      student_count: 22
    }
  ],
  programs: [
    { id: "program-bouw", school_id: schoolId, name: "Bouwkunde", code: "BOUW", created_at: new Date().toISOString() },
    { id: "program-et", school_id: schoolId, name: "Elektrotechniek", code: "ELEK", created_at: new Date().toISOString() },
    { id: "program-wwb", school_id: schoolId, name: "Weg- en waterbouwkunde", code: "WWB", created_at: new Date().toISOString() },
    { id: "program-wtb", school_id: schoolId, name: "Werktuigbouwkunde", code: "WTB", created_at: new Date().toISOString() }
  ],
  subjects: [
    { id: "subj-nl", name: "Nederlands", subject_type: "general", created_at: new Date().toISOString() },
    { id: "subj-en", name: "Engels", subject_type: "general", created_at: new Date().toISOString() },
    { id: "subj-na", name: "Natuurkunde", subject_type: "general", created_at: new Date().toISOString() },
    { id: "subj-vei", name: "Veiligheid", subject_type: "general", created_at: new Date().toISOString() }
  ],
  users: [demoProfiles.admin, demoProfiles.teacher, demoProfiles.student]
};

export const demoTeacherOverview: TeacherOverview = {
  profile: demoProfiles.teacher,
  stats: [
    { label: "Mijn vakken", value: "2", helper: "Actieve vakken binnen twee klassen." },
    { label: "Open opdrachten", value: "3", helper: "Wachten op inzending of review." },
    { label: "Nieuwe submissions", value: "6", helper: "Recent door studenten ingediend." }
  ],
  subjects: [
    {
      id: "cs-1",
      class_id: "class-1",
      subject_id: "subj-et",
      teacher_id: demoProfiles.teacher.id,
      created_at: new Date().toISOString(),
      subject: { name: "Elektrotechnische installaties", subject_type: "vocational" },
      class_room: {
        name: "ET-1A",
        year_level: 1,
        study_program: { id: "program-et", name: "Elektrotechniek", code: "ELEK" }
      },
      teacher: { full_name: demoProfiles.teacher.full_name, email: demoProfiles.teacher.email }
    },
    {
      id: "cs-2",
      class_id: "class-1",
      subject_id: "subj-vei",
      teacher_id: demoProfiles.teacher.id,
      created_at: new Date().toISOString(),
      subject: { name: "Veiligheid", subject_type: "general" },
      class_room: {
        name: "ET-1A",
        year_level: 1,
        study_program: { id: "program-et", name: "Elektrotechniek", code: "ELEK" }
      },
      teacher: { full_name: demoProfiles.teacher.full_name, email: demoProfiles.teacher.email }
    }
  ],
  lessons: [
    {
      id: "lesson-1",
      class_subject_id: "cs-1",
      title: "Week 1: symbolen en schema's",
      content: "We behandelen symbolen, schakelschema's en basisveiligheid.",
      video_url: null,
      created_by: demoProfiles.teacher.id,
      created_at: new Date().toISOString(),
      files: [
        {
          id: "file-1",
          lesson_id: "lesson-1",
          file_name: "Reader week 1.pdf",
          file_path: "lesson-files/lesson-1/reader-week-1.pdf",
          uploaded_by: demoProfiles.teacher.id,
          uploaded_at: new Date().toISOString()
        }
      ]
    }
  ],
  assignments: [
    {
      id: "asg-1",
      class_subject_id: "cs-1",
      title: "Praktijkopdracht 1",
      description: "Teken en verklaar een eenvoudige schakeling.",
      due_date: new Date().toISOString(),
      created_by: demoProfiles.teacher.id,
      created_at: new Date().toISOString(),
      subject_name: "Elektrotechnische installaties",
      class_name: "ET-1A"
    }
  ],
  submissions: [
    {
      id: "sub-1",
      assignment_id: "asg-1",
      student_id: demoProfiles.student.id,
      file_path: "submission-files/student-id/assignment-id/opdracht1.pdf",
      comment: "Eerste versie van de schakeling.",
      status: "submitted",
      submitted_at: new Date().toISOString(),
      assignment: { title: "Praktijkopdracht 1", due_date: new Date().toISOString() },
      student: { full_name: demoProfiles.student.full_name, email: demoProfiles.student.email },
      review: null
    }
  ]
};

export const demoStudentOverview: StudentOverview = {
  profile: demoProfiles.student,
  stats: [
    { label: "Mijn vakken", value: "5", helper: "Op basis van je klas en richting." },
    { label: "Open opdrachten", value: "2", helper: "Nog in te leveren deze week." },
    { label: "Feedback", value: "1", helper: "Nieuwe beoordeling beschikbaar." }
  ],
  subjects: demoTeacherOverview.subjects,
  lessons: demoTeacherOverview.lessons,
  assignments: demoTeacherOverview.assignments,
  submissions: [
    {
      id: "sub-2",
      assignment_id: "asg-1",
      student_id: demoProfiles.student.id,
      file_path: "submission-files/student-id/assignment-id/opdracht1.pdf",
      comment: "Definitieve versie.",
      status: "reviewed",
      submitted_at: new Date().toISOString(),
      assignment: { title: "Praktijkopdracht 1", due_date: new Date().toISOString() },
      student: { full_name: demoProfiles.student.full_name, email: demoProfiles.student.email },
      review: {
        id: "review-1",
        submission_id: "sub-2",
        teacher_id: demoProfiles.teacher.id,
        score: 7.5,
        feedback: "Netjes uitgewerkt. Let nog op de benaming van de componenten.",
        reviewed_at: new Date().toISOString()
      }
    }
  ]
};
