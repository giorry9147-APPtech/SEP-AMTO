-- Fix: sta docenten toe om profielen te lezen van studenten in hun klassen.
-- Zonder deze policy geeft de submissions-query null terug voor student-data,
-- wat een crash veroorzaakte op het docent-dashboard.

create or replace function public.is_student_of_teacher(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_students cls
    join public.class_subjects cs on cs.class_id = cls.class_id
    where cls.student_id = profile_id
      and cs.teacher_id = auth.uid()
  )
$$;

grant execute on function public.is_student_of_teacher(uuid) to authenticated, anon;

drop policy if exists "profiles_select_teacher_student" on public.profiles;

create policy "profiles_select_teacher_student"
on public.profiles
for select
to authenticated
using (public.is_student_of_teacher(id));
