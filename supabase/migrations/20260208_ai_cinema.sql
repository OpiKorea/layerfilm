-- Add 'role' to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'assistant' CHECK (role IN ('director', 'assistant', 'admin'));

-- Add columns to ideas table
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS genre text,
ADD COLUMN IF NOT EXISTS runtime text,
ADD COLUMN IF NOT EXISTS ai_tool text,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count integer DEFAULT 0;

-- Update existing ideas to have default genre if null (optional, for safety)
UPDATE ideas SET genre = 'Sci-Fi' WHERE genre IS NULL;
UPDATE ideas SET runtime = '00:00' WHERE runtime IS NULL;
UPDATE ideas SET ai_tool = 'Unknown' WHERE ai_tool IS NULL;

-- Set 'Loca' as Admin/Director (if exists)
UPDATE profiles SET role = 'director' WHERE username = 'Loca';
