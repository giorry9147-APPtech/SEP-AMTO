insert into public.schools (id, name, address)
values
  ('11111111-1111-1111-1111-111111111111', 'AMTO Avond Middelbare Technische Opleiding', 'Paramaribo')
on conflict (id) do nothing;

insert into public.study_programs (id, school_id, name, code)
values
  ('21111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Bouwkunde', 'BOUW'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Elektrotechniek', 'ELEK'),
  ('23333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Weg- en waterbouwkunde', 'WWB'),
  ('24444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Werktuigbouwkunde', 'WTB')
on conflict (id) do nothing;

insert into public.subjects (id, name, subject_type)
values
  ('31111111-1111-1111-1111-111111111111', 'Nederlands', 'general'),
  ('32222222-2222-2222-2222-222222222222', 'Engels', 'general'),
  ('33333333-3333-3333-3333-333333333333', 'Natuurkunde', 'general'),
  ('34444444-4444-4444-4444-444444444444', 'Wiskunde', 'general'),
  ('35555555-5555-5555-5555-555555555555', 'Scheikunde', 'general'),
  ('36666666-6666-6666-6666-666666666666', 'Veiligheid', 'general'),
  ('37777777-7777-7777-7777-777777777777', 'Bedrijfskunde', 'general'),
  ('38888888-8888-8888-8888-888888888888', 'Elektrotechnische installaties', 'vocational')
on conflict (id) do nothing;

insert into public.classes (id, school_id, study_program_id, name, year_level, cohort_year)
values
  ('41111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'ET-1A', 1, 2026),
  ('42222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', 'BK-2A', 2, 2025)
on conflict (id) do nothing;

-- Maak eerst twee auth-gebruikers in Supabase Auth aan en vervang daarna de UUID's hieronder.
-- Voorbeeldrollen:
-- admin@amto.demo
-- docent@amto.demo
-- student@amto.demo

insert into public.class_subjects (id, class_id, subject_id, teacher_id)
select
  '51111111-1111-1111-1111-111111111111',
  '41111111-1111-1111-1111-111111111111',
  '38888888-8888-8888-8888-888888888888',
  p.id
from public.profiles p
where p.email = 'docent@amto.demo'
on conflict (id) do nothing;

insert into public.class_students (id, class_id, student_id)
select
  '61111111-1111-1111-1111-111111111111',
  '41111111-1111-1111-1111-111111111111',
  p.id
from public.profiles p
where p.email = 'student@amto.demo'
on conflict (id) do nothing;

insert into public.lessons (id, class_subject_id, title, content, created_by)
select
  '71111111-1111-1111-1111-111111111111',
  '51111111-1111-1111-1111-111111111111',
  'Week 1: symbolen en schema''s',
  'Introductie tot basissymbolen, eenvoudige schakelschema''s en veilig werken in het praktijklokaal.',
  p.id
from public.profiles p
where p.email = 'docent@amto.demo'
on conflict (id) do nothing;

insert into public.assignments (id, class_subject_id, title, description, due_date, created_by)
select
  '81111111-1111-1111-1111-111111111111',
  '51111111-1111-1111-1111-111111111111',
  'Praktijkopdracht 1',
  'Teken een eenvoudige schakeling en licht elke component kort toe.',
  now() + interval '7 day',
  p.id
from public.profiles p
where p.email = 'docent@amto.demo'
on conflict (id) do nothing;
