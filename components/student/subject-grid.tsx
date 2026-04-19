import type { Route } from "next";
import Link from "next/link";
import type { AssignmentSummary, LessonWithFiles, SubjectWithTeacher } from "@/types/app";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

type SubjectGridProps = {
  subjects: SubjectWithTeacher[];
  lessons: LessonWithFiles[];
  assignments: AssignmentSummary[];
};

export function SubjectGrid({ subjects, lessons, assignments }: SubjectGridProps) {
  if (!subjects.length) {
    return (
      <EmptyState
        title="Nog geen vakken"
        description="Zodra een vak aan jouw klas is gekoppeld, verschijnt het hier als een apart blok."
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Mijn vakken</h3>
          <p className="mt-1 text-sm text-slate-600">
            Open een vak om alle lessen, bestanden en opdrachten van dat vak te bekijken.
          </p>
        </div>
        <StatusBadge variant="info">{subjects.length}</StatusBadge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => {
          const lessonCount = lessons.filter((lesson) => lesson.class_subject_id === subject.id).length;
          const assignmentCount = assignments.filter((assignment) => assignment.class_subject_id === subject.id).length;

          return (
            <Link
              key={subject.id}
              href={`/subject/${subject.id}` as Route}
              className="group rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                    {subject.class_room.name}
                  </p>
                  <h4 className="mt-3 text-xl font-semibold text-slate-950">
                    {subject.subject.name}
                  </h4>
                </div>
                <StatusBadge
                  variant={subject.subject.subject_type === "vocational" ? "warning" : "info"}
                >
                  {subject.subject.subject_type}
                </StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Docent: {subject.teacher.full_name}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Lessen
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{lessonCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Opdrachten
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{assignmentCount}</p>
                </div>
              </div>
              <p className="mt-5 inline-flex text-sm font-medium text-brand-700 group-hover:text-brand-800">
                Open vak
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
