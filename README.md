# AMTO Lesportaal Starterset

Demo-ready starterset voor een lesportaal voor AMTO, gebouwd met Next.js App Router, TypeScript, Supabase en Tailwind.

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth, Postgres, Storage en RLS
- Tailwind CSS
- Vercel-ready deployment

## Projectstructuur

```text
app/
  admin/
  dashboard/
  login/
  student/
  subject/[id]/
  teacher/
components/
  admin/
  auth/
  dashboard/
  student/
  teacher/
  ui/
lib/
  actions/
  auth/
  queries/
  supabase/
supabase/
types/
middleware.ts
```

## Setup

1. Installeer dependencies:

```bash
npm install
```

2. Maak een `.env.local` op basis van `.env.example`.

3. Maak in Supabase een project aan en voer deze SQL-bestanden in volgorde uit:

```text
supabase/schema.sql
supabase/rls.sql
supabase/seed.sql
```

4. Maak in Supabase Storage de buckets:

- `lesson-files`
- `submission-files`

5. Maak in Supabase Auth minimaal deze gebruikers aan:

- `admin@amto.demo`
- `docent@amto.demo`
- `student@amto.demo`

6. Pas daarna de rollen in `profiles` aan:

```sql
update public.profiles set school_id = '11111111-1111-1111-1111-111111111111', role = 'admin' where email = 'admin@amto.demo';
update public.profiles set school_id = '11111111-1111-1111-1111-111111111111', role = 'teacher' where email = 'docent@amto.demo';
update public.profiles set school_id = '11111111-1111-1111-1111-111111111111', role = 'student' where email = 'student@amto.demo';
```

7. Start lokaal:

```bash
npm run dev
```

## Demo modus

Als Supabase-variabelen ontbreken, draait de app in demo modus. Je kunt dan lokaal door de UI klikken zonder echte backend.

## Belangrijkste routes

- `/login`
- `/dashboard`
- `/admin`
- `/admin/classes`
- `/admin/users`
- `/admin/programs`
- `/admin/subjects`
- `/teacher`
- `/teacher/subjects`
- `/teacher/lessons/new`
- `/teacher/assignments/new`
- `/teacher/submissions/[assignmentId]`
- `/student`
- `/student/assignments`
- `/student/submissions`
- `/subject/[id]`

## Deploy naar Vercel

1. Push de code naar GitHub.
2. Import de repository in Vercel.
3. Voeg dezelfde environment variables toe als lokaal.
4. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```
