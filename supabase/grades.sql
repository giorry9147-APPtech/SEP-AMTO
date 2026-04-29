-- Cijfers (grades) voor studenten per vak.
-- Onafhankelijk van submissions: docent of admin kan ook toets-, mondeling-
-- of praktijkcijfers invoeren zonder dat er een upload aan vasthangt.

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  class_subject_id uuid not null references public.class_subjects(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  grade_type text not null default 'toets'
    check (grade_type in ('toets', 'so', 'opdracht', 'mondeling', 'praktijk', 'examen', 'anders')),
  score numeric(4,2) not null check (score >= 1 and score <= 10),
  weight numeric(4,2) not null default 1 check (weight > 0),
  comment text,
  graded_by uuid not null references public.profiles(id) on delete restrict,
  graded_at timestamptz not null default now()
);

create index if not exists grades_class_subject_idx on public.grades (class_subject_id);
create index if not exists grades_student_idx on public.grades (student_id);
create index if not exists grades_class_subject_student_idx on public.grades (class_subject_id, student_id);

alter table public.grades enable row level security;

drop policy if exists "grades_select_admin" on public.grades;
drop policy if exists "grades_select_teacher" on public.grades;
drop policy if exists "grades_select_student_own" on public.grades;
drop policy if exists "grades_insert_admin" on public.grades;
drop policy if exists "grades_insert_teacher" on public.grades;
drop policy if exists "grades_update_admin" on public.grades;
drop policy if exists "grades_update_teacher" on public.grades;
drop policy if exists "grades_delete_admin" on public.grades;
drop policy if exists "grades_delete_teacher" on public.grades;

create policy "grades_select_admin"
on public.grades
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "grades_select_teacher"
on public.grades
for select
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id));

create policy "grades_select_student_own"
on public.grades
for select
to authenticated
using (student_id = auth.uid());

create policy "grades_insert_admin"
on public.grades
for insert
to authenticated
with check (
  public.current_user_role() = 'admin'
  and graded_by = auth.uid()
);

create policy "grades_insert_teacher"
on public.grades
for insert
to authenticated
with check (
  public.is_teacher_of_class_subject(class_subject_id)
  and graded_by = auth.uid()
);

create policy "grades_update_admin"
on public.grades
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "grades_update_teacher"
on public.grades
for update
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id))
with check (public.is_teacher_of_class_subject(class_subject_id));

create policy "grades_delete_admin"
on public.grades
for delete
to authenticated
using (public.current_user_role() = 'admin');

create policy "grades_delete_teacher"
on public.grades
for delete
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id));
