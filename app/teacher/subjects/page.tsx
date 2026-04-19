import Link from "next/link";
import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireRole } from "@/lib/auth/require-role";
import { getTeacherOverview } from "@/lib/queries/teacher";

const navLinks = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/subjects", label: "Mijn vakken" },
  { href: "/teacher/lessons/new", label: "Nieuwe les" },
  { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
] as const;

export default async function TeacherSubjectsPage() {
  const profile = await requireRole(["teacher"]);
  const overview = await getTeacherOverview(profile.id);

  return (
    <AppShell
      profile={profile}
      currentPath="/teacher/subjects"
      title="Mijn vakken"
      description="Alle class_subjects waarvoor jij verantwoordelijk bent als docent."
      navTitle="Docent"
      navSubtitle="Vakoverzicht"
      links={navLinks}
    >
      <section className="grid gap-4 xl:grid-cols-2">
        {overview.subjects.length ? (
          overview.subjects.map((subject) => (
            <article key={subject.id} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{subject.subject.name}</h3>
                  <p className="text-sm text-slate-500">
                    {subject.class_room.name} • leerjaar {subject.class_room.year_level}
                  </p>
                </div>
                <StatusBadge variant={subject.subject.subject_type === "vocational" ? "warning" : "info"}>
                  {subject.subject.subject_type}
                </StatusBadge>
              </div>
              <Link href={`/subject/${subject.id}`} className="mt-4 inline-flex text-sm font-medium text-brand-700">
                Open vakpagina
              </Link>
            </article>
          ))
        ) : (
          <EmptyState title="Nog geen vakken" description="Vaktoewijzingen verschijnen hier zodra een admin ze aanmaakt." />
        )}
      </section>
    </AppShell>
  );
}
