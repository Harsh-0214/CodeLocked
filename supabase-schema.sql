-- Run this in your Supabase SQL editor to create the lessons table

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  content text not null,
  tags text[] default '{}',
  category text not null default 'General',
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  real_world_example text default '',
  key_takeaways text[] default '{}',
  conversation_context text default '',
  technologies_used jsonb default '[]',
  resume_skills jsonb default '[]',
  why_it_matters text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for sorting by newest first
create index if not exists lessons_created_at_idx on lessons (created_at desc);

-- Enable Row Level Security (public read, no anonymous writes)
alter table lessons enable row level security;

create policy "Public read access" on lessons
  for select using (true);

-- If you already created the table without the new columns, run this to add them:
-- alter table lessons add column if not exists technologies_used jsonb default '[]';
-- alter table lessons add column if not exists resume_skills jsonb default '[]';
-- alter table lessons add column if not exists why_it_matters text default '';
