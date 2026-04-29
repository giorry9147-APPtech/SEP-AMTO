import type { Route } from "next";
import { AppShell } from "@/components/dashboard/app-shell";
import { AssignmentList } from "@/components/student/assignment-list";
import { LessonList } from "@/components/student/lesson-list";
import { EmptyState } from "@/components/ui/empty-state";
import { getProfile } from "@/lib/auth/get-profile";
import { getStudentOverview } from "@/lib/queries/student";
import { getTeacherOverview } from "@/lib/queries/teacher";
import {
  filterStudentOverviewBySelection,
  getFallbackStudentSelection
} from "@/lib/student-access";
import { getStudentSelection } from "@/lib/student-access-server";

export default async function SubjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile();

  if (!profile) {
    return <EmptyState title="Geen toegang" description="Log in om deze vakpagina te bekijken." />;
  }

  const isTeacher = profile.role === "teacher";
  const teacherOverview = isTeacher ? await getTeacherOverview(profile.id) : null;
  const rawStudentOverview = !isTeacher ? await getStudentOverview(profile.id) : null;
  const studentSelection = !isTeacher ? await getStudentSelection(undefined, profile.id) : null;
  const filteredStudentOverview =
    rawStudentOverview && studentSelection
      ? filterStudentOverviewBySelection(rawStudentOverview, studentSelection)
      : null;
  const resolvedStudentSelection = rawStudentOverview
    ? filteredStudentOverview && filteredStudentOverview.subjects.length
      ? studentSelection
      : getFallbackStudentSelection(rawStudentOverview)
    : null;
  const studentOverview =
    rawStudentOverview && resolvedStudentSelection
      ? filterStudentOverviewBySelection(rawStudentOverview, resolvedStudentSelection)
      : rawStudentOverview;
  const subject = isTeacher
    ? teacherOverview?.subjects.find((item) => item.id === id)
    : studentOverview?.subjects.find((item) => item.id === id);

  const lessons = isTeacher ? teacherOverview?.lessons ?? [] : studentOverview?.lessons ?? [];
  const assignments = (isTeacher ? teacherOverview?.assignments : studentOverview?.assignments)?.filter(
    (item) => item.class_subject_id === id
  ) ?? [];

  const links = (profile.role === "teacher"
    ? [
        { href: "/teacher", label: "Dashboard" },
        { href: "/teacher/subjects", label: "Mijn vakken" },
        { href: "/teacher/grades", label: "Cijfers" },
        { href: "/teacher/lessons/new", label: "Nieuwe les" },
        { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
      ]
    : [
        { href: "/student", label: "Kies richting" },
        { href: "/student/portal", label: "Dashboard" },
        { href: "/student/assignments", label: "Opdrachten" },
        { href: "/student/submissions", label: "Mijn inzendingen" },
        { href: "/student/results", label: "Mijn resultaten" }
      ]) as ReadonlyArray<{ href: Route; label: string }>;

  return (
    <AppShell
      profile={profile}
      currentPath={profile.role === "teacher" ? "/teacher/subjects" : "/student/portal"}
      title={subject ? subject.subject.name : "Vakdetail"}
      description="Lessen, bestanden en opdrachten op één overzichtelijke plek."
      navTitle={profile.role === "teacher" ? "Docent" : "Student"}
      navSubtitle="Vakdetail"
      links={links}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <LessonList lessons={lessons.filter((lesson) => lesson.class_subject_id === id)} />
        <div>
          {assignments.length ? (
            <AssignmentList
              assignments={assignments}
              actionLabel={isTeacher ? "Bekijk submissions" : undefined}
              actionHref={
                isTeacher
                  ? (assignment) => `/teacher/submissions/${assignment.id}` as Route
                  : undefined
              }
            />
          ) : (
            <EmptyState title="Nog geen opdrachten" description="Er zijn nog geen opdrachten voor dit vak." />
          )}
        </div>
      </div>
    </AppShell>
  );
}
