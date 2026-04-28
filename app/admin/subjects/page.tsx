import { AppShell } from "@/components/dashboard/app-shell";
import { AssignSubjectForm } from "@/components/admin/assign-subject-form";
import { CreateSubjectForm } from "@/components/admin/create-subject-form";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { assignSubjectToClassAction, createSubjectAction, deleteSubjectAction } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminOverview } from "@/lib/queries/admin";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/classes", label: "Klassen" },
  { href: "/admin/users", label: "Gebruikers" },
  { href: "/admin/programs", label: "Richtingen" },
  { href: "/admin/subjects", label: "Vakken" }
] as const;

export default async function AdminSubjectsPage() {
  const profile = await requireRole(["admin"]);
  const overview = await getAdminOverview();

  return (
    <AppShell
      profile={profile}
      currentPath="/admin/subjects"
      title="Vakken"
      description="Algemene en beroepsgerichte vakken die later aan klassen worden gekoppeld."
      navTitle="Beheer"
      navSubtitle="Vakken"
      links={navLinks}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <CreateSubjectForm action={createSubjectAction} />
        <AssignSubjectForm
          classes={overview.classes.map((item) => ({ id: item.id, name: item.name }))}
          subjects={overview.subjects.map((item) => ({ id: item.id, name: item.name }))}
          teachers={overview.users
            .filter((user) => user.role === "teacher")
            .map((user) => ({ id: user.id, full_name: user.full_name }))}
          action={assignSubjectToClassAction}
        />
      </div>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <div className="space-y-3">
          {overview.subjects.length ? (
            overview.subjects.map((subject) => (
              <div key={subject.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{subject.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge variant={subject.subject_type === "vocational" ? "warning" : "info"}>
                    {subject.subject_type}
                  </StatusBadge>
                  <DeleteResourceForm
                    action={deleteSubjectAction}
                    id={subject.id}
                    label={subject.name}
                    resourceName="vak"
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Nog geen vakken" description="Vakken verschijnen hier zodra ze zijn toegevoegd." />
          )}
        </div>
      </section>
    </AppShell>
  );
}
