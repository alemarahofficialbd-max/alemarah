-- Run this once in the Supabase SQL editor for this project.
-- Adds a `customers` identity table (phone + password + status) and links
-- existing `clients` rows (one row per flat/shop unit) to their owning
-- customer, so one phone number/password can own multiple units.
--
-- Safe to run even if `clients` already has real data: existing rows are
-- backfilled by matching on phone number, and nothing is deleted.

create table if not exists customers (
  id text primary key,
  name text,
  phone text,
  password text default 'password123',
  status text default 'সক্রিয় (Active)'
);

alter table clients
  add column if not exists customer_id text references customers(id);

-- Backfill: one customer per distinct phone number currently in clients.
insert into customers (id, name, phone, password, status)
select distinct on (phone)
  'CUS-' || regexp_replace(phone, '[^0-9]', '', 'g') as id,
  name,
  phone,
  coalesce(password, 'password123'),
  'সক্রিয় (Active)'
from clients
where phone is not null and phone <> ''
on conflict (id) do nothing;

update clients c
set customer_id = 'CUS-' || regexp_replace(c.phone, '[^0-9]', '', 'g')
where c.customer_id is null
  and c.phone is not null and c.phone <> '';

-- Recommended: enable Row Level Security and scope policies to your
-- actual auth setup before going to production with real customer data.
-- alter table customers enable row level security;
