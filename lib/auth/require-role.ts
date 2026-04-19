import { redirect } from "next/navigation";
import { demoProfiles } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { getProfile } from "@/lib/auth/get-profile";
import type { Profile, UserRole } from "@/types/database";

export async function requireRole(allowedRoles: UserRole[]): Promise<Profile> {
  if (!isSupabaseConfigured()) {
    return demoProfiles[allowedRoles[0]];
  }

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
