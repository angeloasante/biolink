# BioFolio Analytics System Documentation

## Overview

BioFolio's analytics system provides comprehensive insights into profile performance, visitor behavior, and link engagement. This document details the database schema, tracking implementation, and metric calculations.

---

## Database Schema

### Tables

#### 1. `analytics_profile_views`
Tracks every visit to a user's public profile page.

```sql
CREATE TABLE analytics_profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id UUID NOT NULL REFERENCES auth.users(id),
  visitor_id TEXT NOT NULL,           -- Persistent browser ID (localStorage)
  session_id TEXT NOT NULL,           -- Session-specific ID (sessionStorage)
  ip_hash TEXT,                       -- Privacy-safe hashed identifier
  country TEXT,                       -- Visitor's country (via IP geolocation)
  city TEXT,                          -- Visitor's city
  device_type TEXT,                   -- 'mobile', 'desktop', 'tablet'
  os TEXT,                            -- 'iOS', 'Android', 'Windows', 'macOS', etc.
  browser TEXT,                       -- 'Chrome', 'Safari', 'Firefox', etc.
  referrer TEXT,                      -- Full referrer URL
  referrer_source TEXT,               -- Categorized: 'instagram', 'twitter', 'direct', etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `analytics_link_clicks`
Tracks every click on a link within a user's profile.

```sql
CREATE TABLE analytics_link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES linkfolio_links(id),
  profile_user_id UUID NOT NULL REFERENCES auth.users(id),
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  os TEXT,
  browser TEXT,
  referrer TEXT,
  link_position INTEGER,              -- Position of link in the list (1-indexed)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `analytics_daily_stats` (Aggregated)
Pre-computed daily statistics for fast dashboard loading.

```sql
CREATE TABLE analytics_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
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
```

#### 4. `analytics_country_stats` (Aggregated)
Daily country-level breakdown.

```sql
CREATE TABLE analytics_country_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  country TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, date, country)
);
```

#### 5. `analytics_source_stats` (Aggregated)
Daily traffic source breakdown.

```sql
CREATE TABLE analytics_source_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  source TEXT NOT NULL,               -- 'instagram', 'twitter', 'direct', etc.
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, date, source)
);
```

#### 6. `analytics_link_stats` (Aggregated)
Daily per-link performance.

```sql
CREATE TABLE analytics_link_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  link_id UUID NOT NULL REFERENCES linkfolio_links(id),
  date DATE NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, link_id, date)
);
```

#### 7. `analytics_hourly_stats` (Aggregated)
Hourly activity for heatmap visualization.

```sql
CREATE TABLE analytics_hourly_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  hour INTEGER NOT NULL,              -- 0-23
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  UNIQUE(user_id, date, hour)
);
```

---

## Tracking Implementation

### Client-Side Tracking (`lib/analytics.ts`)

#### Visitor Identification

```typescript
// Persistent visitor ID (survives browser sessions)
export function getVisitorId(): string {
  let visitorId = localStorage.getItem('bf_visitor_id')
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('bf_visitor_id', visitorId)
  }
  return visitorId
}

// Session ID (cleared when browser closes)
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('bf_session_id')
  if (!sessionId) {
    sessionId = 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('bf_session_id', sessionId)
  }
  return sessionId
}
```

**Why two IDs?**
- `visitor_id`: Identifies returning visitors across sessions (stored in localStorage)
- `session_id`: Groups actions within a single browsing session (stored in sessionStorage)

#### Device Detection

```typescript
export function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  const ua = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
  const isTablet = /ipad|tablet|playbook|silk/i.test(ua) || (isMobile && window.innerWidth >= 768)
  
  if (isTablet) return 'tablet'
  if (isMobile) return 'mobile'
  return 'desktop'
}
```

#### Geolocation

```typescript
export async function getGeoData(): Promise<GeoData> {
  // Using ipapi.co free tier (1000 requests/day)
  const response = await fetch('https://ipapi.co/json/', { cache: 'force-cache' })
  const data = await response.json()
  return {
    country: data.country_name || 'Unknown',
    city: data.city || '',
    region: data.region || ''
  }
}
```

**Why ipapi.co?**
- Free tier with 1000 requests/day
- No API key required for basic usage
- Returns country, city, region, timezone
- Response is cached to minimize API calls

#### Referrer Source Detection

```typescript
export function getReferrerSource(referrer: string): string {
  if (!referrer) return 'direct'
  
  const url = referrer.toLowerCase()
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
  if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('linkedin.com')) return 'linkedin'
  if (url.includes('youtube.com')) return 'youtube'
  // ... more sources
  
  return 'other'
}
```

---

## Metric Calculations

### Overview Metrics

