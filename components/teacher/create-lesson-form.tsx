type CreateLessonFormProps = {
  classSubjects: Array<{ id: string; label: string }>;
  action: (formData: FormData) => Promise<void>;
};

export function CreateLessonForm({ classSubjects, action }: CreateLessonFormProps) {
  const hasSubjects = classSubjects.length > 0;

  return (
    <form action={action} className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Vak</label>
        <select
          name="class_subject_id"
          required
          disabled={!hasSubjects}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:bg-slate-100"
        >
          {hasSubjects ? (
            classSubjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))
          ) : (
            <option value="">Nog geen vakken gekoppeld</option>
          )}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Titel</label>
        <input name="title" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Week 1: symbolen en schema's" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Inhoud</label>
        <textarea name="content" rows={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Lesuitleg en instructies." />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Video URL</label>
        <input name="video_url" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="https://..." />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Bestand</label>
        <input name="file" type="file" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
      </div>
      {!hasSubjects ? (
        <p className="text-sm text-slate-500">
          Een admin moet eerst een vak aan jouw account koppelen voordat je lessen kunt publiceren.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!hasSubjects}
        className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Les publiceren
      </button>
    </form>
  );
}
