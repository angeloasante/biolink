'use client'

import { BookOpen, Sparkles, ArrowLeft, PenTool, Lightbulb, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[200px] -z-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-28 right-28 opacity-20">
        <PenTool className="w-8 h-8 text-cyan-400 animate-pulse" />
      </div>
      <div className="absolute bottom-36 left-28 opacity-20">
        <Lightbulb className="w-10 h-10 text-sky-400 animate-bounce" />
      </div>

      {/* Navigation */}
      <nav className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-sky-500/20 rounded-3xl border border-cyan-500/20 flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-medium tracking-wide uppercase mb-6">
          <Sparkles className="w-3 h-3" />
          Coming Soon
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6">
          Stories &amp; Insights
          <br />
          <span className="font-serif italic text-cyan-400">brewing...</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Tips, tutorials, and inspiration for creators. Our blog is cooking up 
          content that'll help you grow your audience and build your brand.
        </p>

        {/* Article Preview Placeholders */}
        <div className="flex gap-4 mb-12">
          <div className="w-48 h-32 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 p-4 flex flex-col justify-end">
            <div className="w-full h-2 bg-white/20 rounded mb-2"></div>
            <div className="w-3/4 h-2 bg-white/10 rounded"></div>
          </div>
          <div className="hidden md:block w-48 h-32 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 rounded-2xl border border-cyan-500/20 p-4 flex flex-col justify-end -mt-4">
            <div className="w-full h-2 bg-cyan-500/30 rounded mb-2"></div>
            <div className="w-2/3 h-2 bg-cyan-500/20 rounded"></div>
          </div>
          <div className="hidden lg:block w-48 h-32 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 p-4 flex flex-col justify-end">
            <div className="w-full h-2 bg-white/20 rounded mb-2"></div>
            <div className="w-1/2 h-2 bg-white/10 rounded"></div>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">Creator Economy</span>
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">Design Tips</span>
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">Growth Hacks</span>
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">Product Updates</span>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Follow me for updates on launch
        </p>

        <a 
          href="https://www.tiktok.com/@travis_moore11?is_from_webapp=1&sender_device=pc" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-cyan-500 to-sky-400 text-black px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
        >
          Follow on TikTok
        </a>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 BioFolio. Developed by{' '}
          <a href="https://angeloasante.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Travis Moore (Angelo Asante)
          </a>
        </p>
      </footer>
    </div>
  )
}
