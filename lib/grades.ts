import type { Grade, GradeType } from "@/types/database";

export const GRADE_TYPES: GradeType[] = [
  "toets",
  "so",
  "opdracht",
  "mondeling",
  "praktijk",
  "examen",
  "anders"
];

export const GRADE_TYPE_LABELS: Record<GradeType, string> = {
  toets: "Toets",
  so: "SO",
  opdracht: "Opdracht",
  mondeling: "Mondeling",
  praktijk: "Praktijk",
  examen: "Examen",
  anders: "Anders"
};

export type ParsedGradePayload = {
  class_subject_id: string;
  student_id: string;
  title: string;
  grade_type: GradeType;
  score: number;
  weight: number;
  comment: string | null;
};

export type ParseGradeResult =
  | { ok: true; id: string | null; payload: ParsedGradePayload }
  | { ok: false; error: string };

function isGradeType(value: string): value is GradeType {
  return (GRADE_TYPES as string[]).includes(value);
}

function parseDecimal(raw: string): number {
  return Number(raw.replace(",", "."));
}

export function parseGradeFormFields(formData: FormData): ParseGradeResult {
  const id = String(formData.get("id") ?? "").trim() || null;
  const classSubjectId = String(formData.get("class_subject_id") ?? "").trim();
  const studentId = String(formData.get("student_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const gradeTypeRaw = String(formData.get("grade_type") ?? "toets");
  const scoreRaw = String(formData.get("score") ?? "").trim();
  const weightRaw = String(formData.get("weight") ?? "1").trim();
  const commentRaw = String(formData.get("comment") ?? "").trim();

  if (!classSubjectId) {
    return { ok: false, error: "Vak (class_subject) ontbreekt." };
  }

  if (!studentId) {
    return { ok: false, error: "Student ontbreekt." };
  }

  if (!title) {
    return { ok: false, error: "Titel is verplicht (bv. 'Hoofdstuk 3 toets')." };
  }

  if (!isGradeType(gradeTypeRaw)) {
    return { ok: false, error: "Ongeldig cijfertype." };
  }

  const score = parseDecimal(scoreRaw);

  if (!Number.isFinite(score) || score < 1 || score > 10) {
    return { ok: false, error: "Cijfer moet een getal zijn tussen 1 en 10." };
  }

  const weight = parseDecimal(weightRaw || "1");

  if (!Number.isFinite(weight) || weight <= 0) {
    return { ok: false, error: "Weging moet groter zijn dan 0." };
  }

  return {
    ok: true,
    id,
    payload: {
      class_subject_id: classSubjectId,
      student_id: studentId,
      title,
      grade_type: gradeTypeRaw,
      score: Math.round(score * 100) / 100,
      weight: Math.round(weight * 100) / 100,
      comment: commentRaw || null
    }
  };
}

export function calculateWeightedAverage(grades: Pick<Grade, "score" | "weight">[]): number | null {
  if (!grades.length) return null;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const grade of grades) {
    const weight = Number(grade.weight) || 0;
    const score = Number(grade.score);
    if (!Number.isFinite(score) || weight <= 0) continue;
    weightedSum += score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return null;

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function formatGrade(score: number | null | undefined): string {
  if (score === null || score === undefined) return "-";
  const value = Number(score);
  if (!Number.isFinite(value)) return "-";
  return value.toFixed(value % 1 === 0 ? 1 : 2).replace(".", ",");
}
