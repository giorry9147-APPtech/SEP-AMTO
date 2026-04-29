import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { AssignmentList } from "@/components/student/assignment-list";
import { LessonList } from "@/components/student/lesson-list";
import { SubjectGrid } from "@/components/student/subject-grid";
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

export default async function StudentPortalPage() {
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
        currentPath="/student/portal"
        title="Student dashboard"
        description="Kies eerst je richting en leerjaar voordat we de juiste vakken voor je kunnen openen."
        navTitle="Student"
        navSubtitle="Dashboard"
        links={navLinks}
      >
        <EmptyState
          title="Kies eerst je richting"
          description="Ga eerst naar de toegangsstap om je studierichting en leerjaar te kiezen."
        />
      </AppShell>
    );
  }

  const overview = filterStudentOverviewBySelection(rawOverview, resolvedSelection);

  return (
    <AppShell
      profile={profile}
      currentPath="/student/portal"
      title={`${resolvedSelection.program.name} - leerjaar ${resolvedSelection.yearLevel}`}
      description="Je lessen en opdrachten zijn nu gefilterd op de gekozen studierichting en klaslaag."
      navTitle="Student"
      navSubtitle="Dashboard"
      links={navLinks}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {overview.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <SubjectGrid
        subjects={overview.subjects}
        lessons={overview.lessons}
        assignments={overview.assignments}
      />
      <section className="grid gap-6 xl:grid-cols-2">
        <LessonList lessons={overview.lessons} />
        <AssignmentList assignments={overview.assignments} />
      </section>
    </AppShell>
  );
}
