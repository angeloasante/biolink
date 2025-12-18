import { supabase } from './supabase'

// Generate a unique visitor ID (stored in localStorage)
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  
  let visitorId = localStorage.getItem('bf_visitor_id')
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('bf_visitor_id', visitorId)
  }
  return visitorId
}

// Generate a session ID (stored in sessionStorage)
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('bf_session_id')
  if (!sessionId) {
    sessionId = 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('bf_session_id', sessionId)
  }
  return sessionId
}

// Detect device type
export function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  
  const ua = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
  const isTablet = /ipad|tablet|playbook|silk/i.test(ua) || (isMobile && window.innerWidth >= 768)
  
  if (isTablet) return 'tablet'
  if (isMobile) return 'mobile'
  return 'desktop'
}

// Detect OS
export function getOS(): string {
  if (typeof window === 'undefined') return 'Unknown'
  
  const ua = navigator.userAgent
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  return 'Other'
}

// Detect browser
export function getBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown'
  
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  return 'Other'
}

// Parse referrer to get source
export function getReferrerSource(referrer: string): string {
  if (!referrer) return 'direct'
  
  const url = referrer.toLowerCase()
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
  if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('linkedin.com')) return 'linkedin'
  if (url.includes('youtube.com')) return 'youtube'
  if (url.includes('reddit.com')) return 'reddit'
  if (url.includes('pinterest.com')) return 'pinterest'
  if (url.includes('snapchat.com')) return 'snapchat'
  if (url.includes('t.co')) return 'twitter'
  if (url.includes('l.instagram.com')) return 'instagram'
  
  // Check for QR code parameter
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('qr') === '1' || urlParams.get('source') === 'qr') return 'qr'
  }
  
  return 'other'
}

// Simple hash function for IP privacy
export function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'h_' + Math.abs(hash).toString(36)
}

// Fetch geo data from IP (using free service)
interface GeoData {
  country: string
  city: string
  region: string
}

export async function getGeoData(): Promise<GeoData> {
  try {
    // Using ipapi.co free tier (1000 requests/day)
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'force-cache' // Cache the result
    })
    if (!response.ok) throw new Error('Geo lookup failed')
    
    const data = await response.json()
    return {
      country: data.country_name || 'Unknown',
      city: data.city || '',
      region: data.region || ''
    }
  } catch {
    return { country: 'Unknown', city: '', region: '' }
  }
}

// Record a profile view
export async function trackProfileView(profileUserId: string): Promise<void> {
  try {
    const visitorId = getVisitorId()
    const sessionId = getSessionId()
    const deviceType = getDeviceType()
    const os = getOS()
    const browser = getBrowser()
    const referrer = typeof document !== 'undefined' ? document.referrer : ''
    const referrerSource = getReferrerSource(referrer)
    
    // Get geo data
    const geo = await getGeoData()
    
    // Call the Supabase function
    const { error } = await supabase.rpc('record_profile_view', {
      p_profile_user_id: profileUserId,
      p_visitor_id: visitorId,
      p_session_id: sessionId,
      p_ip_hash: hashString(visitorId + sessionId), // Privacy-safe identifier
      p_country: geo.country,
      p_city: geo.city,
      p_device_type: deviceType,
      p_os: os,
      p_browser: browser,
      p_referrer: referrer,
      p_referrer_source: referrerSource
    })
    
    if (error) {
      console.error('Failed to track profile view:', error)
    }
  } catch (err) {
    console.error('Error tracking profile view:', err)
  }
}

