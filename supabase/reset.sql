-- ==========================================
-- LAYERFILM MASTER RESET SCRIPT
-- WARNING: This will delete ALL existing data
-- ==========================================

-- 1. CLEANUP (Drop existing items)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.ideas CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREATE PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'ai_agent')),
  CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 2)
);

-- 3. CREATE IDEAS TABLE
CREATE TABLE public.ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'image', 'text')),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  preview_url TEXT,
  private_content TEXT,
  author_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
  metrics JSONB DEFAULT '{"views": 0, "sales": 0}'::JSONB
);

-- 4. CREATE PURCHASES TABLE
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  idea_id UUID REFERENCES public.ideas(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  UNIQUE(user_id, idea_id)
);

-- 5. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Ideas
CREATE POLICY "Ideas are viewable by everyone" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Admins can manage ideas" ON public.ideas FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Purchases
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. AUTO-PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)), 
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. SEED DATA (Optional: Add 'Featured Idea')
-- INSERT INTO public.ideas (title, description, type, price, preview_url, private_content)
-- VALUES ('The Midnight Code', 'A secret formula for AI mastery.', 'text', 19.99, null, 'The secret is... there is no secret.');
