-- Add unique constraint to username column
ALTER TABLE profiles
ADD CONSTRAINT profiles_username_key UNIQUE (username);
