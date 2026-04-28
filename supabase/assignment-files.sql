insert into storage.buckets (id, name, public)
values ('assignment-files', 'assignment-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('submission-files', 'submission-files', false)
on conflict (id) do nothing;

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
grant execute on function public.is_teacher_of_assignment(uuid) to authenticated, anon;

create table if not exists public.assignment_files (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

alter table public.assignment_files enable row level security;

drop policy if exists "assignment_files_select_admin" on public.assignment_files;
drop policy if exists "assignment_files_select_teacher" on public.assignment_files;
drop policy if exists "assignment_files_select_student" on public.assignment_files;
drop policy if exists "assignment_files_insert_teacher" on public.assignment_files;
drop policy if exists "assignment_files_delete_teacher" on public.assignment_files;

create policy "assignment_files_select_admin"
on public.assignment_files
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "assignment_files_select_teacher"
on public.assignment_files
for select
to authenticated
using (
  exists (
    select 1
    from public.assignments a
    where a.id = assignment_id
      and public.is_teacher_of_class_subject(a.class_subject_id)
  )
);

create policy "assignment_files_select_student"
on public.assignment_files
for select
to authenticated
using (
  exists (
    select 1
    from public.assignments a
    where a.id = assignment_id
      and public.is_student_in_class_subject(a.class_subject_id)
  )
);

create policy "assignment_files_insert_teacher"
on public.assignment_files
for insert
to authenticated
with check (
  exists (
    select 1
    from public.assignments a
    where a.id = assignment_id
      and public.is_teacher_of_class_subject(a.class_subject_id)
  )
);

create policy "assignment_files_delete_teacher"
on public.assignment_files
for delete
to authenticated
using (
  exists (
    select 1
    from public.assignments a
    where a.id = assignment_id
      and public.is_teacher_of_class_subject(a.class_subject_id)
  )
);
