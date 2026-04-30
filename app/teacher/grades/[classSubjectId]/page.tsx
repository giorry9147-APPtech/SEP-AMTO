import Link from "next/link";
import { AppShell } from "@/components/dashboard/app-shell";
import { Gradebook } from "@/components/grades/gradebook";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteGradeAction, upsertGradeAction } from "@/lib/actions/teacher";
import { requireRole } from "@/lib/auth/require-role";
import { getTeacherGradebook } from "@/lib/queries/grades";

const navLinks = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/subjects", label: "Mijn vakken" },
  { href: "/teacher/grades", label: "Cijfers" },
  { href: "/teacher/lessons/new", label: "Nieuwe les" },
  { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
] as const;

export default async function TeacherGradebookPage({
  params
}: {
  params: Promise<{ classSubjectId: string }>;
}) {
  const profile = await requireRole(["teacher"]);
  const { classSubjectId } = await params;
  const gradebook = await getTeacherGradebook(profile.id, classSubjectId);

  if (!gradebook) {
    return (
      <AppShell
        profile={profile}
        currentPath="/teacher/grades"
        title="Cijfers"
        description="Dit vak hoort niet bij jouw account, of bestaat niet."
        navTitle="Docent"
        navSubtitle="Cijfers"
        links={navLinks}
      >
        <EmptyState
          title="Vak niet gevonden"
          description="Dit vak hoort niet bij jouw docentaccount."
        />
        <Link href="/teacher/grades" className="mt-4 inline-flex text-sm font-medium text-brand-700">
          Terug naar overzicht
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell
      profile={profile}
      currentPath="/teacher/grades"
      title={`${gradebook.classSubject.subject_name} · ${gradebook.classSubject.class_name}`}
      description="Voer cijfers in voor je studenten of werk bestaande cijfers bij."
      navTitle="Docent"
      navSubtitle="Cijfers"
      links={navLinks}
    >
      <Link href="/teacher/grades" className="text-sm font-medium text-brand-700">
        ← Terug naar vakkenoverzicht
      </Link>
      <Gradebook
        classSubject={gradebook.classSubject}
        students={gradebook.students}
        upsertAction={upsertGradeAction}
        deleteAction={deleteGradeAction}
        intro="Studenten zien hun cijfers direct nadat je opslaat."
      />
    </AppShell>
  );
}
