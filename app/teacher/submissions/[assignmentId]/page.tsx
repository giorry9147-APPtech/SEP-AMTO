import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { SubmissionList } from "@/components/teacher/submission-list";
import { reviewSubmissionAction } from "@/lib/actions/teacher";
import { isSupabaseConfigured } from "@/lib/env";
import { requireRole } from "@/lib/auth/require-role";
import { getTeacherOverview } from "@/lib/queries/teacher";

const navLinks = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/subjects", label: "Mijn vakken" },
  { href: "/teacher/lessons/new", label: "Nieuwe les" },
  { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
] as const;

export default async function TeacherSubmissionsPage({
  params
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const profile = await requireRole(["teacher"]);
  const overview = await getTeacherOverview(profile.id);
  const { assignmentId } = await params;
  const filtered = overview.submissions.filter((item) => item.assignment_id === assignmentId);

  return (
    <AppShell
      profile={profile}
      currentPath="/teacher"
      title="Submissions bekijken"
      description="Bekijk per opdracht welke studenten hebben ingeleverd en geef status of feedback."
      navTitle="Docent"
      navSubtitle="Review"
      links={navLinks}
      demoMode={!isSupabaseConfigured()}
    >
      {filtered.length ? (
        <SubmissionList submissions={filtered} action={reviewSubmissionAction} />
      ) : (
        <EmptyState title="Nog geen inzendingen" description="Er zijn nog geen submissions voor deze opdracht." />
      )}
    </AppShell>
  );
}
