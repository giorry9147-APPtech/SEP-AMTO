"use server";

import { revalidatePath } from "next/cache";
import type { FormActionState } from "@/lib/actions/form-state";
import { demoAdminOverview } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function createClassAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/classes");
    return;
  }

  const supabase = createAdminClient() ?? (await createClient());
  const schoolId = demoAdminOverview.school?.id;

  if (!supabase || !schoolId) {
    return;
  }

  const { error } = await supabase.from("classes").insert({
    school_id: schoolId,
    study_program_id: String(formData.get("study_program_id")),
    name: String(formData.get("name")),
    year_level: Number(formData.get("year_level")),
    cohort_year: Number(formData.get("cohort_year"))
  });

  if (error) {
    throw new Error(`Klas opslaan mislukt: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath("/admin/programs");
}

export async function assignStudentToClassAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/classes");
    return { status: "success", message: "Student is gekoppeld in demo-modus." };
  }

  const supabase = createAdminClient() ?? (await createClient());

  if (!supabase) {
    return { status: "error", message: "Verbinding met Supabase ontbreekt." };
  }

  const classId = String(formData.get("class_id"));
  const studentId = String(formData.get("student_id"));

  const { data: existingAssignments, error: existingError } = await supabase
    .from("class_students")
    .select("id, class_id")
    .eq("student_id", studentId);

  if (existingError) {
    return {
      status: "error",
      message: `Bestaande klas van student ophalen mislukt: ${existingError.message}`
    };
  }

  const alreadyAssigned = (existingAssignments ?? []).some((item) => item.class_id === classId);

  if (alreadyAssigned) {
    return {
      status: "warning",
      message: "Deze student zit al in de gekozen klas."
    };
  }

  if (existingAssignments?.length) {
    const { error: deleteError } = await supabase.from("class_students").delete().eq("student_id", studentId);

    if (deleteError) {
      return {
        status: "error",
        message: `Oude klasverwijzing verwijderen mislukt: ${deleteError.message}`
      };
    }
  }

  const { error } = await supabase.from("class_students").insert({
    class_id: classId,
    student_id: studentId
  });

  if (error) {
    return {
      status: "error",
      message: `Student koppelen mislukt: ${error.message}`
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/classes");
  revalidatePath("/student");
  revalidatePath("/student/portal");
  revalidatePath("/student/assignments");
  revalidatePath("/student/submissions");

  return {
    status: existingAssignments?.length ? "success" : "success",
    message: existingAssignments?.length
      ? "Student is verplaatst naar de nieuwe klas."
      : "Student is gekoppeld aan de klas."
  };
}

export async function createManagedUserAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/users");
    return;
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY ontbreekt in .env.local");
  }

  const schoolId = demoAdminOverview.school?.id;
  const role = String(formData.get("role"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("full_name"));

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user && schoolId) {
    const { error: profileError } = await adminClient
      .from("profiles")
      .update({
        full_name: fullName,
        role,
        school_id: schoolId
      })
      .eq("id", data.user.id);

    if (profileError) {
      throw new Error(`Profiel bijwerken mislukt: ${profileError.message}`);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function createSubjectAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/subjects");
    return { status: "success", message: "Vak is opgeslagen in demo-modus." };
  }

  const supabase = createAdminClient() ?? (await createClient());

  if (!supabase) {
    return { status: "error", message: "Verbinding met Supabase ontbreekt." };
  }

  const name = String(formData.get("name")).trim();
  const subjectType = String(formData.get("subject_type"));

  const { data: existingSubjects, error: existingError } = await supabase
    .from("subjects")
    .select("id")
    .ilike("name", name)
    .limit(1);

  if (existingError) {
    return {
      status: "error",
      message: `Controle op bestaand vak mislukt: ${existingError.message}`
    };
  }

  if (existingSubjects?.length) {
    return {
      status: "warning",
      message: "Dit vak bestaat al."
    };
  }

  const { error } = await supabase.from("subjects").insert({
    name,
    subject_type: subjectType
  });

  if (error) {
    if ("code" in error && error.code === "23505") {
      return {
        status: "warning",
        message: "Dit vak bestaat al."
      };
    }

    return {
      status: "error",
      message: `Vak opslaan mislukt: ${error.message}`
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/subjects");

  return {
    status: "success",
    message: "Vak is opgeslagen."
  };
}

export async function createStudyProgramAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/programs");
    return;
  }

  const supabase = createAdminClient() ?? (await createClient());
  const schoolId = demoAdminOverview.school?.id;

  if (!supabase || !schoolId) {
    return;
  }

  const { error } = await supabase.from("study_programs").insert({
    school_id: schoolId,
    name: String(formData.get("name")),
    code: String(formData.get("code")).trim().toUpperCase()
  });

  if (error) {
    throw new Error(`Richting opslaan mislukt: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  revalidatePath("/admin/classes");
}

export async function assignSubjectToClassAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/subjects");
    return { status: "success", message: "Vak is gekoppeld in demo-modus." };
  }

  const supabase = createAdminClient() ?? (await createClient());

  if (!supabase) {
    return { status: "error", message: "Verbinding met Supabase ontbreekt." };
  }

  const classId = String(formData.get("class_id"));
  const subjectId = String(formData.get("subject_id"));
  const teacherId = String(formData.get("teacher_id"));

  const { data: existingAssignment, error: existingError } = await supabase
    .from("class_subjects")
    .select("id, teacher_id, teacher:profiles!class_subjects_teacher_id_fkey(full_name)")
    .eq("class_id", classId)
    .eq("subject_id", subjectId)
    .maybeSingle();

  if (existingError) {
    return {
      status: "error",
      message: `Controle op bestaand vak in klas mislukt: ${existingError.message}`
    };
  }

  if (existingAssignment) {
    const assignedTeacher = Array.isArray(existingAssignment.teacher)
      ? existingAssignment.teacher[0]
      : existingAssignment.teacher;

    if (existingAssignment.teacher_id === teacherId) {
      return {
        status: "warning",
        message: "Vak en leerkracht zijn al gekoppeld aan deze klas."
      };
    }

    return {
      status: "warning",
      message: `Dit vak is al aan deze klas gekoppeld via ${assignedTeacher?.full_name ?? "een andere leerkracht"}.`
    };
  }

  const { error } = await supabase.from("class_subjects").insert({
    class_id: classId,
    subject_id: subjectId,
    teacher_id: teacherId
  });

  if (error) {
    if ("code" in error && error.code === "23505") {
      return {
        status: "warning",
        message: "Vak en leerkracht zijn al gekoppeld aan deze klas."
      };
    }

    return {
      status: "error",
      message: `Vak koppelen mislukt: ${error.message}`
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/subjects");
  revalidatePath("/teacher");

  return {
    status: "success",
    message: "Vak is gekoppeld aan de klas."
  };
}
