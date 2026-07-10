-- ============================================================
-- CX8 Technologies — Supabase Schema
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Actuator cross-reference dataset (Tool 5) ──
-- Each row is one actuator record. The full record is stored
-- as JSONB so the client can reconstruct the exact same DB
-- array format the tool expects, without any server-side logic.

create table if not exists public.actuator_data (
  id      serial primary key,
  brand   text   not null,
  mode    text   not null check (mode in ('DA', 'SA')),
  record  jsonb  not null
);

create index if not exists actuator_data_brand_idx on public.actuator_data (brand);
create index if not exists actuator_data_mode_idx  on public.actuator_data (mode);

-- Row Level Security: only authenticated users can read.
-- When payment is live, tighten to: auth.uid() in (
--   select id from profiles where is_paid = true
-- )
alter table public.actuator_data enable row level security;

create policy "authenticated_read"
  on public.actuator_data
  for select
  to authenticated
  using (true);

-- No public inserts / updates / deletes — data is seeded
-- only via the service-role key (scripts/seed-tool5.js).

-- ── Supplier listing submissions (Get Listed form) ──

create table if not exists public.supplier_submissions (
  id            uuid        default gen_random_uuid() primary key,
  submitted_at  timestamptz default now(),
  company_name  text,
  contact_email text,
  data          jsonb not null
);

alter table public.supplier_submissions enable row level security;

-- Anyone (including unauthenticated visitors) can submit the form
create policy "anon_insert"
  on public.supplier_submissions
  for insert
  to anon
  with check (true);

-- Only authenticated users (admins) can view submissions
create policy "auth_read"
  on public.supplier_submissions
  for select
  to authenticated
  using (true);
