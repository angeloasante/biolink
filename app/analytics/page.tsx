'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardNav from '@/components/DashboardNav';
import { 
  Eye, 
  MousePointerClick, 
  Users, 
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { fetchAnalyticsData, type AnalyticsData } from '@/lib/analytics';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    const init = async () => {
      // Wait for auth state to be ready
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/auth');
        return;
      }

      setUserId(session.user.id);
      await loadAnalytics(session.user.id);
      setLoading(false);
    };

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      loadAnalytics(userId);
    }
  }, [timeRange, userId]);

  const loadAnalytics = async (id: string) => {
    const data = await fetchAnalyticsData(id, timeRange);
    setAnalytics(data);
  };

  const handleRefresh = async () => {
    if (!userId || refreshing) return;
    setRefreshing(true);
    await loadAnalytics(userId);
    setTimeout(() => setRefreshing(false), 500);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatChange = (change: number) => {
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return '0%';
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Views', 
      value: formatNumber(analytics?.overview.totalViews || 0), 
      icon: Eye,
      change: formatChange(analytics?.overview.viewsChange || 0),
      positive: (analytics?.overview.viewsChange || 0) >= 0,
      color: 'green'
    },
    { 
      label: 'Total Clicks', 
      value: formatNumber(analytics?.overview.totalClicks || 0), 
      icon: MousePointerClick,
      change: formatChange(analytics?.overview.clicksChange || 0),
      positive: (analytics?.overview.clicksChange || 0) >= 0,
      color: 'blue'
    },
    { 
      label: 'Unique Visitors', 
      value: formatNumber(analytics?.overview.uniqueVisitors || 0), 
      icon: Users,
      change: '',
      positive: true,
      color: 'purple'
    },
    { 
      label: 'Click Rate', 
      value: `${analytics?.overview.ctr || 0}%`, 
      icon: TrendingUp,
      change: '',
      positive: true,
      color: 'orange'
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <DashboardNav activeTab="analytics" />
      
      {/* Sub-header with controls */}
      <div className="bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-semibold text-white">Analytics</h1>
            
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center bg-white/5 rounded-lg p-1">
                {([7, 30, 90] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      timeRange === range
                        ? 'bg-green-500 text-black font-medium'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range === 7 ? '7 Days' : range === 30 ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'green' ? 'bg-green-500/10 text-green-500' :
                  stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                  stat.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                  'bg-orange-500/10 text-orange-500'
                }`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    stat.positive ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Views Over Time */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Views Over Time</h3>
              <Calendar className="w-4 h-4 text-gray-500" />
            </div>
            {(analytics?.dailyStats || []).length > 0 ? (
              <div className="h-48 flex items-end gap-1">
                {analytics?.dailyStats.slice(-14).map((day, i) => {
                  const maxViews = Math.max(...(analytics?.dailyStats || []).map(d => d.views), 1);
                  const height = (day.views / maxViews) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-green-500/50 to-green-500 rounded-t-sm transition-all hover:from-green-400/50 hover:to-green-400"
                        style={{ height: `${Math.max(height, 2)}%` }}
                        title={`${day.date}: ${day.views} views`}
                      />
                      {i % 2 === 0 && (
                        <span className="text-[10px] text-gray-600">
                          {new Date(day.date).getDate()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                No data yet
              </div>
            )}
          </div>

          {/* Traffic Sources */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Traffic Sources</h3>
              <Globe className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-4">
              {(analytics?.sourceStats || []).length > 0 ? (
                analytics?.sourceStats.slice(0, 5).map((source, i) => {
                  const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{source.source || 'Direct'}</span>
                        <span className="text-sm text-gray-400">{source.percentage}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors[i % colors.length]} rounded-full transition-all`}
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-500">
                  No referrer data yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Countries */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Top Countries</h3>
              <Globe className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-3">
              {(analytics?.countryStats || []).length > 0 ? (
                analytics?.countryStats.slice(0, 5).map((country, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getCountryFlag(country.country)}</span>
                      <span className="text-sm">{country.country || 'Unknown'}</span>
                    </div>
                    <span className="text-sm font-medium">{country.views}</span>
                  </div>
                ))
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-500">
                  No location data yet
                </div>
              )}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Devices</h3>
              <Smartphone className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-4">
              {analytics?.deviceStats ? (
                <>
                  {[
                    { device: 'Mobile', percentage: analytics.deviceStats.mobile },
                    { device: 'Desktop', percentage: analytics.deviceStats.desktop },
                    { device: 'Tablet', percentage: analytics.deviceStats.tablet },
                  ].filter(d => d.percentage > 0).map((device, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-lg">
                        {getDeviceIcon(device.device)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{device.device}</span>
                          <span className="text-sm text-gray-400">{device.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {analytics.deviceStats.mobile === 0 && analytics.deviceStats.desktop === 0 && analytics.deviceStats.tablet === 0 && (
                    <div className="h-32 flex items-center justify-center text-gray-500">
                      No device data yet
                    </div>
                  )}
                </>
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-500">
                  No device data yet
                </div>
              )}
            </div>
          </div>

          {/* Top Links */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Top Links</h3>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-3">
              {(analytics?.linkStats || []).length > 0 ? (
                analytics?.linkStats.slice(0, 5).map((link, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-5">#{i + 1}</span>
                      <span className="text-sm truncate max-w-[150px]">{link.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="w-3 h-3 text-gray-500" />
                      <span className="text-sm font-medium">{link.totalClicks}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-500">
                  No link clicks yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-3">
            {(analytics?.recentActivity || []).length > 0 ? (
              analytics?.recentActivity.slice(0, 10).map((activity, i) => {
                const isView = activity.action === 'Profile View';
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        isView
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {isView ? <Eye className="w-3 h-3" /> : <MousePointerClick className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {activity.location} • {activity.device}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="h-24 flex items-center justify-center text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="mt-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Activity by Hour (Today)</h3>
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="grid grid-cols-12 gap-1">
            {(analytics?.hourlyStats || []).map((hour, i) => {
              const maxViews = Math.max(...(analytics?.hourlyStats || []).map(h => h.views), 1);
              const intensity = hour.views / maxViews;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-full aspect-square rounded-sm transition-colors ${
                      intensity > 0.7 ? 'bg-green-500' :
                      intensity > 0.4 ? 'bg-green-500/60' :
                      intensity > 0 ? 'bg-green-500/30' :
                      'bg-white/5'
                    }`}
                    title={`${hour.hour}:00 - ${hour.views} views, ${hour.clicks} clicks`}
                  />
                  {i % 3 === 0 && (
                    <span className="text-[9px] text-gray-600">{hour.hour}</span>
                  )}
                </div>
              );
            })}
          </div>
          {(analytics?.hourlyStats || []).every(h => h.views === 0) && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              No activity recorded today
            </div>
          )}
        </div>

        {/* Visitor Types */}
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Visitor Types</h3>
              <Users className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-white/5"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${(analytics?.visitorTypes.new || 0) * 3.52} 352`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{analytics?.visitorTypes.new || 0}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">New Visitors ({analytics?.visitorTypes.new || 0}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <span className="text-sm">Returning ({analytics?.visitorTypes.returning || 0}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bounce Rate */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Engagement Metrics</h3>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-500">{analytics?.overview.ctr || 0}%</p>
                <p className="text-sm text-gray-500 mt-1">Click-through Rate</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-orange-500">{analytics?.overview.bounceRate || 0}%</p>
                <p className="text-sm text-gray-500 mt-1">Bounce Rate</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getCountryFlag(countryName: string): string {
  // Map common country names to ISO codes
  const countryToCode: { [key: string]: string } = {
    'United States': 'US',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Australia': 'AU',
    'Germany': 'DE',
    'France': 'FR',
    'Spain': 'ES',
    'Italy': 'IT',
    'Japan': 'JP',
    'China': 'CN',
    'India': 'IN',
    'Brazil': 'BR',
    'Mexico': 'MX',
    'Netherlands': 'NL',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Russia': 'RU',
    'South Korea': 'KR',
    'Singapore': 'SG',
    'Indonesia': 'ID',
    'Thailand': 'TH',
    'Vietnam': 'VN',
    'Philippines': 'PH',
    'Malaysia': 'MY',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'South Africa': 'ZA',
    'Nigeria': 'NG',
    'Egypt': 'EG',
    'Turkey': 'TR',
    'Saudi Arabia': 'SA',
    'UAE': 'AE',
    'Israel': 'IL',
    'New Zealand': 'NZ',
    'Ireland': 'IE',
    'Belgium': 'BE',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Portugal': 'PT',
    'Greece': 'GR',
    'Czech Republic': 'CZ',
    'Romania': 'RO',
    'Hungary': 'HU',
    'Ukraine': 'UA',
    'Unknown': '🌍',
  };

  const code = countryToCode[countryName];
  if (!code || code === '🌍') return '🌍';
  
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
