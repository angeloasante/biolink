-- BioFolio Analytics Database Schema
-- Run this in your Supabase SQL Editor

-- Profile views tracking table
CREATE TABLE IF NOT EXISTS analytics_profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id TEXT, -- Anonymous visitor ID (from cookie/localStorage)
  session_id TEXT, -- Session identifier
  ip_hash TEXT, -- Hashed IP for privacy
  country TEXT,
  city TEXT,
  region TEXT,
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  os TEXT, -- 'iOS', 'Android', 'Windows', 'macOS', etc.
  browser TEXT,
  referrer TEXT, -- Where they came from
  referrer_source TEXT, -- 'instagram', 'twitter', 'direct', 'qr', etc.
  is_unique BOOLEAN DEFAULT true, -- First view in 24h window
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link clicks tracking table
CREATE TABLE IF NOT EXISTS analytics_link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL,
  profile_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id TEXT,
  session_id TEXT,
  ip_hash TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  os TEXT,
  browser TEXT,
  referrer TEXT,
  link_position INTEGER, -- Position of link when clicked
  is_unique BOOLEAN DEFAULT true, -- First click on this link in 24h
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily aggregated stats (for faster queries)
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  mobile_views INTEGER DEFAULT 0,
  desktop_views INTEGER DEFAULT 0,
  tablet_views INTEGER DEFAULT 0,
  new_visitors INTEGER DEFAULT 0,
  returning_visitors INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Country stats aggregation
CREATE TABLE IF NOT EXISTS analytics_country_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, country, date)
);

-- Link performance aggregation
CREATE TABLE IF NOT EXISTS analytics_link_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  link_id UUID NOT NULL,
  date DATE NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, link_id, date)
);

-- Hourly activity for heatmap
CREATE TABLE IF NOT EXISTS analytics_hourly_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, date, hour)
);