// Record a link click
export async function trackLinkClick(
  linkId: string,
  profileUserId: string,
  linkPosition: number
): Promise<void> {
  try {
    const visitorId = getVisitorId()
    const sessionId = getSessionId()
    const deviceType = getDeviceType()
    const os = getOS()
    const browser = getBrowser()
    const referrer = typeof document !== 'undefined' ? document.referrer : ''
    
    // Get geo data
    const geo = await getGeoData()
    
    // Call the Supabase function
    const { error } = await supabase.rpc('record_link_click', {
      p_link_id: linkId,
      p_profile_user_id: profileUserId,
      p_visitor_id: visitorId,
      p_session_id: sessionId,
      p_ip_hash: hashString(visitorId + sessionId),
      p_country: geo.country,
      p_city: geo.city,
      p_device_type: deviceType,
      p_os: os,
      p_browser: browser,
      p_referrer: referrer,
      p_link_position: linkPosition
    })
    
    if (error) {
      console.error('Failed to track link click:', error)
    }
  } catch (err) {
    console.error('Error tracking link click:', err)
  }
}

// Fetch analytics data for dashboard
export interface AnalyticsData {
  overview: {
    totalViews: number
    uniqueVisitors: number
    totalClicks: number
    uniqueClicks: number
    ctr: number
    viewsChange: number
    clicksChange: number
    avgTimeOnPage: string
    bounceRate: number
  }
  dailyStats: {
    date: string
    views: number
    clicks: number
    uniqueViews: number
  }[]
  countryStats: {
    country: string
    views: number
    clicks: number
    percentage: number
  }[]
  deviceStats: {
    mobile: number
    desktop: number
    tablet: number
  }
  visitorTypes: {
    new: number
    returning: number
  }
  sourceStats: {
    source: string
    views: number
    clicks: number
    percentage: number
  }[]
  linkStats: {
    linkId: string
    title: string
    type: string
    totalClicks: number
    uniqueClicks: number
    ctr: number
  }[]
  hourlyStats: {
    hour: number
    views: number
    clicks: number
  }[]
  recentActivity: {
    action: string
    location: string
    device: string
    time: string
  }[]
}

