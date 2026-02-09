-- Migration: Add Localization and Moderation Support
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS title_ko TEXT,
ADD COLUMN IF NOT EXISTS description_ko TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Optional: Update existing records to approved status so they don't disappear
UPDATE ideas SET status = 'approved' WHERE status IS NULL;

-- Comment for the user: please run this in your Supabase SQL Editor.
