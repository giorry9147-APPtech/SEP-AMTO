import Link from "next/link";
import type { Route } from "next";
import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth/require-role";
import { getTeacherClassSubjects } from "@/lib/queries/grades";

const navLinks = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/subjects", label: "Mijn vakken" },
  { href: "/teacher/grades", label: "Cijfers" },
  { href: "/teacher/lessons/new", label: "Nieuwe les" },
  { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
] as const;

export default async function TeacherGradesIndexPage() {
  const profile = await requireRole(["teacher"]);
  const classSubjects = await getTeacherClassSubjects(profile.id);

  return (
    <AppShell
      profile={profile}
      currentPath="/teacher/grades"
      title="Cijfers beheren"
      description="Kies een vak om cijfers in te voeren, te wijzigen of te verwijderen voor je studenten."
      navTitle="Docent"
      navSubtitle="Cijfers"
      links={navLinks}
    >
      {classSubjects.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classSubjects.map((cs) => (
            <article
              key={cs.id}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                  {cs.program_code || cs.program_name} · leerjaar {cs.year_level}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">{cs.subject_name}</h3>
                <p className="text-sm text-slate-500">{cs.class_name}</p>
              </div>
              <Link
                href={`/teacher/grades/${cs.id}` as Route}
                className="inline-flex w-fit rounded-2xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Open cijferlijst
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Nog geen vakken"
          description="Een admin moet eerst een vak aan jou koppelen voordat je cijfers kunt invoeren."
        />
      )}
    </AppShell>
  );
}
