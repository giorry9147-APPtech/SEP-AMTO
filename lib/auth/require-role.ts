import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/get-profile";
import type { Profile, UserRole } from "@/types/database";

export async function requireRole(allowedRoles: UserRole[]): Promise<Profile> {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role === "admin") {
    return profile;
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return profile;
}
