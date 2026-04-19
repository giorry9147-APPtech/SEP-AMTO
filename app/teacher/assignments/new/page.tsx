import { AppShell } from "@/components/dashboard/app-shell";
import { CreateAssignmentForm } from "@/components/teacher/create-assignment-form";
import { createAssignmentAction } from "@/lib/actions/teacher";
import { requireRole } from "@/lib/auth/require-role";
import { getTeacherOverview } from "@/lib/queries/teacher";

const navLinks = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/subjects", label: "Mijn vakken" },
  { href: "/teacher/lessons/new", label: "Nieuwe les" },
  { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
] as const;

export default async function NewTeacherAssignmentPage() {
  const profile = await requireRole(["teacher"]);
  const overview = await getTeacherOverview(profile.id);

  return (
    <AppShell
      profile={profile}
      currentPath="/teacher/assignments/new"
      title="Nieuwe opdracht"
      description="Maak een opdracht aan die direct zichtbaar wordt voor studenten binnen het gekozen vak."
      navTitle="Docent"
      navSubtitle="Opdrachten"
      links={navLinks}
    >
      <CreateAssignmentForm
        classSubjects={overview.subjects.map((item) => ({
          id: item.id,
          label: `${item.subject.name} • ${item.class_room.name}`
        }))}
        action={createAssignmentAction}
      />
    </AppShell>
  );
}