| Metric | Formula | Description |
|--------|---------|-------------|
| **Total Views** | `SUM(total_views)` | All profile page loads in the period |
| **Unique Visitors** | `SUM(unique_views)` | Deduplicated by `visitor_id` |
| **Total Clicks** | `SUM(total_clicks)` | All link clicks in the period |
| **Unique Clicks** | `SUM(unique_clicks)` | Deduplicated by `visitor_id + link_id` |
| **Click-Through Rate (CTR)** | `(total_clicks / total_views) × 100` | Percentage of views that resulted in a click |
| **Bounce Rate** | `((views - clicks) / views) × 100` | Percentage of views with no interaction |

### Change Calculations

```typescript
// Compare current period to previous period of same length
const viewsChange = previousTotals.views > 0 
  ? ((currentTotals.views - previousTotals.views) / previousTotals.views) * 100 
  : 0
```

**Example:**
- Current 7 days: 150 views
- Previous 7 days: 100 views
- Change: `((150 - 100) / 100) × 100 = +50%`

### Visitor Types

```typescript
const visitorTypes = {
  new: (newVisitors / totalVisitors) * 100,      // First-time visitors
  returning: (returningVisitors / totalVisitors) * 100  // Seen before
}
```

**How we determine new vs returning:**
- Query for `visitor_id` in historical data
- If no previous records exist → New visitor
- If previous records exist → Returning visitor

### Device Breakdown

```typescript
const deviceStats = {
  mobile: (mobileViews / totalDeviceViews) * 100,
  desktop: (desktopViews / totalDeviceViews) * 100,
  tablet: (tabletViews / totalDeviceViews) * 100
}
```

### Link Performance

```typescript
linkStats = links.map(link => ({
  linkId: link.id,
  title: link.title,
  totalClicks: link.clicks,
  uniqueClicks: link.unique_clicks,
  ctr: (link.clicks / totalProfileViews) * 100  // Click rate relative to profile views
}))
```

---

## Data Flow

### 1. Profile View Tracking

```
User visits biofolio.link/u/username
         ↓
Public profile page loads
         ↓
useEffect triggers trackProfileView()
         ↓
Collect: visitor_id, session_id, device, geo, referrer
         ↓
Insert into analytics_profile_views
         ↓
Supabase trigger updates aggregated tables
```

### 2. Link Click Tracking

```
User clicks a link on profile
         ↓
handleLinkClick() intercepts click
         ↓
Collect: link_id, position, visitor_id, device, geo
         ↓
Insert into analytics_link_clicks
         ↓
Supabase trigger updates aggregated tables
         ↓
User redirected to destination URL
```

---

## Supabase Database Functions

### `record_profile_view`

```sql
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
  v_is_new_visitor BOOLEAN;
BEGIN
  -- Check if this visitor has viewed this profile before today
  SELECT NOT EXISTS(
    SELECT 1 FROM analytics_profile_views
    WHERE profile_user_id = p_profile_user_id
    AND visitor_id = p_visitor_id
    AND DATE(created_at) = CURRENT_DATE
  ) INTO v_is_unique;
  
  -- Check if this is a new visitor (never seen before)
  SELECT NOT EXISTS(
    SELECT 1 FROM analytics_profile_views
    WHERE profile_user_id = p_profile_user_id
    AND visitor_id = p_visitor_id
    AND DATE(created_at) < CURRENT_DATE
  ) INTO v_is_new_visitor;
  
  -- Insert raw view record
  INSERT INTO analytics_profile_views (
    profile_user_id, visitor_id, session_id, ip_hash,
    country, city, device_type, os, browser, referrer, referrer_source
  ) VALUES (
    p_profile_user_id, p_visitor_id, p_session_id, p_ip_hash,
    p_country, p_city, p_device_type, p_os, p_browser, p_referrer, p_referrer_source
  );
  
  -- Update daily stats
  INSERT INTO analytics_daily_stats (user_id, date, total_views, unique_views, 
    mobile_views, desktop_views, tablet_views, new_visitors, returning_visitors)
  VALUES (
    p_profile_user_id, CURRENT_DATE, 1,
    CASE WHEN v_is_unique THEN 1 ELSE 0 END,
    CASE WHEN p_device_type = 'mobile' THEN 1 ELSE 0 END,
    CASE WHEN p_device_type = 'desktop' THEN 1 ELSE 0 END,
    CASE WHEN p_device_type = 'tablet' THEN 1 ELSE 0 END,
    CASE WHEN v_is_new_visitor THEN 1 ELSE 0 END,
    CASE WHEN NOT v_is_new_visitor THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    total_views = analytics_daily_stats.total_views + 1,
    unique_views = analytics_daily_stats.unique_views + CASE WHEN v_is_unique THEN 1 ELSE 0 END,
    mobile_views = analytics_daily_stats.mobile_views + CASE WHEN p_device_type = 'mobile' THEN 1 ELSE 0 END,
    desktop_views = analytics_daily_stats.desktop_views + CASE WHEN p_device_type = 'desktop' THEN 1 ELSE 0 END,
    tablet_views = analytics_daily_stats.tablet_views + CASE WHEN p_device_type = 'tablet' THEN 1 ELSE 0 END,
    new_visitors = analytics_daily_stats.new_visitors + CASE WHEN v_is_new_visitor THEN 1 ELSE 0 END,
    returning_visitors = analytics_daily_stats.returning_visitors + CASE WHEN NOT v_is_new_visitor THEN 1 ELSE 0 END;

  -- Update country stats
  INSERT INTO analytics_country_stats (user_id, date, country, views)
  VALUES (p_profile_user_id, CURRENT_DATE, COALESCE(p_country, 'Unknown'), 1)
  ON CONFLICT (user_id, date, country) DO UPDATE SET
    views = analytics_country_stats.views + 1;

  -- Update source stats
  INSERT INTO analytics_source_stats (user_id, date, source, views)
  VALUES (p_profile_user_id, CURRENT_DATE, COALESCE(p_referrer_source, 'direct'), 1)
  ON CONFLICT (user_id, date, source) DO UPDATE SET
    views = analytics_source_stats.views + 1;

  -- Update hourly stats
  INSERT INTO analytics_hourly_stats (user_id, date, hour, views)
  VALUES (p_profile_user_id, CURRENT_DATE, EXTRACT(HOUR FROM NOW()), 1)
  ON CONFLICT (user_id, date, hour) DO UPDATE SET
    views = analytics_hourly_stats.views + 1;
END;
$$ LANGUAGE plpgsql;
```

