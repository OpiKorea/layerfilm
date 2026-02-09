-- Migration: Harden Admin Security on Ideas Table
-- Only admins should be able to update 'status'

-- 1. Create a function to check admin role
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing update policy if any to avoid confusion
-- (Assuming standard policy was "Users can update their own ideas")
-- We need to make sure 'status' isn't changed by authors.

-- 3. Create a more granular update policy using a Trigger for column-level security
-- or just strict RLS if Supabase supports it well.
-- Easiest way in Postgres for column-level checking: Trigger.

CREATE OR REPLACE FUNCTION check_status_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Check if user is admin
    IF NOT is_admin() THEN
      RAISE EXCEPTION 'Only administrators can change film status.';
    END IF;
  END IF;
  
  -- If other fields are being changed, verify author_id
  IF NOT is_admin() AND OLD.author_id != auth.uid() THEN
      RAISE EXCEPTION 'You do not have permission to update this film.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_check_status_update ON ideas;
CREATE TRIGGER tr_check_status_update
BEFORE UPDATE ON ideas
FOR EACH ROW EXECUTE FUNCTION check_status_update();