-- Source/referrer stats
CREATE TABLE IF NOT EXISTS analytics_source_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- 'instagram', 'twitter', 'direct', etc.
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, source, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_views_user_id ON analytics_profile_views(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON analytics_profile_views(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_views_visitor ON analytics_profile_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_user_id ON analytics_link_clicks(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON analytics_link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_created_at ON analytics_link_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON analytics_daily_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_country_stats_user_date ON analytics_country_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_link_stats_user_date ON analytics_link_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_hourly_stats_user_date ON analytics_hourly_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_source_stats_user_date ON analytics_source_stats(user_id, date);

-- Enable RLS
ALTER TABLE analytics_profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_country_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_link_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_hourly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_source_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_profile_views (anyone can insert, owner can read)
CREATE POLICY "Anyone can insert profile views" ON analytics_profile_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own profile views" ON analytics_profile_views
  FOR SELECT USING (auth.uid() = profile_user_id);

-- RLS Policies for analytics_link_clicks
CREATE POLICY "Anyone can insert link clicks" ON analytics_link_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own link clicks" ON analytics_link_clicks
  FOR SELECT USING (auth.uid() = profile_user_id);

-- RLS Policies for aggregated tables (owner only)
CREATE POLICY "Users can manage their own daily stats" ON analytics_daily_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own country stats" ON analytics_country_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own link stats" ON analytics_link_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own hourly stats" ON analytics_hourly_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own source stats" ON analytics_source_stats
  FOR ALL USING (auth.uid() = user_id);

-- Function to record a profile view and update aggregations
CREATE OR REPLACE FUNCTION record_profile_view(
  p_profile_user_id UUID,
  p_visitor_id TEXT,
  p_session_id TEXT,
  p_ip_hash TEXT,
  p_country TEXT,
  p_city TEXT,
  p_device_type TEXT,
  p_os TEXT,
  p_browser TEXT,
  p_referrer TEXT,
  p_referrer_source TEXT
) RETURNS void AS $$
DECLARE
  v_is_unique BOOLEAN;
  v_is_returning BOOLEAN;
  v_today DATE := CURRENT_DATE;
  v_hour INTEGER := EXTRACT(HOUR FROM NOW());
BEGIN
  -- Check if unique (visitor hasn't viewed in last 24h)
  SELECT NOT EXISTS(
    SELECT 1 FROM analytics_profile_views 
    WHERE profile_user_id = p_profile_user_id 
    AND visitor_id = p_visitor_id 
    AND created_at > NOW() - INTERVAL '24 hours'
  ) INTO v_is_unique;

  -- Check if returning visitor (has any previous views)
  SELECT EXISTS(
    SELECT 1 FROM analytics_profile_views 
    WHERE profile_user_id = p_profile_user_id 
    AND visitor_id = p_visitor_id
    AND created_at < NOW() - INTERVAL '24 hours'
  ) INTO v_is_returning;

  -- Insert the view record
  INSERT INTO analytics_profile_views (
    profile_user_id, visitor_id, session_id, ip_hash, country, city,
    device_type, os, browser, referrer, referrer_source, is_unique
  ) VALUES (
    p_profile_user_id, p_visitor_id, p_session_id, p_ip_hash, p_country, p_city,
    p_device_type, p_os, p_browser, p_referrer, p_referrer_source, v_is_unique
  );

  -- Update daily stats
  INSERT INTO analytics_daily_stats (user_id, date, total_views, unique_views, mobile_views, desktop_views, tablet_views, new_visitors, returning_visitors)
  VALUES (
    p_profile_user_id, v_today, 1,
    CASE WHEN v_is_unique THEN 1 ELSE 0 END,
    CASE WHEN p_device_type = 'mobile' THEN 1 ELSE 0 END,
    CASE WHEN p_device_type = 'desktop' THEN 1 ELSE 0 END,
    CASE WHEN p_device_type = 'tablet' THEN 1 ELSE 0 END,
    CASE WHEN v_is_unique AND NOT v_is_returning THEN 1 ELSE 0 END,
    CASE WHEN v_is_unique AND v_is_returning THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    total_views = analytics_daily_stats.total_views + 1,
    unique_views = analytics_daily_stats.unique_views + CASE WHEN v_is_unique THEN 1 ELSE 0 END,
    mobile_views = analytics_daily_stats.mobile_views + CASE WHEN p_device_type = 'mobile' THEN 1 ELSE 0 END,
    desktop_views = analytics_daily_stats.desktop_views + CASE WHEN p_device_type = 'desktop' THEN 1 ELSE 0 END,
    tablet_views = analytics_daily_stats.tablet_views + CASE WHEN p_device_type = 'tablet' THEN 1 ELSE 0 END,
    new_visitors = analytics_daily_stats.new_visitors + CASE WHEN v_is_unique AND NOT v_is_returning THEN 1 ELSE 0 END,
    returning_visitors = analytics_daily_stats.returning_visitors + CASE WHEN v_is_unique AND v_is_returning THEN 1 ELSE 0 END;

  -- Update country stats
  IF p_country IS NOT NULL AND p_country != '' THEN
    INSERT INTO analytics_country_stats (user_id, country, date, views)
    VALUES (p_profile_user_id, p_country, v_today, 1)
    ON CONFLICT (user_id, country, date) DO UPDATE SET
      views = analytics_country_stats.views + 1;
  END IF;

  -- Update hourly stats
  INSERT INTO analytics_hourly_stats (user_id, date, hour, views)
  VALUES (p_profile_user_id, v_today, v_hour, 1)
  ON CONFLICT (user_id, date, hour) DO UPDATE SET
    views = analytics_hourly_stats.views + 1;

  -- Update source stats
  IF p_referrer_source IS NOT NULL AND p_referrer_source != '' THEN
    INSERT INTO analytics_source_stats (user_id, source, date, views)
    VALUES (p_profile_user_id, p_referrer_source, v_today, 1)
    ON CONFLICT (user_id, source, date) DO UPDATE SET
      views = analytics_source_stats.views + 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a link click
CREATE OR REPLACE FUNCTION record_link_click(
  p_link_id UUID,
  p_profile_user_id UUID,
  p_visitor_id TEXT,
  p_session_id TEXT,
  p_ip_hash TEXT,
  p_country TEXT,
  p_city TEXT,
  p_device_type TEXT,
  p_os TEXT,
  p_browser TEXT,
  p_referrer TEXT,
  p_link_position INTEGER
) RETURNS void AS $$
DECLARE
  v_is_unique BOOLEAN;
  v_today DATE := CURRENT_DATE;
  v_hour INTEGER := EXTRACT(HOUR FROM NOW());
BEGIN
  -- Check if unique click (visitor hasn't clicked this link in last 24h)
  SELECT NOT EXISTS(
    SELECT 1 FROM analytics_link_clicks 
    WHERE link_id = p_link_id 
    AND visitor_id = p_visitor_id 
    AND created_at > NOW() - INTERVAL '24 hours'
  ) INTO v_is_unique;

  -- Insert the click record
  INSERT INTO analytics_link_clicks (
    link_id, profile_user_id, visitor_id, session_id, ip_hash, country, city,
    device_type, os, browser, referrer, link_position, is_unique
  ) VALUES (
    p_link_id, p_profile_user_id, p_visitor_id, p_session_id, p_ip_hash, p_country, p_city,
    p_device_type, p_os, p_browser, p_referrer, p_link_position, v_is_unique
  );

  -- Update daily stats
  INSERT INTO analytics_daily_stats (user_id, date, total_clicks, unique_clicks)
  VALUES (p_profile_user_id, v_today, 1, CASE WHEN v_is_unique THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, date) DO UPDATE SET
    total_clicks = analytics_daily_stats.total_clicks + 1,
    unique_clicks = analytics_daily_stats.unique_clicks + CASE WHEN v_is_unique THEN 1 ELSE 0 END;

  -- Update country stats
  IF p_country IS NOT NULL AND p_country != '' THEN
    INSERT INTO analytics_country_stats (user_id, country, date, clicks)
    VALUES (p_profile_user_id, p_country, v_today, 1)
    ON CONFLICT (user_id, country, date) DO UPDATE SET
      clicks = analytics_country_stats.clicks + 1;
  END IF;

  -- Update link stats
  INSERT INTO analytics_link_stats (user_id, link_id, date, total_clicks, unique_clicks)
  VALUES (p_profile_user_id, p_link_id, v_today, 1, CASE WHEN v_is_unique THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, link_id, date) DO UPDATE SET
    total_clicks = analytics_link_stats.total_clicks + 1,
    unique_clicks = analytics_link_stats.unique_clicks + CASE WHEN v_is_unique THEN 1 ELSE 0 END;

  -- Update hourly stats
  INSERT INTO analytics_hourly_stats (user_id, date, hour, clicks)
  VALUES (p_profile_user_id, v_today, v_hour, 1)
  ON CONFLICT (user_id, date, hour) DO UPDATE SET
    clicks = analytics_hourly_stats.clicks + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION record_profile_view TO anon, authenticated;
GRANT EXECUTE ON FUNCTION record_link_click TO anon, authenticated;
