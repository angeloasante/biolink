'use client'

import { Globe } from 'lucide-react'

export default function AnalyticsSection() {
  return (
    <section className="bg-[#050505] py-24 lg:py-32 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 reveal-up active">
          <h2 className="text-3xl lg:text-5xl font-medium tracking-tight mb-4">
            Data that drives
            {' '}
            <span className="text-green-500 font-serif italic">growth</span>
          </h2>
          <p className="text-gray-400">
            Understand your audience with privacy-first analytics. Track clicks,
            views, and conversion rates in real-time.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {/* Main Graph Card */}
          <div className="md:col-span-2 row-span-1 md:row-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group reveal-up active">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Views</p>
                <h3 className="text-4xl font-semibold text-white mt-1">842.5k</h3>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-gray-300 outline-none">
                <option>Last 30 days</option>
              </select>
            </div>

            {/* SVG Graph */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-80 group-hover:scale-[1.02] transition-transform duration-500 ease-out">
              <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path d="M0,100 C50,120 100,40 150,60 S250,120 300,80 S400,20 500,40 V150 H0 Z" fill="url(#gradient)" />
                <path d="M0,100 C50,120 100,40 150,60 S250,120 300,80 S400,20 500,40" fill="none" stroke="#22c55e" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* Stat Card 1 */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:bg-white/5 transition-colors reveal-up active">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold mb-1">Top Sources</p>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Instagram</span>
                  <span>45%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-blue-500"></div>
                </div>

                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-400">TikTok</span>
                  <span>32%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[32%] h-full bg-purple-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 2: CTR */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group reveal-up active">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent rotate-45 mb-4">
                <span className="text-xl font-bold text-white -rotate-45">12%</span>
              </div>
              <h4 className="text-lg font-medium text-white">Click Rate</h4>
              <p className="text-sm text-gray-500 mt-1">Top 1% of creators</p>
            </div>
          </div>

          {/* Map/Location Card */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden reveal-up active">
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" alt="World" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                Top Region
              </p>
              <p className="text-xl font-semibold text-white">United States</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
