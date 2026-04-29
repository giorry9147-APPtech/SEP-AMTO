import { AppShell } from "@/components/dashboard/app-shell";
import Link from "next/link";
import { UserDirectory } from "@/components/admin/user-directory";
import { deleteManagedUserAction } from "@/lib/actions/admin";
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

export default async function AdminUsersPage() {
  const profile = await requireRole(["admin"]);
  const overview = await getAdminOverview();

  return (
    <AppShell
      profile={profile}
      currentPath="/admin/users"
      title="Gebruikers"
      description="Overzicht van admins, docenten en studenten. Voor de MVP worden accounts via Supabase Auth beheerd."
      navTitle="Beheer"
      navSubtitle="Gebruikers"
      links={navLinks}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
            Nieuwe docent
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Docenten apart aanmaken</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Open een aparte pagina om alleen docentaccounts toe te voegen, zonder studentvelden ertussen.
          </p>
          <Link
            href="/admin/users/teachers/new"
            prefetch={false}
            className="mt-6 inline-flex rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white"
          >
            Docent aanmaken
          </Link>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
            Nieuwe student
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Studenten apart aanmaken</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Open een aparte pagina om alleen studentaccounts toe te voegen en sneller door te werken.
          </p>
          <Link
            href="/admin/users/students/new"
            prefetch={false}
            className="mt-6 inline-flex rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white"
          >
            Student aanmaken
          </Link>
        </section>
      </div>
      <UserDirectory users={overview.users} deleteUserAction={deleteManagedUserAction} />
    </AppShell>
  );
}
