"use client";

import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormFeedback } from "@/components/ui/form-feedback";
import { idleFormActionState, type FormActionState } from "@/lib/actions/form-state";
import {
  GRADE_TYPES,
  GRADE_TYPE_LABELS,
  formatGrade
} from "@/lib/grades";
import type { Grade } from "@/types/database";
import type { GradebookStudent, ClassSubjectSummary } from "@/types/app";

type GradebookProps = {
  classSubject: ClassSubjectSummary;
  students: GradebookStudent[];
  upsertAction: (
    state: FormActionState,
    formData: FormData
  ) => Promise<FormActionState>;
  deleteAction: (formData: FormData) => Promise<void>;
  intro?: string;
};

type EditingGrade = {
  id: string;
  student_id: string;
  title: string;
  grade_type: Grade["grade_type"];
  score: string;
  weight: string;
  comment: string;
};

const emptyForm: Omit<EditingGrade, "id"> & { id: "" } = {
  id: "",
  student_id: "",
  title: "",
  grade_type: "toets",
  score: "",
  weight: "1",
  comment: ""
};

export function Gradebook({
  classSubject,
  students,
  upsertAction,
  deleteAction,
  intro
}: GradebookProps) {
  const [state, formAction] = useActionState(upsertAction, idleFormActionState);
  const [form, setForm] = useState<EditingGrade | typeof emptyForm>({
    ...emptyForm,
    student_id: students[0]?.id ?? ""
  });
  const isEditing = Boolean(form.id);

  useEffect(() => {
    if (state.status === "success") {
      setForm({ ...emptyForm, student_id: students[0]?.id ?? "" });
    }
  }, [state, students]);

  const studentsById = useMemo(() => {
    const map = new Map<string, GradebookStudent>();
    for (const student of students) map.set(student.id, student);
    return map;
  }, [students]);

  function startEdit(grade: Grade) {
    setForm({
      id: grade.id,
      student_id: grade.student_id,
      title: grade.title,
      grade_type: grade.grade_type,
      score: String(grade.score).replace(".", ","),
      weight: String(grade.weight).replace(".", ","),
      comment: grade.comment ?? ""
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function cancelEdit() {
    setForm({ ...emptyForm, student_id: students[0]?.id ?? "" });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
              {classSubject.program_code || classSubject.program_name} · leerjaar {classSubject.year_level}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {classSubject.subject_name} · {classSubject.class_name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Docent: {classSubject.teacher_name}</p>
          </div>
        </div>
        {intro ? <p className="mt-4 text-sm text-slate-600">{intro}</p> : null}

        <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={form.id} />
          <input type="hidden" name="class_subject_id" value={classSubject.id} />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Student</label>
            <select
              name="student_id"
              required
              value={form.student_id}
              onChange={(event) => setForm({ ...form, student_id: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            >
              <option value="">Kies student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Titel</label>
            <input
              name="title"
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Hoofdstuk 3 toets"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
            <select
              name="grade_type"
              value={form.grade_type}
              onChange={(event) =>
                setForm({ ...form, grade_type: event.target.value as Grade["grade_type"] })
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            >
              {GRADE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {GRADE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Cijfer (1 - 10)</label>
            <input
              name="score"
              required
              inputMode="decimal"
              value={form.score}
              onChange={(event) => setForm({ ...form, score: event.target.value })}
              placeholder="7,5"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Weging</label>
            <input
              name="weight"
              required
              inputMode="decimal"
              value={form.weight}
              onChange={(event) => setForm({ ...form, weight: event.target.value })}
              placeholder="1"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              Standaard 1. Een eindtoets kan bv. 2 of 3 wegen.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Opmerking (optioneel)
            </label>
            <textarea
              name="comment"
              rows={2}
              value={form.comment}
              onChange={(event) => setForm({ ...form, comment: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Korte feedback voor de student"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <SubmitButton isEditing={isEditing} />
            {isEditing ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
              >
                Annuleren
              </button>
            ) : null}
          </div>

          {state.status !== "idle" ? (
            <div className="md:col-span-2">
              <FormFeedback state={state} />
            </div>
          ) : null}
        </form>
      </section>

      <section className="space-y-4">
        {students.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
            <p className="text-sm text-slate-600">
              Er zijn nog geen studenten in deze klas. Koppel eerst studenten aan de klas via Klassenbeheer.
            </p>
          </div>
        ) : (
          students.map((student) => (
            <article
              key={student.id}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{student.full_name}</h3>
                  <p className="text-sm text-slate-500">{student.email}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm">
                  <span className="text-slate-500">Gemiddeld: </span>
                  <span className="font-semibold text-slate-900">{formatGrade(student.average)}</span>
                </div>
              </div>

              {student.grades.length ? (
                <ul className="mt-4 space-y-2">
                  {student.grades.map((grade) => (
                    <li
                      key={grade.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {grade.title}{" "}
                          <span className="text-xs font-normal text-slate-500">
                            · {GRADE_TYPE_LABELS[grade.grade_type]} · weging {formatGrade(Number(grade.weight))}
                          </span>
                        </p>
                        {grade.comment ? (
                          <p className="mt-1 text-xs text-slate-500">{grade.comment}</p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                          {formatGrade(Number(grade.score))}
                        </span>
                        <button
                          type="button"
                          onClick={() => startEdit(grade)}
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                        >
                          Bewerken
                        </button>
                        <DeleteGradeForm
                          action={deleteAction}
                          gradeId={grade.id}
                          classSubjectId={classSubject.id}
                          studentName={studentsById.get(grade.student_id)?.full_name ?? "deze student"}
                          gradeTitle={grade.title}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Nog geen cijfers ingevoerd.</p>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  const label = isEditing ? "Cijfer bijwerken" : "Cijfer opslaan";
  const pendingLabel = isEditing ? "Bijwerken..." : "Opslaan...";
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function DeleteGradeForm({
  action,
  gradeId,
  classSubjectId,
  studentName,
  gradeTitle
}: {
  action: (formData: FormData) => Promise<void>;
  gradeId: string;
  classSubjectId: string;
  studentName: string;
  gradeTitle: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const ok = window.confirm(
          `Cijfer "${gradeTitle}" voor ${studentName} verwijderen?`
        );
        if (!ok) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={gradeId} />
      <input type="hidden" name="class_subject_id" value={classSubjectId} />
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
      className="rounded-2xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-60"
    >
      {pending ? "..." : "Verwijderen"}
    </button>
  );
}
