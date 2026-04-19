import { redirect } from "next/navigation";
import type { UserRole } from "@/types/database";

export function redirectByRole(role: UserRole) {
  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "teacher") {
    redirect("/teacher");
  }

  redirect("/student/portal");
}
