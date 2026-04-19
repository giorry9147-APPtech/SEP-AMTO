alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.study_programs enable row level security;
alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.subjects enable row level security;
alter table public.class_subjects enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_files enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_reviews enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles_select_admin_same_school"
on public.profiles
for select
to authenticated
using (
  public.current_user_role() = 'admin'
  and school_id = public.current_user_school_id()
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "schools_select_same_school"
on public.schools
for select
to authenticated
using (id = public.current_user_school_id());

create policy "schools_update_admin"
on public.schools
for update
to authenticated
using (
  public.current_user_role() = 'admin'
  and id = public.current_user_school_id()
)
with check (
  public.current_user_role() = 'admin'
  and id = public.current_user_school_id()
);

create policy "study_programs_select_same_school"
on public.study_programs
for select
to authenticated
using (school_id = public.current_user_school_id());

create policy "study_programs_insert_admin"
on public.study_programs
for insert
to authenticated
with check (
  public.current_user_role() = 'admin'
  and school_id = public.current_user_school_id()
);

create policy "study_programs_update_admin"
on public.study_programs
for update
to authenticated
using (
  public.current_user_role() = 'admin'
  and school_id = public.current_user_school_id()
)
with check (
  public.current_user_role() = 'admin'
  and school_id = public.current_user_school_id()
);

create policy "classes_select_same_school"
on public.classes
for select
to authenticated
using (school_id = public.current_user_school_id());

create policy "classes_insert_admin"
on public.classes
for insert
to authenticated
with check (
  public.current_user_role() = 'admin'
  and school_id = public.current_user_school_id()
);

create policy "classes_update_admin"
on public.classes
for update
to authenticated
using (
  public.current_user_role() = 'admin'
  and school_id = public.current_user_school_id()
)
with check (
  public.current_user_role() = 'admin'
  and school_id = public.current_user_school_id()
);

create policy "class_students_select_admin"
on public.class_students
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "class_students_select_own"
on public.class_students
for select
to authenticated
using (student_id = auth.uid());

create policy "class_students_insert_admin"
on public.class_students
for insert
to authenticated
with check (public.current_user_role() = 'admin');

create policy "class_students_delete_admin"
on public.class_students
for delete
to authenticated
using (public.current_user_role() = 'admin');

create policy "subjects_select_authenticated"
on public.subjects
for select
to authenticated
using (true);

create policy "subjects_insert_admin"
on public.subjects
for insert
to authenticated
with check (public.current_user_role() = 'admin');

create policy "subjects_update_admin"
on public.subjects
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "class_subjects_select_admin"
on public.class_subjects
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "class_subjects_select_teacher"
on public.class_subjects
for select
to authenticated
using (teacher_id = auth.uid());

create policy "class_subjects_select_student"
on public.class_subjects
for select
to authenticated
using (public.is_student_in_class_subject(id));

create policy "class_subjects_insert_admin"
on public.class_subjects
for insert
to authenticated
with check (public.current_user_role() = 'admin');

create policy "class_subjects_update_admin"
on public.class_subjects
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "lessons_select_teacher"
on public.lessons
for select
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id));

create policy "lessons_select_student"
on public.lessons
for select
to authenticated
using (public.is_student_in_class_subject(class_subject_id));

create policy "lessons_select_admin"
on public.lessons
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "lessons_insert_teacher"
on public.lessons
for insert
to authenticated
with check (
  public.is_teacher_of_class_subject(class_subject_id)
  and created_by = auth.uid()
);

create policy "lessons_update_teacher"
on public.lessons
for update
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id))
with check (public.is_teacher_of_class_subject(class_subject_id));

create policy "lessons_delete_teacher"
on public.lessons
for delete
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id));

create policy "lesson_files_select_admin"
on public.lesson_files
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "lesson_files_select_teacher"
on public.lesson_files
for select
to authenticated
using (
  exists (
    select 1
    from public.lessons l
    where l.id = lesson_id
      and public.is_teacher_of_class_subject(l.class_subject_id)
  )
);

create policy "lesson_files_select_student"
on public.lesson_files
for select
to authenticated
using (
  exists (
    select 1
    from public.lessons l
    where l.id = lesson_id
      and public.is_student_in_class_subject(l.class_subject_id)
  )
);

create policy "lesson_files_insert_teacher"
on public.lesson_files
for insert
to authenticated
with check (
  exists (
    select 1
    from public.lessons l
    where l.id = lesson_id
      and public.is_teacher_of_class_subject(l.class_subject_id)
  )
);

create policy "lesson_files_delete_teacher"
on public.lesson_files
for delete
to authenticated
using (
  exists (
    select 1
    from public.lessons l
    where l.id = lesson_id
      and public.is_teacher_of_class_subject(l.class_subject_id)
  )
);

create policy "assignments_select_admin"
on public.assignments
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "assignments_select_teacher"
on public.assignments
for select
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id));

create policy "assignments_select_student"
on public.assignments
for select
to authenticated
using (public.is_student_in_class_subject(class_subject_id));

create policy "assignments_insert_teacher"
on public.assignments
for insert
to authenticated
with check (
  public.is_teacher_of_class_subject(class_subject_id)
  and created_by = auth.uid()
);

create policy "assignments_update_teacher"
on public.assignments
for update
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id))
with check (public.is_teacher_of_class_subject(class_subject_id));

create policy "assignments_delete_teacher"
on public.assignments
for delete
to authenticated
using (public.is_teacher_of_class_subject(class_subject_id));

create policy "submissions_select_student_own"
on public.submissions
for select
to authenticated
using (student_id = auth.uid());

create policy "submissions_select_teacher"
on public.submissions
for select
to authenticated
using (public.is_teacher_of_assignment(assignment_id));

create policy "submissions_select_admin"
on public.submissions
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "submissions_insert_student"
on public.submissions
for insert
to authenticated
with check (
  student_id = auth.uid()
  and exists (
    select 1
    from public.assignments a
    join public.class_subjects cs on cs.id = a.class_subject_id
    join public.class_students cls on cls.class_id = cs.class_id
    where a.id = assignment_id
      and cls.student_id = auth.uid()
  )
);

create policy "submissions_update_student_own"
on public.submissions
for update
to authenticated
using (student_id = auth.uid())
with check (student_id = auth.uid());

create policy "submissions_update_teacher_status"
on public.submissions
for update
to authenticated
using (public.is_teacher_of_assignment(assignment_id))
with check (public.is_teacher_of_assignment(assignment_id));

create policy "submission_reviews_select_teacher"
on public.submission_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.submissions s
    where s.id = submission_id
      and public.is_teacher_of_assignment(s.assignment_id)
  )
);

create policy "submission_reviews_select_student"
on public.submission_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.submissions s
    where s.id = submission_id
      and s.student_id = auth.uid()
  )
);

create policy "submission_reviews_select_admin"
on public.submission_reviews
for select
to authenticated
using (public.current_user_role() = 'admin');

create policy "submission_reviews_insert_teacher"
on public.submission_reviews
for insert
to authenticated
with check (
  teacher_id = auth.uid()
  and exists (
    select 1
    from public.submissions s
    where s.id = submission_id
      and public.is_teacher_of_assignment(s.assignment_id)
  )
);

create policy "submission_reviews_update_teacher"
on public.submission_reviews
for update
to authenticated
using (teacher_id = auth.uid())
with check (teacher_id = auth.uid());
