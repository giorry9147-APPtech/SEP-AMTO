import { formatDate } from "@/lib/utils";
import type { LessonWithFiles } from "@/types/app";
import { EmptyState } from "@/components/ui/empty-state";

type LessonListProps = {
  lessons: LessonWithFiles[];
};

export function LessonList({ lessons }: LessonListProps) {
  if (!lessons.length) {
    return <EmptyState title="Nog geen lessen" description="Zodra een docent materiaal publiceert, verschijnt het hier." />;
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <article key={lesson.id} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{formatDate(lesson.created_at)}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{lesson.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{lesson.content || "Geen extra lesomschrijving."}</p>
          {lesson.files.length ? (
            <ul className="mt-4 space-y-2 text-sm text-brand-700">
              {lesson.files.map((file) => (
                <li key={file.id}>
                  {file.download_url ? (
                    <a
                      href={file.download_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
                    >
                      {file.file_name}
                    </a>
                  ) : (
                    <span className="text-slate-500">{file.file_name}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
