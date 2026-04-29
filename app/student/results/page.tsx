import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { GRADE_TYPE_LABELS, calculateWeightedAverage, formatGrade } from "@/lib/grades";
import { requireRole } from "@/lib/auth/require-role";
import { getStudentResults } from "@/lib/queries/grades";
import { getStudentSelection } from "@/lib/student-access-server";

const navLinks = [
  { href: "/student", label: "Kies richting" },
  { href: "/student/portal", label: "Dashboard" },
  { href: "/student/assignments", label: "Opdrachten" },
  { href: "/student/submissions", label: "Mijn inzendingen" },
  { href: "/student/results", label: "Mijn resultaten" }
] as const;

export const dynamic = "force-dynamic";

export default async function StudentResultsPage() {
  const profile = await requireRole(["student"]);
  const selection = await getStudentSelection(undefined, profile.id);
  const allResults = await getStudentResults(profile.id);

  const filtered = selection
    ? allResults.filter((entry) => entry.year_level === selection.yearLevel)
    : allResults;

  const overallAverage = calculateWeightedAverage(
    filtered.flatMap((entry) =>
      entry.grades.map((grade) => ({
        score: Number(grade.score),
        weight: Number(grade.weight)
      }))
    )
  );

  const totalGrades = filtered.reduce((sum, entry) => sum + entry.grades.length, 0);

  return (
    <AppShell
      profile={profile}
      currentPath="/student/results"
      title="Mijn resultaten"
      description={
        selection
          ? `Cijferoverzicht voor ${selection.program.name} leerjaar ${selection.yearLevel}.`
          : "Cijferoverzicht van al je vakken."
      }
      navTitle="Student"
      navSubtitle="Resultaten"
      links={navLinks}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
            Gewogen gemiddelde
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {formatGrade(overallAverage)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Berekend over {totalGrades} {totalGrades === 1 ? "cijfer" : "cijfers"}.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Vakken</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{filtered.length}</p>
          <p className="mt-1 text-xs text-slate-500">
            Vakken waar je in dit leerjaar cijfers voor kunt zien.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Cijfers</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalGrades}</p>
          <p className="mt-1 text-xs text-slate-500">
            Totaal aantal ingevoerde cijfers door je docenten.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            title="Nog geen vakken voor jouw leerjaar"
            description="Zodra een docent jou cijfers geeft of een vak gekoppeld wordt aan jouw klas verschijnen ze hier."
          />
        ) : (
          filtered.map((entry) => (
            <article
              key={entry.class_subject_id}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{entry.subject_name}</h3>
                  <p className="text-sm text-slate-500">
                    {entry.class_name} · leerjaar {entry.year_level} · docent {entry.teacher_name}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm">
                  <span className="text-slate-500">Gemiddeld: </span>
                  <span className="font-semibold text-slate-900">{formatGrade(entry.average)}</span>
                </div>
              </div>
              {entry.grades.length ? (
                <ul className="mt-4 space-y-2">
                  {entry.grades.map((grade) => (
                    <li
                      key={grade.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {grade.title}{" "}
                          <span className="text-xs font-normal text-slate-500">
                            · {GRADE_TYPE_LABELS[grade.grade_type]} · weging {formatGrade(Number(grade.weight))}
                          </span>
                        </p>
                        {grade.comment ? (
                          <p className="mt-1 text-xs text-slate-500">{grade.comment}</p>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                        {formatGrade(Number(grade.score))}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Nog geen cijfers ingevoerd voor dit vak.</p>
              )}
            </article>
          ))
        )}
      </section>
    </AppShell>
  );
}
