"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormFeedback } from "@/components/ui/form-feedback";
import { idleFormActionState, type FormActionState } from "@/lib/actions/form-state";

type CreateSubjectFormProps = {
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
};

export function CreateSubjectForm({ action }: CreateSubjectFormProps) {
  const [state, formAction] = useActionState(action, idleFormActionState);

  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Vaknaam</label>
        <input
          name="name"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          placeholder="Elektrotechnische installaties"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Vaktype</label>
        <select name="subject_type" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <option value="general">general</option>
          <option value="vocational">vocational</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <SubmitButton />
      </div>
      <div className="md:col-span-2">
        <FormFeedback state={state} />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Vak opslaan..." : "Vak opslaan"}
    </button>
  );
}
