import { AppShell } from "@/components/dashboard/app-shell";
import { AssignStudentForm } from "@/components/admin/assign-student-form";
import { CreateClassForm } from "@/components/admin/create-class-form";
import { EmptyState } from "@/components/ui/empty-state";
import { createClassAction, assignStudentToClassAction } from "@/lib/actions/admin";
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

export default async function AdminClassesPage() {
  const profile = await requireRole(["admin"]);
  const overview = await getAdminOverview();

  return (
    <AppShell
      profile={profile}
      currentPath="/admin/classes"
      title="Klassen beheren"
      description="Maak klassen aan, koppel studierichtingen en voeg studenten toe aan de juiste groep."
      navTitle="Beheer"
      navSubtitle="Klassen"
      links={navLinks}
      demoMode={!isSupabaseConfigured()}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CreateClassForm
          programs={overview.programs.map((program) => ({ id: program.id, name: program.name }))}
          action={createClassAction}
        />
        <AssignStudentForm
          classes={overview.classes.map((item) => ({ id: item.id, name: item.name }))}
          students={overview.users.filter((user) => user.role === "student").map((user) => ({ id: user.id, full_name: user.full_name }))}
          action={assignStudentToClassAction}
        />
      </div>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
          Studententoegang
        </p>
        <h3 className="mt-3 text-lg font-semibold text-slate-950">Richting + leerjaar sturen het portaal</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          De combinatie van studierichting en leerjaar bepaalt welke vakken een student ziet nadat
          hij in het studentenscherm zijn richting, code en leerjaar kiest. Zorg dus dat elke klas
          aan de juiste richting en klaslaag hangt.
        </p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <h3 className="text-lg font-semibold text-slate-950">Bestaande klassen</h3>
        <div className="mt-4 space-y-3">
          {overview.classes.length ? (
            overview.classes.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.study_program.name} • leerjaar {item.year_level} • cohort {item.cohort_year}
                  </p>
                </div>
                <p className="text-sm text-slate-600">{item.student_count} studenten</p>
              </div>
            ))
          ) : (
            <EmptyState title="Nog geen klassen" description="De eerste klas verschijnt hier zodra je die opslaat." />
          )}
        </div>
      </section>
    </AppShell>
  );
}
