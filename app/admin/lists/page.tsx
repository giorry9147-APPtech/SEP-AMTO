import { AppShell } from "@/components/dashboard/app-shell";
import { AdminListsView } from "@/components/admin/admin-lists-view";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminLists } from "@/lib/queries/admin";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/classes", label: "Klassen" },
  { href: "/admin/users", label: "Gebruikers" },
  { href: "/admin/programs", label: "Richtingen" },
  { href: "/admin/subjects", label: "Vakken" },
  { href: "/admin/grades", label: "Cijfers" },
  { href: "/admin/lists", label: "Lijsten" }
] as const;

export default async function AdminListsPage() {
  const profile = await requireRole(["admin"]);
  const data = await getAdminLists();

  return (
    <AppShell
      profile={profile}
      currentPath="/admin/lists"
      title="Overzichtslijsten"
      description="Bekijk klassenlijsten, docentenrooster en studentenoverzicht met filters."
      navTitle="Beheer"
      navSubtitle="Admin portal"
      links={navLinks}
    >
      <AdminListsView data={data} />
    </AppShell>
  );
}
