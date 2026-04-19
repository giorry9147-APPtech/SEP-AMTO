import { AppShell } from "@/components/dashboard/app-shell";
import { CreateProgramForm } from "@/components/admin/create-program-form";
import { EmptyState } from "@/components/ui/empty-state";
import { createStudyProgramAction } from "@/lib/actions/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminOverview } from "@/lib/queries/admin";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/classes", label: "Klassen" },
  { href: "/admin/users", label: "Gebruikers" },
  { href: "/admin/programs", label: "Richtingen" },
  { href: "/admin/subjects", label: "Vakken" }
] as const;

export default async function AdminProgramsPage() {
  const profile = await requireRole(["admin"]);
  const overview = await getAdminOverview();

  return (
    <AppShell
      profile={profile}
      currentPath="/admin/programs"
      title="Studierichtingen"
      description="De AMTO-richtingen vormen de kapstok voor klassen, vakken en docenttoewijzing."
      navTitle="Beheer"
      navSubtitle="Richtingen"
      links={navLinks}
      demoMode={!isSupabaseConfigured()}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <CreateProgramForm action={createStudyProgramAction} />
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
            Studententoegang
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Richting + code + leerjaar</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Studenten kiezen eerst hun AMTO-richting, vullen de code van die richting in en gaan
            daarna direct naar leerjaar 1, 2, 3 of 4. De code hieronder is dus ook de toegangscode
            in het studentenscherm.
          </p>
          <div className="mt-6 space-y-3">
            {overview.programs.map((program) => (
              <div key={program.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-900">{program.name}</p>
                <p className="mt-1 text-sm text-slate-500">Toegangscode: {program.code}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {overview.programs.length ? (
          overview.programs.map((program) => {
            const programClasses = overview.classes.filter(
              (classRoom) => classRoom.study_program.code === program.code
            );
            const years = Array.from(
              new Set(programClasses.map((classRoom) => classRoom.year_level))
            ).sort((a, b) => a - b);

            return (
              <article key={program.id} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{program.code}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{program.name}</h3>
                <p className="mt-3 text-sm text-slate-600">
                  {programClasses.length} gekoppelde klassen
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {years.length ? (
                    years.map((year) => (
                      <span
                        key={year}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                      >
                        Leerjaar {year}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      Nog geen leerjaren gekoppeld
                    </span>
                  )}
                </div>
                <div className="mt-5 space-y-2">
                  {programClasses.length ? (
                    programClasses.map((classRoom) => (
                      <div key={classRoom.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="font-medium text-slate-900">{classRoom.name}</p>
                        <p className="text-sm text-slate-500">
                          Leerjaar {classRoom.year_level} - cohort {classRoom.cohort_year}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="Nog geen klassen"
                      description="Maak eerst een klas aan voor deze richting."
                    />
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <EmptyState title="Geen richtingen" description="Voeg een studierichting toe om klassen te kunnen structureren." />
        )}
      </section>
    </AppShell>
  );
}
