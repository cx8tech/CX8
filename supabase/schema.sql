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
