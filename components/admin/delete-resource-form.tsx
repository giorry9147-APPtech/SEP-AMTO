"use client";

import { useFormStatus } from "react-dom";

type DeleteResourceFormProps = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  resourceName: string;
  className?: string;
};

export function DeleteResourceForm({
  action,
  id,
  label,
  resourceName,
  className = ""
}: DeleteResourceFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Weet je zeker dat je ${resourceName} "${label}" wilt verwijderen? Gekoppelde gegevens worden ook verwijderd.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Verwijderen..." : "Verwijderen"}
    </button>
  );
}
