-- Create a table for public profiles (optional, but good practice)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  username text,
  avatar_url text,
  primary key (id)
);

alter table public.profiles enable row level security;

-- Create a table for Ideas
create table public.ideas (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null default 0,
  type text not null check (type in ('text', 'image', 'video')),
  private_content text, -- This should be protected and only returned via function/action
  author_id uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

alter table public.ideas enable row level security;

-- Create policy to allow everyone to see public details of ideas
create policy "Public ideas are viewable by everyone."
  on public.ideas for select
  using ( true );

-- Create a table for Purchases
create table public.purchases (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users,
  idea_id uuid not null references public.ideas,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

alter table public.purchases enable row level security;

-- Policy: Users can see their own purchases
create policy "Users can view own purchases."
  on public.purchases for select
  using ( auth.uid() = user_id );

-- Insert some dummy data for testing
insert into public.ideas (title, description, price, type, private_content)
values
  ('10 Viral Video Hooks', 'A curated list of high-retention intros.', 49.99, 'text', '# 10 Viral Hooks\n1. Stop doing this...'),
  ('Cinematic Color Grading', 'Sony/Canon log footage LUTs.', 29.00, 'image', 'https://example.com/luts.zip'),
  ('Advanced React Pattern', 'Compound Components Masterclass.', 99.00, 'video', 'https://example.com/react-course.mp4');
