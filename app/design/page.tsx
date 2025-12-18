'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardNav from '@/components/DashboardNav'
import { 
  Palette, 
  Lock,
  Sparkles,
  Check
} from 'lucide-react'

export default function DesignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth')
        return
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <DashboardNav activeTab="design" />
      
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">Design</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-gray-500">Customize the look and feel of your profile page</p>
          </div>

          {/* Coming Soon Banner */}
          <div className="mb-8 bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl shrink-0">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">We're building something special</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our design studio is currently under construction. We're working hard to bring you powerful 
                  customization tools that will make your profile stand out. Stay tuned for updates!
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">In Development</span>
                  </div>
                  <span className="text-xs text-gray-600">Expected February 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6">
            
            {/* Locked Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Themes */}
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <Palette className="w-5 h-5 text-gray-400" />
                    </div>
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Themes</h3>
                  <p className="text-sm text-gray-500">Choose from pre-built color schemes or create your own</p>
                  
                  {/* Preview colors */}
                  <div className="flex gap-2 mt-4">
                    {['bg-green-500', 'bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-pink-500'].map((color, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 ${color} rounded-full opacity-30`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Fonts */}
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-white/5 rounded-xl text-gray-400 font-serif text-lg">
                      Aa
                    </div>
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Typography</h3>
                  <p className="text-sm text-gray-500">Pick fonts that match your brand personality</p>
                  
                  {/* Preview fonts */}
                  <div className="mt-4 space-y-1">
                    <p className="text-xs text-gray-600 font-sans">Sans Serif</p>
                    <p className="text-xs text-gray-600 font-serif">Serif</p>
                    <p className="text-xs text-gray-600 font-mono">Monospace</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <div className="w-5 h-3 border border-gray-400 rounded" />
                    </div>
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Button Styles</h3>
                  <p className="text-sm text-gray-500">Rounded, sharp, outlined, or filled</p>
                  
                  {/* Preview buttons */}
                  <div className="flex gap-2 mt-4">
                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] text-gray-500">Rounded</div>
                    <div className="px-3 py-1 bg-white/10 rounded text-[10px] text-gray-500">Sharp</div>
                    <div className="px-3 py-1 border border-white/20 rounded text-[10px] text-gray-500">Outline</div>
                  </div>
                </div>
              </div>

              {/* Backgrounds */}
              <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <div className="w-5 h-5 bg-gradient-to-br from-gray-600 to-gray-800 rounded" />
                    </div>
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Backgrounds</h3>
                  <p className="text-sm text-gray-500">Solid colors, gradients, or custom images</p>
                  
                  {/* Preview backgrounds */}
                  <div className="flex gap-2 mt-4">
                    <div className="w-8 h-8 bg-gray-800 rounded opacity-50" />
                    <div className="w-8 h-8 bg-gradient-to-br from-green-900 to-blue-900 rounded opacity-50" />
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-900 to-pink-900 rounded opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-white">Unlock Design Studio</h3>
                  </div>
                  <p className="text-sm text-gray-500 max-w-md">
                    Upgrade to Pro to access all customization features and make your profile truly unique.
                  </p>
                </div>
                <button className="shrink-0 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition-colors">
                  Upgrade to Pro
                </button>
              </div>

              {/* What you get */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Included with Pro</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    'Custom color themes',
                    'Premium fonts',
                    'Button customization',
                    'Background images',
                    'Remove branding',
                    'Custom domain'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
