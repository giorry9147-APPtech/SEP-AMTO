import type { Route } from "next";
import Link from "next/link";
import type { AssignmentSummary } from "@/types/app";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

type AssignmentListProps = {
  assignments: AssignmentSummary[];
  actionLabel?: string;
  actionHref?: (assignment: AssignmentSummary) => Route;
};

export function AssignmentList({ assignments, actionLabel, actionHref }: AssignmentListProps) {
  if (!assignments.length) {
    return <EmptyState title="Geen opdrachten" description="Opdrachten van docenten verschijnen hier automatisch." />;
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <article key={assignment.id} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{assignment.title}</h3>
              <p className="text-sm text-slate-500">
                {assignment.subject_name} • {assignment.class_name}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-700">Deadline: {formatDate(assignment.due_date)}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{assignment.description || "Geen aanvullende beschrijving."}</p>
          {assignment.files?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {assignment.files.map((file) => (
                <a
                  key={file.id}
                  href={file.download_url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {file.file_name}
                </a>
              ))}
            </div>
          ) : null}
          {actionLabel && actionHref ? (
            <Link
              href={actionHref(assignment)}
              className="mt-4 inline-flex rounded-2xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700"
            >
              {actionLabel}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}
