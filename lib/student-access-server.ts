import { cookies } from "next/headers";
import { demoAdminOverview } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import type { StudentSelection } from "@/lib/student-access";
import type { StudentProgramOption } from "@/types/app";
import { createClient } from "@/lib/supabase/server";

export async function getStudentPrograms(): Promise<StudentProgramOption[]> {
  if (!isSupabaseConfigured()) {
    return demoAdminOverview.programs.map((program) => ({
      id: program.id,
      name: program.name,
      code: program.code
    }));
  }

  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("study_programs")
    .select("id, name, code")
    .not("code", "is", null)
    .order("name");

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getStudentSelection(
  programs?: StudentProgramOption[],
  profileId?: string
) {
  const cookieStore = await cookies();
  const cookieStudentId = cookieStore.get("amto_student_id")?.value;
  const programId = cookieStore.get("amto_program_id")?.value;
  const programCode = cookieStore.get("amto_program_code")?.value;
  const yearRaw = cookieStore.get("amto_year")?.value;
  const availablePrograms = programs ?? (await getStudentPrograms());

  if (profileId && cookieStudentId && cookieStudentId !== profileId) {
    return null;
  }

  const program =
    availablePrograms.find((item) => item.id === programId) ??
    availablePrograms.find((item) => item.code === programCode);
  const yearLevel = Number(yearRaw);

  if (!program || ![1, 2, 3, 4].includes(yearLevel)) {
    return null;
  }

  return {
    program,
    yearLevel: yearLevel as 1 | 2 | 3 | 4
  } satisfies StudentSelection;
}
