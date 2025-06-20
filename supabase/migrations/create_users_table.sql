-- ---------------------------------------------------------------------------
-- Create users table
-- ---------------------------------------------------------------------------

create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  user_type text not null check (user_type in ('contractor', 'client')),
  company_name text,
  contact_person text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ---------------------------------------------------------------------------
-- Enable Row Level Security
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;

-- ---------------------------------------------------------------------------
-- Policies
-- ---------------------------------------------------------------------------

drop policy if exists "Users can view their own data" on public.users;

create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can update their own data" on public.users;

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

drop policy if exists "Users can insert their own row" on public.users;

create policy "Users can insert their own row" on public.users
  for insert with check (auth.uid() = id);

drop policy if exists "Users can delete their own row" on public.users;

create policy "Users can delete their own row" on public.users
  for delete using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Index
-- ---------------------------------------------------------------------------

create index if not exists users_email_idx on public.users (email);

-- ---------------------------------------------------------------------------
-- Trigger function to insert into public.users when a new auth.users is created
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, user_type, company_name, contact_person, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'contact_person',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------------
-- Trigger on auth.users to call the trigger function
-- ---------------------------------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
