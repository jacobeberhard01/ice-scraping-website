create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null,
  street_address text not null,
  apartment_complex text,
  phone text not null,
  car_make text not null,
  car_model text not null,
  car_color text not null,
  license_plate text not null,
  service_day text not null check (service_day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  scrape_by_time text not null,
  weekly_schedule jsonb not null default '{}'::jsonb,
  subscription_tier text not null check (subscription_tier in ('Basic', 'Premium')),
  subscription_frequency text not null check (subscription_frequency in ('Daily', 'Weekly', 'Monthly', 'Semester')),
  status text not null default 'Active' check (status in ('Active', 'Expired')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
alter table public.bookings add column if not exists service_day text;
alter table public.bookings add column if not exists weekly_schedule jsonb not null default '{}'::jsonb;
alter table public.bookings add column if not exists license_state text;

alter table public.bookings add column if not exists payment_option text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_payment_option_check') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_payment_option_check CHECK (payment_option IN ('Venmo', 'Zelle', 'Cash'));
  END IF;
END$$;
