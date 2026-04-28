"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormFeedback } from "@/components/ui/form-feedback";
import { idleFormActionState, type FormActionState } from "@/lib/actions/form-state";

type UploadSubmissionFormProps = {
  assignments: Array<{ id: string; title: string }>;
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
};

export function UploadSubmissionForm({ assignments, action }: UploadSubmissionFormProps) {
  const [state, formAction] = useActionState(action, idleFormActionState);
  const hasAssignments = assignments.length > 0;

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Opdracht</label>
        <select
          name="assignment_id"
          required
          disabled={!hasAssignments}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:bg-slate-100"
        >
          {hasAssignments ? (
            assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))
          ) : (
            <option value="">Nog geen opdrachten beschikbaar</option>
          )}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Bestand</label>
        <input
          name="file"
          type="file"
          required
          disabled={!hasAssignments}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Toelichting</label>
        <textarea
          name="comment"
          rows={4}
          disabled={!hasAssignments}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:bg-slate-100"
          placeholder="Korte toelichting op je inzending."
        />
      </div>
      {!hasAssignments ? (
        <p className="text-sm text-slate-500">
          Zodra je docent een opdracht voor jouw klas plaatst, kun je hier direct inleveren.
        </p>
      ) : null}
      <SubmitButton disabled={!hasAssignments} />
      <FormFeedback state={state} />
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Inleveren..." : "Inleveren"}
    </button>
  );
}
