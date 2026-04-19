type CreateUserFormProps = {
  role: "teacher" | "student";
  action: (formData: FormData) => Promise<void>;
};

export function CreateUserForm({ role, action }: CreateUserFormProps) {
  const title = role === "teacher" ? "Docent aanmaken" : "Student aanmaken";
  const buttonLabel = role === "teacher" ? "Docent opslaan" : "Student opslaan";

  return (
    <form action={action} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <input type="hidden" name="role" value={role} />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">{title}</label>
        <input
          name="full_name"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          placeholder={role === "teacher" ? "Ir. K. Jubitana" : "Naomi Simons"}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">E-mailadres</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          placeholder={role === "teacher" ? "docent@amto.demo" : "student@amto.demo"}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Tijdelijk wachtwoord</label>
        <input
          name="password"
          defaultValue="Welkom123!"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <button type="submit" className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white">
        {buttonLabel}
      </button>
    </form>
  );
}
