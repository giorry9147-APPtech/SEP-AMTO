import { AppShell } from "@/components/dashboard/app-shell";
import { ClassSubjectPicker } from "@/components/admin/class-subject-picker";
import { Gradebook } from "@/components/grades/gradebook";
import { EmptyState } from "@/components/ui/empty-state";
import { adminDeleteGradeAction, adminUpsertGradeAction } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminGradesData } from "@/lib/queries/grades";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/classes", label: "Klassen" },
  { href: "/admin/users", label: "Gebruikers" },
  { href: "/admin/programs", label: "Richtingen" },
  { href: "/admin/subjects", label: "Vakken" },
  { href: "/admin/grades", label: "Cijfers" },
  { href: "/admin/lists", label: "Lijsten" }
] as const;

export const dynamic = "force-dynamic";

export default async function AdminGradesPage({
  searchParams
}: {
  searchParams: Promise<{ cs?: string }>;
}) {
  const profile = await requireRole(["admin"]);
  const { cs } = await searchParams;
  const data = await getAdminGradesData(cs ?? null);

  return (
    <AppShell
      profile={profile}
      currentPath="/admin/grades"
      title="Cijfers beheren"
      description="Bekijk en bewerk cijfers voor elke klas en elk vak. Handig als vangnet voor docenten."
      navTitle="Beheer"
      navSubtitle="Cijfers"
      links={navLinks}
    >
      {data.classSubjects.length === 0 ? (
        <EmptyState
          title="Nog geen vakken gekoppeld"
          description="Koppel eerst vakken aan klassen via 'Vakken' voordat je cijfers kunt invoeren."
        />
      ) : (
        <>
          <ClassSubjectPicker
            classSubjects={data.classSubjects}
            selectedId={data.selectedClassSubjectId}
            basePath="/admin/grades"
          />
          {data.selectedGradebook ? (
            <Gradebook
              classSubject={data.selectedGradebook.classSubject}
              students={data.selectedGradebook.students}
              upsertAction={adminUpsertGradeAction}
              deleteAction={adminDeleteGradeAction}
              intro="Als admin kun je cijfers van elke docent toevoegen of bijwerken. De student ziet wijzigingen direct."
            />
          ) : (
            <EmptyState
              title="Kies een vak"
              description="Selecteer een vak hierboven om de cijferlijst te openen."
            />
          )}
        </>
      )}
    </AppShell>
  );
}
