import Link from "next/link";
import { AppShell } from "@/components/dashboard/app-shell";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { createManagedUserAction } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/require-role";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/classes", label: "Klassen" },
  { href: "/admin/users", label: "Gebruikers" },
  { href: "/admin/programs", label: "Richtingen" },
  { href: "/admin/subjects", label: "Vakken" }
] as const;

export default async function AdminNewTeacherPage() {
  const profile = await requireRole(["admin"]);

  return (
    <AppShell
      profile={profile}
      currentPath="/admin/users"
      title="Docent aanmaken"
      description="Voeg hier een docentaccount toe zonder dat studentenformulieren ertussen staan."
      navTitle="Beheer"
      navSubtitle="Gebruikers"
      links={navLinks}
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
            Docentflow
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Alleen voor docentaccounts</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Na het opslaan verschijnt de docent in de gebruikerslijst en kan die direct gekoppeld worden aan vakken.
          </p>
          <Link
            href="/admin/users"
            className="mt-6 inline-flex rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
          >
            Terug naar gebruikers
          </Link>
        </section>
        <CreateUserForm role="teacher" action={createManagedUserAction} />
      </div>
    </AppShell>
  );
}
