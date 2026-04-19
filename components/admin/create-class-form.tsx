type CreateClassFormProps = {
  programs: Array<{ id: string; name: string }>;
  action: (formData: FormData) => Promise<void>;
};

export function CreateClassForm({ programs, action }: CreateClassFormProps) {
  return (
    <form action={action} className="grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Klasnaam</label>
        <input name="name" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="ET-1A" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Studierichting</label>
        <select name="study_program_id" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Leerjaar</label>
        <input name="year_level" type="number" min="1" max="4" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Cohortjaar</label>
        <input name="cohort_year" type="number" min="2024" max="2035" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
          Klas opslaan
        </button>
      </div>
    </form>
  );
}
