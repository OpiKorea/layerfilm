-- Migration: Add video and thumbnail URL columns to ideas table
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Update existing records if necessary (optional)
-- UPDATE ideas SET video_url = preview_url WHERE video_url IS NULL;