export async function fetchAnalyticsData(
  userId: string,
  days: number = 7
): Promise<AnalyticsData> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString().split('T')[0]
  
  const previousStartDate = new Date()
  previousStartDate.setDate(previousStartDate.getDate() - (days * 2))
  const previousStartDateStr = previousStartDate.toISOString().split('T')[0]

  // Fetch daily stats for current period
  const { data: dailyStats, error: dailyError } = await supabase
    .from('analytics_daily_stats')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .order('date', { ascending: true })

  // Fetch daily stats for previous period (for comparison)
  const { data: previousStats } = await supabase
    .from('analytics_daily_stats')
    .select('*')
    .eq('user_id', userId)
    .gte('date', previousStartDateStr)
    .lt('date', startDateStr)

  // Fetch country stats
  const { data: countryStats } = await supabase
    .from('analytics_country_stats')
    .select('country, views, clicks')
    .eq('user_id', userId)
    .gte('date', startDateStr)

  // Fetch source stats
  const { data: sourceStats } = await supabase
    .from('analytics_source_stats')
    .select('source, views, clicks')
    .eq('user_id', userId)
    .gte('date', startDateStr)

  // Fetch link stats with link details
  const { data: linkStats } = await supabase
    .from('analytics_link_stats')
    .select(`
      link_id,
      total_clicks,
      unique_clicks,
      linkfolio_links!inner(title, type)
    `)
    .eq('user_id', userId)
    .gte('date', startDateStr)

  // Fetch hourly stats (last 24 hours)
  const today = new Date().toISOString().split('T')[0]
  const { data: hourlyStats } = await supabase
    .from('analytics_hourly_stats')
    .select('hour, views, clicks')
    .eq('user_id', userId)
    .eq('date', today)
    .order('hour', { ascending: true })

  // Fetch recent activity (last 10 events)
  const { data: recentViews } = await supabase
    .from('analytics_profile_views')
    .select('country, city, device_type, created_at')
    .eq('profile_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentClicks } = await supabase
    .from('analytics_link_clicks')
    .select('country, city, device_type, created_at, linkfolio_links!inner(title)')
    .eq('profile_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate totals
  const currentTotals = (dailyStats || []).reduce((acc, day) => ({
    views: acc.views + (day.total_views || 0),
    uniqueViews: acc.uniqueViews + (day.unique_views || 0),
    clicks: acc.clicks + (day.total_clicks || 0),
    uniqueClicks: acc.uniqueClicks + (day.unique_clicks || 0),
    mobile: acc.mobile + (day.mobile_views || 0),
    desktop: acc.desktop + (day.desktop_views || 0),
    tablet: acc.tablet + (day.tablet_views || 0),
    newVisitors: acc.newVisitors + (day.new_visitors || 0),
    returningVisitors: acc.returningVisitors + (day.returning_visitors || 0)
  }), { views: 0, uniqueViews: 0, clicks: 0, uniqueClicks: 0, mobile: 0, desktop: 0, tablet: 0, newVisitors: 0, returningVisitors: 0 })

  const previousTotals = (previousStats || []).reduce((acc, day) => ({
    views: acc.views + (day.total_views || 0),
    clicks: acc.clicks + (day.total_clicks || 0)
  }), { views: 0, clicks: 0 })

  // Calculate changes
  const viewsChange = previousTotals.views > 0 
    ? ((currentTotals.views - previousTotals.views) / previousTotals.views) * 100 
    : 0
  const clicksChange = previousTotals.clicks > 0 
    ? ((currentTotals.clicks - previousTotals.clicks) / previousTotals.clicks) * 100 
    : 0

  // Aggregate country stats
  const countryAggregated = aggregateByField(countryStats || [], 'country', ['views', 'clicks'])
  const totalCountryViews = countryAggregated.reduce((sum, c) => sum + c.views, 0)

  // Aggregate source stats
  const sourceAggregated = aggregateByField(sourceStats || [], 'source', ['views', 'clicks'])
  const totalSourceViews = sourceAggregated.reduce((sum, s) => sum + s.views, 0)

  // Aggregate link stats
  const linkAggregated = aggregateLinkStats(linkStats || [], currentTotals.views)

  // Aggregate hourly stats
  const hourlyAggregated = Array.from({ length: 24 }, (_, hour) => {
    const stats = (hourlyStats || []).find(h => h.hour === hour)
    return {
      hour,
      views: stats?.views || 0,
      clicks: stats?.clicks || 0
    }
  })

  // Format recent activity
  const recentActivity = formatRecentActivity(recentViews || [], recentClicks || [])

  // Calculate visitor types
  const totalVisitors = currentTotals.newVisitors + currentTotals.returningVisitors
  const visitorTypes = {
    new: totalVisitors > 0 ? Math.round((currentTotals.newVisitors / totalVisitors) * 100) : 100,
    returning: totalVisitors > 0 ? Math.round((currentTotals.returningVisitors / totalVisitors) * 100) : 0
  }

  // Calculate device percentages
  const totalDeviceViews = currentTotals.mobile + currentTotals.desktop + currentTotals.tablet
  const deviceStats = {
    mobile: totalDeviceViews > 0 ? Math.round((currentTotals.mobile / totalDeviceViews) * 100) : 0,
    desktop: totalDeviceViews > 0 ? Math.round((currentTotals.desktop / totalDeviceViews) * 100) : 0,
    tablet: totalDeviceViews > 0 ? Math.round((currentTotals.tablet / totalDeviceViews) * 100) : 0
  }

  // CTR calculation
  const ctr = currentTotals.views > 0 
    ? Math.round((currentTotals.clicks / currentTotals.views) * 1000) / 10 
    : 0

  // Bounce rate (views without clicks)
  const bounceRate = currentTotals.views > 0
    ? Math.round(((currentTotals.views - currentTotals.clicks) / currentTotals.views) * 1000) / 10
    : 0

  return {
    overview: {
      totalViews: currentTotals.views,
      uniqueVisitors: currentTotals.uniqueViews,
      totalClicks: currentTotals.clicks,
      uniqueClicks: currentTotals.uniqueClicks,
      ctr,
      viewsChange: Math.round(viewsChange * 10) / 10,
      clicksChange: Math.round(clicksChange * 10) / 10,
      avgTimeOnPage: '—', // Would need session tracking
      bounceRate
    },
    dailyStats: (dailyStats || []).map(d => ({
      date: d.date,
      views: d.total_views || 0,
      clicks: d.total_clicks || 0,
      uniqueViews: d.unique_views || 0
    })),
    countryStats: countryAggregated
      .sort((a, b) => b.views - a.views)
      .slice(0, 8)
      .map(c => ({
        ...c,
        percentage: totalCountryViews > 0 ? Math.round((c.views / totalCountryViews) * 1000) / 10 : 0
      })),
    deviceStats,
    visitorTypes,
    sourceStats: sourceAggregated
      .sort((a, b) => b.views - a.views)
      .map(s => ({
        ...s,
        percentage: totalSourceViews > 0 ? Math.round((s.views / totalSourceViews) * 1000) / 10 : 0
      })),
    linkStats: linkAggregated,
    hourlyStats: hourlyAggregated,
    recentActivity
  }
}

// Helper to aggregate stats by a field
function aggregateByField(
  data: any[],
  field: string,
  sumFields: string[]
): any[] {
  const aggregated: { [key: string]: any } = {}
  
  for (const item of data) {
    const key = item[field]
    if (!aggregated[key]) {
      aggregated[key] = { [field]: key }
      for (const f of sumFields) {
        aggregated[key][f] = 0
      }
    }
    for (const f of sumFields) {
      aggregated[key][f] += item[f] || 0
    }
  }
  
  return Object.values(aggregated)
}

// Helper to aggregate link stats
function aggregateLinkStats(data: any[], totalViews: number): any[] {
  const aggregated: { [key: string]: any } = {}
  
  for (const item of data) {
    const key = item.link_id
    if (!aggregated[key]) {
      aggregated[key] = {
        linkId: key,
        title: item.linkfolio_links?.title || 'Unknown',
        type: item.linkfolio_links?.type || 'link',
        totalClicks: 0,
        uniqueClicks: 0
      }
    }
    aggregated[key].totalClicks += item.total_clicks || 0
    aggregated[key].uniqueClicks += item.unique_clicks || 0
  }
  
  return Object.values(aggregated)
    .map(link => ({
      ...link,
      ctr: totalViews > 0 ? Math.round((link.totalClicks / totalViews) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.totalClicks - a.totalClicks)
}

// Helper to format recent activity
function formatRecentActivity(views: any[], clicks: any[]): any[] {
  const activities: any[] = []
  
  for (const view of views) {
    activities.push({
      action: 'Profile View',
      location: [view.city, view.country].filter(Boolean).join(', ') || 'Unknown',
      device: formatDevice(view.device_type),
      time: formatTimeAgo(new Date(view.created_at))
    })
  }
  
  for (const click of clicks) {
    activities.push({
      action: `Clicked ${click.linkfolio_links?.title || 'Link'}`,
      location: [click.city, click.country].filter(Boolean).join(', ') || 'Unknown',
      device: formatDevice(click.device_type),
      time: formatTimeAgo(new Date(click.created_at))
    })
  }
  
  return activities
    .sort((a, b) => {
      // Sort by time (most recent first)
      const timeA = parseTimeAgo(a.time)
      const timeB = parseTimeAgo(b.time)
      return timeA - timeB
    })
    .slice(0, 10)
}

function formatDevice(deviceType: string): string {
  const devices: { [key: string]: string } = {
    mobile: 'Mobile',
    desktop: 'Desktop',
    tablet: 'Tablet'
  }
  return devices[deviceType] || 'Unknown'
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

function parseTimeAgo(timeStr: string): number {
  if (timeStr === 'Just now') return 0
  const match = timeStr.match(/(\d+)\s*(min|h|d)/)
  if (!match) return Infinity
  const value = parseInt(match[1])
  const unit = match[2]
  if (unit === 'min') return value
  if (unit === 'h') return value * 60
  if (unit === 'd') return value * 1440
  return Infinity
}
