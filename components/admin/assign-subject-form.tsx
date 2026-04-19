"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormFeedback } from "@/components/ui/form-feedback";
import { idleFormActionState, type FormActionState } from "@/lib/actions/form-state";

type AssignSubjectFormProps = {
  classes: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string }>;
  teachers: Array<{ id: string; full_name: string }>;
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
};

export function AssignSubjectForm({
  classes,
  subjects,
  teachers,
  action
}: AssignSubjectFormProps) {
  const [state, formAction] = useActionState(action, idleFormActionState);

  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Klas</label>
        <select name="class_id" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Vak</label>
        <select name="subject_id" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          {subjects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Docent</label>
        <select name="teacher_id" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          {teachers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.full_name}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-3">
        <SubmitButton />
      </div>
      <div className="md:col-span-3">
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
      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Vak koppelen..." : "Vak koppelen aan klas"}
    </button>
  );
}
