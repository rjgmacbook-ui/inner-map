-- Humanistic Task Manager — Supabase Schema
-- Run this once in the Supabase SQL editor

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────
-- TRIGGERS TABLE
-- ─────────────────────────────────────────
create table if not exists triggers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  name        text not null,
  description text,
  created_at  timestamptz default now()
);

alter table triggers enable row level security;

create policy "users own triggers"
  on triggers for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────
-- EMOTIONAL CHARGES TABLE
-- ─────────────────────────────────────────
create table if not exists emotional_charges (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users not null,
  name              text not null,
  typical_intensity smallint check (typical_intensity between 1 and 10),
  created_at        timestamptz default now()
);

alter table emotional_charges enable row level security;

create policy "users own emotional_charges"
  on emotional_charges for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────
-- REACTIONS TABLE (unhealthy)
-- ─────────────────────────────────────────
create table if not exists reactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  name        text not null,
  description text,
  created_at  timestamptz default now()
);

alter table reactions enable row level security;

create policy "users own reactions"
  on reactions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────
-- TOOLKIT ITEMS TABLE (healthy)
-- ─────────────────────────────────────────
create table if not exists toolkit_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  name        text not null,
  category    text default 'other' check (category in ('breathing','grounding','somatic','reframe','compassion','curiosity','courage','other')),
  description text,
  steps       text[],
  created_at  timestamptz default now()
);

alter table toolkit_items enable row level security;

create policy "users own toolkit_items"
  on toolkit_items for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────
-- ENCOUNTERS TABLE
-- ─────────────────────────────────────────
create table if not exists encounters (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users not null,
  created_at        timestamptz default now(),
  event_description text not null,
  trigger_id        uuid references triggers,
  charge_id         uuid references emotional_charges,
  charge_intensity  smallint check (charge_intensity between 1 and 10),
  reaction_id       uuid references reactions,
  pause_completed   boolean default false,
  pause_duration_s  smallint default 0,
  toolkit_item_id   uuid references toolkit_items,
  next_action       text,
  reflection_note   text,
  resolved          boolean default false
);

alter table encounters enable row level security;

create policy "users own encounters"
  on encounters for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────
-- USER SETTINGS TABLE
-- ─────────────────────────────────────────
create table if not exists user_settings (
  user_id             uuid primary key references auth.users,
  display_name        text,
  onboarding_complete boolean default false
);

alter table user_settings enable row level security;

create policy "users own settings"
  on user_settings for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
