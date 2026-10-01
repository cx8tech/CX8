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

-- Row Level Security with no policies: the table is unreadable with the
-- public anon key, even for logged-in users. All access goes through
-- /api/tool5-data, which uses the service-role key and enforces the
-- Pro check and rate limits.
alter table public.actuator_data enable row level security;

drop policy if exists "authenticated_read" on public.actuator_data;

-- No public inserts / updates / deletes — data is seeded
-- only via the service-role key (scripts/seed-tool5.js).

-- ── Tool 5 free-preview rate limiting ──
-- One row per single-model lookup from /api/tool5-data. `visitor` is a
-- keyed hash of the requester's IP (no raw IPs stored). RLS is enabled with
-- no policies, so only the service-role API can read or write it.

create table if not exists public.preview_rate_limits (
  id            bigserial   primary key,
  visitor       text        not null,
  requested_at  timestamptz not null default now()
);

create index if not exists preview_rate_limits_visitor_idx
  on public.preview_rate_limits (visitor, requested_at);

alter table public.preview_rate_limits enable row level security;

-- ── Tool 5 pay-per-query jobs ──
-- One row per checkout for a set of models (€2 each). The LemonSqueezy
-- webhook marks it paid; paid models can be re-run for 24 hours
-- (expires_at). Paid rows this month drive the regular-user page.
-- Only the service-role API reads or writes it (RLS, no policies).

create table if not exists public.comparison_jobs (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  models        jsonb       not null,
  model_count   int         not null,
  amount_cents  int         not null,
  status        text        not null default 'pending' check (status in ('pending', 'paid', 'refunded')),
  order_id      text,
  created_at    timestamptz not null default now(),
  paid_at       timestamptz,
  expires_at    timestamptz
);

create index if not exists comparison_jobs_user_idx
  on public.comparison_jobs (user_id, status, paid_at);

alter table public.comparison_jobs enable row level security;

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

-- No read policy: every registered user is "authenticated", so a read
-- policy would expose all submissions. View them in the Supabase dashboard.
drop policy if exists "auth_read" on public.supplier_submissions;

-- ── Profiles (table created in the dashboard) ──
-- Users may read their own row but never update it: `plan` is set only by
-- /api/lemonsqueezy-webhook with the service-role key. An update policy
-- would let anyone set their own plan to 'pro'.
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;
