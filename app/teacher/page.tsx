import type { Route } from "next";
import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { AssignmentList } from "@/components/student/assignment-list";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth/require-role";
import { getTeacherOverview } from "@/lib/queries/teacher";

const navLinks = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/subjects", label: "Mijn vakken" },
  { href: "/teacher/grades", label: "Cijfers" },
  { href: "/teacher/lessons/new", label: "Nieuwe les" },
  { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
] as const;

export default async function TeacherPage() {
  const profile = await requireRole(["teacher"]);
  const overview = await getTeacherOverview(profile.id);

  return (
    <AppShell
      profile={profile}
      currentPath="/teacher"
      title="Docent dashboard"
      description="Werk vanuit één plek aan je vakken, lessen, opdrachten en beoordelingen."
      navTitle="Docent"
      navSubtitle="Mijn vakken"
      links={navLinks}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {overview.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <h3 className="text-lg font-semibold text-slate-950">Te beoordelen inzendingen</h3>
        <div className="mt-4 space-y-3">
          {overview.submissions.length ? (
            overview.submissions.map((submission) => (
              <div key={submission.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-900">{submission.student?.full_name ?? "Onbekend"}</p>
                <p className="text-sm text-slate-500">{submission.assignment?.title ?? "Opdracht"}</p>
              </div>
            ))
          ) : (
            <EmptyState title="Geen openstaande inzendingen" description="Nieuwe inzendingen van studenten verschijnen hier." />
          )}
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <h3 className="text-lg font-semibold text-slate-950">Mijn opdrachten</h3>
        <div className="mt-4">
          <AssignmentList
            assignments={overview.assignments}
            actionLabel="Bekijk inzendingen"
            actionHref={(assignment) => `/teacher/submissions/${assignment.id}` as Route}
          />
        </div>
      </section>
    </AppShell>
  );
}
