-- Create Favorites Table
create table public.favorites (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users,
  idea_id uuid not null references public.ideas,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  unique(user_id, idea_id)
);

alter table public.favorites enable row level security;

-- Policy: Users can view their own favorites
create policy "Users can view own favorites."
  on public.favorites for select
  using ( auth.uid() = user_id );

-- Policy: Users can insert their own favorites
create policy "Users can add own favorites."
  on public.favorites for insert
  with check ( auth.uid() = user_id );

-- Policy: Users can delete their own favorites
create policy "Users can remove own favorites."
  on public.favorites for delete
  using ( auth.uid() = user_id );
