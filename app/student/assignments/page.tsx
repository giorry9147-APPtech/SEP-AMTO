import { AppShell } from "@/components/dashboard/app-shell";
import { AssignmentList } from "@/components/student/assignment-list";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth/require-role";
import { getStudentOverview } from "@/lib/queries/student";
import {
  filterStudentOverviewBySelection,
  getFallbackStudentSelection
} from "@/lib/student-access";
import { getStudentSelection } from "@/lib/student-access-server";

const navLinks = [
  { href: "/student", label: "Kies richting" },
  { href: "/student/portal", label: "Dashboard" },
  { href: "/student/assignments", label: "Opdrachten" },
  { href: "/student/submissions", label: "Mijn inzendingen" },
  { href: "/student/results", label: "Mijn resultaten" }
] as const;

export const dynamic = "force-dynamic";

export default async function StudentAssignmentsPage() {
  const profile = await requireRole(["student"]);
  const rawOverview = await getStudentOverview(profile.id);
  const selection = await getStudentSelection(undefined, profile.id);
  const filteredOverview = selection
    ? filterStudentOverviewBySelection(rawOverview, selection)
    : null;
  const fallbackSelection = getFallbackStudentSelection(rawOverview);
  const resolvedSelection =
    filteredOverview && filteredOverview.subjects.length
      ? selection
      : fallbackSelection;

  if (!resolvedSelection) {
    return (
      <AppShell
        profile={profile}
        currentPath="/student/assignments"
        title="Mijn opdrachten"
        description="Kies eerst je richting en leerjaar om opdrachten te openen."
        navTitle="Student"
        navSubtitle="Opdrachten"
        links={navLinks}
      >
        <EmptyState
          title="Nog geen richting gekozen"
          description="Ga eerst naar 'Kies richting' en open daarna je opdrachten."
        />
      </AppShell>
    );
  }

  const overview = filterStudentOverviewBySelection(rawOverview, resolvedSelection);

  return (
    <AppShell
      profile={profile}
      currentPath="/student/assignments"
      title={`${resolvedSelection.program.name} opdrachten`}
      description={`Opdrachten voor leerjaar ${resolvedSelection.yearLevel} binnen ${resolvedSelection.program.name}.`}
      navTitle="Student"
      navSubtitle="Opdrachten"
      links={navLinks}
    >
      <AssignmentList assignments={overview.assignments} />
    </AppShell>
  );
}
