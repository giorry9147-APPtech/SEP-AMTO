import { AppShell } from "@/components/dashboard/app-shell";
import { CreateLessonForm } from "@/components/teacher/create-lesson-form";
import { createLessonAction } from "@/lib/actions/teacher";
import { isSupabaseConfigured } from "@/lib/env";
import { requireRole } from "@/lib/auth/require-role";
import { getTeacherOverview } from "@/lib/queries/teacher";

const navLinks = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/subjects", label: "Mijn vakken" },
  { href: "/teacher/lessons/new", label: "Nieuwe les" },
  { href: "/teacher/assignments/new", label: "Nieuwe opdracht" }
] as const;

export default async function NewTeacherLessonPage() {
  const profile = await requireRole(["teacher"]);
  const overview = await getTeacherOverview(profile.id);

  return (
    <AppShell
      profile={profile}
      currentPath="/teacher/lessons/new"
      title="Nieuwe les"
      description="Plaats een les, voeg uitleg toe en upload optioneel een reader of presentatie."
      navTitle="Docent"
      navSubtitle="Lessen"
      links={navLinks}
      demoMode={!isSupabaseConfigured()}
    >
      <CreateLessonForm
        classSubjects={overview.subjects.map((item) => ({
          id: item.id,
          label: `${item.subject.name} • ${item.class_room.name}`
        }))}
        action={createLessonAction}
      />
    </AppShell>
  );
}
