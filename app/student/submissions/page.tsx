import { AppShell } from "@/components/dashboard/app-shell";
import { UploadSubmissionForm } from "@/components/student/upload-submission-form";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { uploadSubmissionAction } from "@/lib/actions/student";
import { formatDate } from "@/lib/utils";
import { requireRole } from "@/lib/auth/require-role";
import { getStudentOverview } from "@/lib/queries/student";
import {
  filterStudentOverviewBySelection,
  getFallbackStudentSelection
} from "@/lib/student-access";
import { getStudentSelection } from "@/lib/student-access-server";

const navLinks = [
  { href: "/student", label: "Kies richting" },
  { href: "/student/portal", label: "Dashboard" },
  { href: "/student/assignments", label: "Opdrachten" },
  { href: "/student/submissions", label: "Mijn inzendingen" },
  { href: "/student/results", label: "Mijn resultaten" }
] as const;

export const dynamic = "force-dynamic";

export default async function StudentSubmissionsPage() {
  const profile = await requireRole(["student"]);
  const rawOverview = await getStudentOverview(profile.id);
  const selection = await getStudentSelection(undefined, profile.id);
  const filteredOverview = selection
    ? filterStudentOverviewBySelection(rawOverview, selection)
    : null;
  const fallbackSelection = getFallbackStudentSelection(rawOverview);
  const resolvedSelection =
    filteredOverview && filteredOverview.subjects.length
      ? selection
      : fallbackSelection;

  if (!resolvedSelection) {
    return (
      <AppShell
        profile={profile}
        currentPath="/student/submissions"
        title="Mijn inzendingen"
        description="Kies eerst je richting en leerjaar om je inzendingen te openen."
        navTitle="Student"
        navSubtitle="Inzendingen"
        links={navLinks}
      >
        <EmptyState
          title="Nog geen richting gekozen"
          description="Ga eerst naar 'Kies richting' en open daarna je inzendingen."
        />
      </AppShell>
    );
  }

  const overview = filterStudentOverviewBySelection(rawOverview, resolvedSelection);

  return (
    <AppShell
      profile={profile}
      currentPath="/student/submissions"
      title={`${resolvedSelection.program.name} inzendingen`}
      description={`Lever werk in voor leerjaar ${resolvedSelection.yearLevel} en volg de beoordeling van je docent.`}
      navTitle="Student"
      navSubtitle="Inzendingen"
      links={navLinks}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <UploadSubmissionForm
          assignments={overview.assignments.map((assignment) => ({ id: assignment.id, title: assignment.title }))}
          action={uploadSubmissionAction}
        />
        <section className="space-y-4">
          {overview.submissions.length ? (
            overview.submissions.map((submission) => (
              <article key={submission.id} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{submission.assignment.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">Ingeleverd op {formatDate(submission.submitted_at)}</p>
                    {submission.review?.score !== null && submission.review?.score !== undefined ? (
                      <p className="mt-2 text-sm font-medium text-slate-700">
                        Score: {submission.review.score}
                      </p>
                    ) : null}
                    {submission.review?.feedback ? (
                      <p className="mt-3 text-sm leading-6 text-slate-600">{submission.review.feedback}</p>
                    ) : null}
                    {submission.file_url ? (
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        Mijn bestand openen
                      </a>
                    ) : null}
                  </div>
                  <StatusBadge variant={submission.status === "reviewed" ? "success" : "warning"}>
                    {submission.status}
                  </StatusBadge>
                </div>
              </article>
            ))
          ) : (
            <EmptyState title="Nog geen inzendingen" description="Je ingediende opdrachten verschijnen hier." />
          )}
        </section>
      </div>
    </AppShell>
  );
}
