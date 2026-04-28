import { formatDate } from "@/lib/utils";
import type { SubmissionWithReview } from "@/types/app";
import { StatusBadge } from "@/components/ui/status-badge";

type SubmissionListProps = {
  submissions: SubmissionWithReview[];
  action?: (formData: FormData) => Promise<void>;
};

export function SubmissionList({ submissions, action }: SubmissionListProps) {
  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <article key={submission.id} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{submission.student.full_name}</h3>
              <p className="text-sm text-slate-500">{submission.assignment.title}</p>
              <p className="mt-2 text-sm text-slate-600">
                Ingeleverd op {formatDate(submission.submitted_at)}
              </p>
              {submission.comment ? <p className="mt-2 text-sm text-slate-600">{submission.comment}</p> : null}
              {submission.file_url ? (
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Ingeleverd bestand openen
                </a>
              ) : null}
            </div>
            <StatusBadge variant={submission.status === "reviewed" ? "success" : "warning"}>
              {submission.status}
            </StatusBadge>
          </div>
          {action ? (
            <form action={action} className="mt-4 grid gap-4 md:grid-cols-3">
              <input type="hidden" name="submission_id" value={submission.id} />
              <input type="hidden" name="assignment_id" value={submission.assignment_id} />
              <select name="status" defaultValue={submission.status} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                <option value="submitted">submitted</option>
                <option value="reviewed">reviewed</option>
                <option value="late">late</option>
              </select>
              <input name="score" defaultValue={submission.review?.score ?? ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Score" />
              <button type="submit" className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
                Review opslaan
              </button>
              <textarea name="feedback" rows={3} defaultValue={submission.review?.feedback ?? ""} className="md:col-span-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Feedback voor de student" />
            </form>
          ) : null}
        </article>
      ))}
    </div>
  );
}
