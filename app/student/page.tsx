import { AppShell } from "@/components/dashboard/app-shell";
import { StudentEntryGate } from "@/components/student/student-entry-gate";
import { isSupabaseConfigured } from "@/lib/env";
import { requireRole } from "@/lib/auth/require-role";
import { getStudentPrograms } from "@/lib/student-access-server";

const navLinks = [
  { href: "/student", label: "Kies richting" },
  { href: "/student/portal", label: "Dashboard" },
  { href: "/student/assignments", label: "Opdrachten" },
  { href: "/student/submissions", label: "Mijn inzendingen" }
] as const;

export const dynamic = "force-dynamic";

export default async function StudentEntryPage() {
  const profile = await requireRole(["student"]);
  const programs = await getStudentPrograms();

  return (
    <AppShell
      profile={profile}
      currentPath="/student"
      title="Studentenportaal openen"
      description="Kies eerst je studierichting, vul de code in en selecteer daarna je leerjaar."
      navTitle="Student"
      navSubtitle="Toegang"
      links={navLinks}
      demoMode={!isSupabaseConfigured()}
    >
      <StudentEntryGate programs={programs} studentId={profile.id} />
    </AppShell>
  );
}
