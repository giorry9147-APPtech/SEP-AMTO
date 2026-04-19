-- Fix voor recursieve RLS-helperfuncties op profiles/schools/study_programs/classes.
-- Draai dit eenmalig in Supabase SQL Editor.

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1
$$;

create or replace function public.current_user_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id
  from public.profiles
  where id = auth.uid()
  limit 1
$$;

grant execute on function public.current_user_role() to authenticated, anon;
grant execute on function public.current_user_school_id() to authenticated, anon;
