"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormFeedback } from "@/components/ui/form-feedback";
import { idleFormActionState, type FormActionState } from "@/lib/actions/form-state";

type AssignStudentFormProps = {
  classes: Array<{ id: string; name: string }>;
  students: Array<{ id: string; full_name: string }>;
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
};

export function AssignStudentForm({ classes, students, action }: AssignStudentFormProps) {
  const [state, formAction] = useActionState(action, idleFormActionState);

  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Student</label>
        <select name="student_id" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.full_name}
            </option>
          ))}
        </select>
      </div>
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
      {pending ? "Student koppelen..." : "Student koppelen aan klas"}
    </button>
  );
}
