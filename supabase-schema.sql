-- LinkFolio Database Schema
-- Run this in your Supabase SQL Editor

-- Table for user profiles
CREATE TABLE linkfolio_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  location TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for user links
CREATE TABLE linkfolio_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_linkfolio_profiles_user_id ON linkfolio_profiles(user_id);
CREATE INDEX idx_linkfolio_profiles_username ON linkfolio_profiles(username);
CREATE INDEX idx_linkfolio_links_user_id ON linkfolio_links(user_id);
CREATE INDEX idx_linkfolio_links_sort_order ON linkfolio_links(user_id, sort_order);

-- Enable Row Level Security
ALTER TABLE linkfolio_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkfolio_links ENABLE ROW LEVEL SECURITY;

-- Policies for linkfolio_profiles
-- Users can read any profile (for public profile pages)
CREATE POLICY "Public profiles are viewable by everyone" 
ON linkfolio_profiles FOR SELECT 
USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" 
ON linkfolio_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON linkfolio_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own profile
CREATE POLICY "Users can delete own profile" 
ON linkfolio_profiles FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for linkfolio_links
-- Anyone can view links (for public profile pages)
CREATE POLICY "Links are viewable by everyone" 
ON linkfolio_links FOR SELECT 
USING (true);

-- Users can only insert their own links
CREATE POLICY "Users can insert own links" 
ON linkfolio_links FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own links
CREATE POLICY "Users can update own links" 
ON linkfolio_links FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own links
CREATE POLICY "Users can delete own links" 
ON linkfolio_links FOR DELETE 
USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_linkfolio_profiles_updated_at
  BEFORE UPDATE ON linkfolio_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkfolio_links_updated_at
  BEFORE UPDATE ON linkfolio_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup (optional - can be called from app)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO linkfolio_profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
