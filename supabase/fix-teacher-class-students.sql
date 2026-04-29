-- Fix: docenten konden de klaslijst niet lezen, waardoor de cijferlijst
-- in /teacher/grades/[classSubjectId] leeg bleef. Voeg een policy toe die
-- docenten toegang geeft tot class_students van klassen waar zij een vak
-- in geven.

create or replace function public.is_teacher_of_class(cls_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_subjects cs
    where cs.class_id = cls_class_id
      and cs.teacher_id = auth.uid()
  )
$$;

grant execute on function public.is_teacher_of_class(uuid) to authenticated, anon;

drop policy if exists "class_students_select_teacher" on public.class_students;

create policy "class_students_select_teacher"
on public.class_students
for select
to authenticated
using (public.is_teacher_of_class(class_id));
