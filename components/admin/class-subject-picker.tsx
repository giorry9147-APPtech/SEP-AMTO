"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useTransition } from "react";
import type { ClassSubjectSummary } from "@/types/app";

type ClassSubjectPickerProps = {
  classSubjects: ClassSubjectSummary[];
  selectedId: string | null;
  basePath: string;
};

export function ClassSubjectPicker({ classSubjects, selectedId, basePath }: ClassSubjectPickerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
      <label className="block text-sm font-medium text-slate-700">Vak / klas</label>
      <select
        disabled={pending}
        value={selectedId ?? ""}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(() => {
            router.push(`${basePath}?cs=${encodeURIComponent(next)}` as Route);
          });
        }}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
      >
        {classSubjects.map((cs) => (
          <option key={cs.id} value={cs.id}>
            {cs.class_name} · {cs.subject_name} · leerjaar {cs.year_level} · {cs.teacher_name}
          </option>
        ))}
      </select>
      {pending ? (
        <p className="mt-2 text-xs text-slate-500">Cijferlijst laden...</p>
      ) : null}
    </div>
  );
}