---

## Analytics Dashboard Components

### 1. Stats Cards
Displays key metrics with period-over-period change indicators.

| Card | Data Source | Calculation |
|------|-------------|-------------|
| Total Views | `overview.totalViews` | Sum of `total_views` from `analytics_daily_stats` |
| Total Clicks | `overview.totalClicks` | Sum of `total_clicks` from `analytics_daily_stats` |
| Unique Visitors | `overview.uniqueVisitors` | Sum of `unique_views` from `analytics_daily_stats` |
| Click Rate | `overview.ctr` | `(totalClicks / totalViews) × 100` |

### 2. Views Over Time Chart
Bar chart showing daily view counts.

```typescript
dailyStats.map(day => ({
  date: day.date,
  views: day.views,
  height: (day.views / maxViews) * 100  // Percentage of tallest bar
}))
```

### 3. Traffic Sources
Horizontal bar chart showing where visitors come from.

| Source | Description |
|--------|-------------|
| `direct` | No referrer (typed URL, bookmarks) |
| `instagram` | From Instagram bio/stories |
| `twitter` | From Twitter/X |
| `facebook` | From Facebook |
| `tiktok` | From TikTok bio |
| `linkedin` | From LinkedIn |
| `youtube` | From YouTube |
| `qr` | From QR code scans |
| `other` | Any other referrer |

### 4. Top Countries
List of countries ranked by view count with flag emojis.

### 5. Device Breakdown
Donut/bar chart showing mobile vs desktop vs tablet split.

### 6. Top Links
Ranked list of links by click count.

### 7. Hourly Heatmap
24-hour grid showing activity intensity by hour.

```typescript
hourlyStats.map(hour => ({
  hour: hour.hour,  // 0-23
  intensity: hour.views / maxHourlyViews,  // 0-1 for color intensity
}))
```

### 8. Visitor Types
Pie chart showing new vs returning visitor ratio.

### 9. Recent Activity
Live feed of recent views and clicks with:
- Action type (view/click)
- Location (city, country)
- Device type
- Time ago

---

## Privacy Considerations

1. **No PII Storage**: We don't store IP addresses directly
2. **Hashed Identifiers**: IPs are hashed before any processing
3. **Aggregated Data**: Individual records are aggregated into stats tables
4. **Local Storage IDs**: Visitor IDs are generated client-side, not linked to personal data
5. **Geo Data**: Only country/city level, no precise location

---

## Performance Optimizations

1. **Pre-aggregated Tables**: Daily/hourly stats are pre-computed for fast reads
2. **Database Functions**: `record_profile_view` does all inserts/updates atomically
3. **Indexes**: All foreign keys and frequently queried columns are indexed
4. **Caching**: Geo API responses are cached to reduce external calls
5. **Batch Updates**: Stats tables use `ON CONFLICT DO UPDATE` for efficient upserts

---

## Time Range Options

| Range | Days | Use Case |
|-------|------|----------|
| 7 Days | 7 | Recent trends, quick overview |
| 30 Days | 30 | Monthly performance (default) |
| 90 Days | 90 | Quarterly trends, seasonal patterns |

---

## Future Enhancements

- [ ] Real-time analytics with Supabase Realtime
- [ ] A/B testing for link order optimization
- [ ] Goal tracking (target views/clicks)
- [ ] Export to CSV/PDF
- [ ] Email reports (weekly/monthly)
- [ ] UTM parameter tracking
- [ ] Custom date range picker
- [ ] Comparison mode (this period vs last period)
