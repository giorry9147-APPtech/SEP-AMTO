const publicSupabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
} as const;

export function isSupabaseConfigured() {
  return getMissingSupabaseEnvVars().length === 0;
}

export function getMissingSupabaseEnvVars() {
  return (Object.entries(publicSupabaseEnv) as Array<
    [keyof typeof publicSupabaseEnv, string | undefined]
  >)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function getSupabaseConfigError() {
  const missing = getMissingSupabaseEnvVars();

  if (!missing.length) {
    return null;
  }

  return `Supabase is niet geconfigureerd. Ontbrekende environment variables: ${missing.join(", ")}.`;
}
