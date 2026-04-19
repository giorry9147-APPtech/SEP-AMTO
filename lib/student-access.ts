import type { StudentOverview, StudentProgramOption } from "@/types/app";

export type StudentSelection = {
  program: StudentProgramOption;
  yearLevel: 1 | 2 | 3 | 4;
};

export function getStudentProgramDescription(program: StudentProgramOption) {
  return program.description?.trim() || `Open het portaal voor ${program.name} met code ${program.code}.`;
}

export function filterStudentOverviewBySelection(
  overview: StudentOverview,
  selection: StudentSelection
): StudentOverview {
  const subjects = overview.subjects.filter(
    (subject) =>
      subject.class_room.year_level === selection.yearLevel &&
      (subject.class_room.study_program?.id === selection.program.id ||
        subject.class_room.study_program?.code === selection.program.code)
  );

  const subjectIds = new Set(subjects.map((subject) => subject.id));

  const lessons = overview.lessons.filter((lesson) => subjectIds.has(lesson.class_subject_id));
  const assignments = overview.assignments.filter((assignment) =>
    subjectIds.has(assignment.class_subject_id)
  );
  const assignmentIds = new Set(assignments.map((assignment) => assignment.id));
  const submissions = overview.submissions.filter((submission) =>
    assignmentIds.has(submission.assignment_id)
  );

  return {
    ...overview,
    subjects,
    lessons,
    assignments,
    submissions,
    stats: [
      {
        label: "Richting",
        value: selection.program.code,
        helper: `${selection.program.name} leerjaar ${selection.yearLevel}.`
      },
      {
        label: "Vakken",
        value: String(subjects.length),
        helper: "Vakken binnen jouw gekozen leerjaar."
      },
      {
        label: "Opdrachten",
        value: String(assignments.length),
        helper: "Beschikbare opdrachten voor deze richting."
      }
    ]
  };
}

export function getFallbackStudentSelection(overview: StudentOverview): StudentSelection | null {
  const subject = overview.subjects[0];
  const program = subject?.class_room.study_program;
  const yearLevel = subject?.class_room.year_level;

  if (!program || ![1, 2, 3, 4].includes(yearLevel)) {
    return null;
  }

  return {
    program: {
      id: program.id,
      name: program.name,
      code: program.code
    },
    yearLevel: yearLevel as 1 | 2 | 3 | 4
  };
}
