'use client'

import { ArrowRight, PlayCircle, Instagram, BarChart2, Youtube, Twitter, ShoppingBag, ArrowUpRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-mesh">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal-up active z-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-medium tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Version 1.0 is live
          </div>

          <h1 className="text-5xl lg:text-7xl leading-[1.1] font-medium tracking-tight mb-6">
            One link to rule
            <br />
            <span className="font-serif italic text-green-400 font-normal">
              them all.
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-16 items-start">
          <div className="reveal-up active z-10 pt-4">
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg mb-10 font-light">
              Transform your scattered digital presence into a cohesive,
              high-converting landing page. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/auth" className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-300 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <span className="relative bg-green-500 text-black px-8 py-4 rounded-full text-sm font-semibold hover:bg-green-400 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                  Claim your Link
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
              <button className="px-8 py-4 rounded-full text-sm font-medium border border-white/10 hover:bg-white/5 transition-colors text-white w-full sm:w-auto flex items-center justify-center gap-2">
                <PlayCircle className="w-4 h-4 text-gray-400" />
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="User" />
                <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="User" />
                <img src="https://i.pravatar.cc/100?img=8" className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gray-800 flex items-center justify-center text-xs text-white">
                  2k+
                </div>
              </div>
              <p>Creatives joined this week</p>
            </div>
          </div>

          {/* Hero Graphic (Phone Mockup) */}
          <div className="relative reveal-up active lg:ml-auto w-full max-w-md">
            {/* Floating Elements - In Front of Phone */}
            <div className="absolute top-20 -left-12 p-4 glass-panel rounded-2xl animate-float-delayed z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Instagram</p>
                  <p className="text-sm font-semibold">+24.5% clicks</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-32 -right-8 p-4 glass-panel rounded-2xl animate-float z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Views</p>
                  <p className="text-sm font-semibold">124,592</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="relative z-10 w-[300px] mx-auto h-[600px] bg-[#111] rounded-[3rem] border-8 border-[#222] shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#000] rounded-b-2xl z-20"></div>

              {/* Screen Content */}
              <div className="w-full h-full bg-[#0a0a0a] overflow-hidden flex flex-col pt-12 px-6 relative">
                {/* BG Pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8 relative z-10">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-green-400 to-blue-500 mb-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]" alt="Profile" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">
                    Sarah Creator
                  </h3>
                  <p className="text-xs text-gray-400">@sarahdesign</p>
                </div>

                {/* Links Stack */}
                <div className="space-y-3 relative z-10">
                  <div className="group w-full p-3 bg-white/5 border border-white/5 hover:border-green-500/50 hover:bg-white/10 rounded-xl flex items-center justify-between transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                        <Youtube className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">Latest Vlog</span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-gray-500 group-hover:text-white" />
                  </div>

                  <div className="group w-full p-3 bg-white/5 border border-white/5 hover:border-green-500/50 hover:bg-white/10 rounded-xl flex items-center justify-between transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Twitter className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">Twitter Thoughts</span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-gray-500 group-hover:text-white" />
                  </div>

                  <div className="group w-full p-3 bg-white/5 border border-white/5 hover:border-green-500/50 hover:bg-white/10 rounded-xl flex items-center justify-between transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">My Merch Store</span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-gray-500 group-hover:text-white" />
                  </div>

                  {/* Image Card in Linktree */}
                  <div className="w-full h-32 rounded-xl overflow-hidden relative group cursor-pointer mt-4 border border-white/5">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                      <p className="text-xs font-medium">New Collection Drop</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1">
                  <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
