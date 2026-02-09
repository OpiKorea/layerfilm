create table public.ideas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price numeric not null,
  type text not null check (type in ('text', 'image', 'video')),
  private_content text,
  author_name text,
  author_avatar text,
  views_count integer default 0,
  likes_count integer default 0
);

-- RLS
alter table public.ideas enable row level security;

-- Everyone can view ideas
create policy "Ideas are public" on public.ideas
  for select using (true);

-- Only admin can update/insert (for now, or AI agent)
create policy "Admin can manage ideas" on public.ideas
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Purchase Table (if not exists)
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  idea_id uuid references public.ideas not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, idea_id)
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);

create policy "Users can insert own purchases" on public.purchases
  for insert with check (auth.uid() = user_id);
