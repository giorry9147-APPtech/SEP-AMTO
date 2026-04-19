type CreateProgramFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export function CreateProgramForm({ action }: CreateProgramFormProps) {
  return (
    <form action={action} className="grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Naam van richting</label>
        <input
          name="name"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          placeholder="Bijv. Bouwkunde"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Code / studenttoegang</label>
        <input
          name="code"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase"
          placeholder="Bijv. BOUW"
        />
      </div>
      <div className="md:col-span-2">
        <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm leading-6 text-brand-700">
          Deze code wordt ook gebruikt in het studentenscherm bij het kiezen van een richting.
        </p>
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
          Richting opslaan
        </button>
      </div>
    </form>
  );
}
