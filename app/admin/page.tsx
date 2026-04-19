import Link from "next/link";
import type { Route } from "next";
import { AppShell } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
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
    title: "Cijfers en uploads",
    description: "Voorbereide plek voor later: admin kan hier cijfers beheren en bestanden volgen.",
    href: "/admin/subjects"
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
      description="Beheer vanaf hier gebruikers, klassen, vakken en straks ook cijfers en uploads."
      navTitle="Beheer"
      navSubtitle="Admin portal"
      links={navLinks}
      demoMode={!isSupabaseConfigured()}
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
