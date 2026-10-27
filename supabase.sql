create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  address text not null,
  preferred_time text,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
