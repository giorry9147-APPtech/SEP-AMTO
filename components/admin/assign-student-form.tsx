"use client";

import { useActionState, useState } from "react";
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
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [dismissed, setDismissed] = useState(false);

  const needsConfirm =
    !dismissed &&
    state.status === "warning" &&
    state.message?.startsWith("confirm_switch|");

  function resetDismiss() {
    setDismissed(false);
  }

  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="force_switch" value="false" />
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Student</label>
          <select
            name="student_id"
            value={studentId}
            onChange={(e) => { setStudentId(e.target.value); resetDismiss(); }}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Klas</label>
          <select
            name="class_id"
            value={classId}
            onChange={(e) => { setClassId(e.target.value); resetDismiss(); }}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {!needsConfirm && (
          <div className="md:col-span-2">
            <SubmitButton />
          </div>
        )}
        {!needsConfirm && state.status !== "idle" && (
          <div className="md:col-span-2">
            <FormFeedback state={state} />
          </div>
        )}
      </form>

      {needsConfirm && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Student wisselen van klas?</p>
          <p className="mt-1 text-sm text-amber-800">
            Deze student zit al in een andere klas. Als je doorgaat wordt de koppeling aan de huidige klas verwijderd.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              Annuleren
            </button>
            <form action={formAction}>
              <input type="hidden" name="student_id" value={studentId} />
              <input type="hidden" name="class_id" value={classId} />
              <input type="hidden" name="force_switch" value="true" />
              <ConfirmButton />
            </form>
          </div>
        </div>
      )}
    </div>
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

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-2xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Bezig met wisselen..." : "Ja, wisselen"}
    </button>
  );
}
