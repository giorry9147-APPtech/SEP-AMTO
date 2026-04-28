-- Fix: voeg security definer toe aan helper functies om RLS-recursie te voorkomen.
-- Zonder security definer draaien deze functies als de authenticated user,
-- waardoor ze zelf ook RLS triggeren op class_subjects/assignments → oneindige recursie.

create or replace function public.is_teacher_of_class_subject(cs_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_subjects cs
    where cs.id = cs_id
      and cs.teacher_id = auth.uid()
  )
$$;

create or replace function public.is_student_in_class_subject(cs_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_subjects cs
    join public.class_students cls on cls.class_id = cs.class_id
    where cs.id = cs_id
      and cls.student_id = auth.uid()
  )
$$;

create or replace function public.owns_submission(sub_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.submissions s
    where s.id = sub_id
      and s.student_id = auth.uid()
  )
$$;

create or replace function public.is_teacher_of_assignment(a_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignments a
    join public.class_subjects cs on cs.id = a.class_subject_id
    where a.id = a_id
      and cs.teacher_id = auth.uid()
  )
$$;

grant execute on function public.is_teacher_of_class_subject(uuid) to authenticated, anon;
grant execute on function public.is_student_in_class_subject(uuid) to authenticated, anon;
grant execute on function public.owns_submission(uuid) to authenticated, anon;
grant execute on function public.is_teacher_of_assignment(uuid) to authenticated, anon;
