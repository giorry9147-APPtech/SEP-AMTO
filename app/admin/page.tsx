import Link from "next/link";
import type { Route } from "next";
import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminOverview } from "@/lib/queries/admin";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/classes", label: "Klassen" },
  { href: "/admin/users", label: "Gebruikers" },
  { href: "/admin/programs", label: "Richtingen" },
  { href: "/admin/subjects", label: "Vakken" },
  { href: "/admin/grades", label: "Cijfers" },
  { href: "/admin/lists", label: "Lijsten" }
] as const;

const managementCards = [
  {
    title: "Docenten en studenten",
    description: "Maak accounts aan en beheer welke rol iemand in het portaal heeft.",
    href: "/admin/users"
  },
  {
    title: "Klassenbeheer",
    description: "Maak klassen aan en koppel studenten aan de juiste richting en jaarlaag.",
    href: "/admin/classes"
  },
  {
    title: "Vakken koppelen",
    description: "Voeg vakken toe en wijs ze direct toe aan een klas met een docent.",
    href: "/admin/subjects"
  },
  {
    title: "Cijfers beheren",
    description: "Voer cijfers in of bewerk ze per klas en vak. Studenten zien wijzigingen direct in hun resultaten.",
    href: "/admin/grades"
  }
] as const;

const statActionMap: Record<string, { href: Route; label: string }> = {
  Studenten: { href: "/admin/users/students/new", label: "Student aanmaken" },
  Docenten: { href: "/admin/users/teachers/new", label: "Docent aanmaken" },
  Klassen: { href: "/admin/classes", label: "Klassen beheren" },
  Vakken: { href: "/admin/subjects", label: "Vakken beheren" }
};

export default async function AdminPage() {
  const profile = await requireRole(["admin"]);
  const overview = await getAdminOverview();

  return (
    <AppShell
      profile={profile}
      currentPath="/admin"
      title="Admin dashboard"
      description="Beheer vanaf hier gebruikers, klassen, vakken en cijfers."
      navTitle="Beheer"
      navSubtitle="Admin portal"
      links={navLinks}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            actionHref={statActionMap[stat.label]?.href}
            actionLabel={statActionMap[stat.label]?.label}
          />
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950">Studierichtingen</h3>
          <Link href="/admin/programs" className="text-sm font-medium text-brand-600 hover:underline">
            Beheren
          </Link>
        </div>
        {overview.programs.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {overview.programs.map((program) => (
              <div key={program.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">{program.code}</p>
                <p className="mt-1 font-medium text-slate-900">{program.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState title="Nog geen richtingen" description="Maak een studierichting aan via Richtingen beheren." />
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {managementCards.map((card) => (
          <article key={card.title} className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-panel">
            <h3 className="text-xl font-semibold text-slate-950">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
            <Link
              href={card.href}
              prefetch={false}
              className="mt-6 inline-flex rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white"
            >
              Openen
            </Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
