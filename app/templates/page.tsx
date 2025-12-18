'use client'

import { Layout, Sparkles, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[200px] -z-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 opacity-20">
        <div className="w-20 h-20 border border-white/20 rounded-2xl rotate-12 animate-pulse"></div>
      </div>
      <div className="absolute bottom-32 left-20 opacity-20">
        <div className="w-16 h-16 border border-green-500/30 rounded-xl -rotate-12 animate-pulse delay-500"></div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
            <Layout className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-medium tracking-wide uppercase mb-6">
          <Sparkles className="w-3 h-3" />
          Coming Soon
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6">
          Beautiful Templates
          <br />
          <span className="font-serif italic text-purple-400">on the way.</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          We're crafting stunning, conversion-optimized templates to help you stand out. 
          Get ready for designs that make an impression.
        </p>

        {/* Preview Cards */}
        <div className="flex gap-4 mb-12">
          <div className="w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 animate-pulse"></div>
          <div className="w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 animate-pulse delay-100 -mt-4"></div>
          <div className="w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 animate-pulse delay-200"></div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Follow me for updates on launch
        </p>

        <a 
          href="https://www.tiktok.com/@travis_moore11?is_from_webapp=1&sender_device=pc" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
        >
          Follow on TikTok
        </a>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 BioFolio. Developed by{' '}
          <a href="https://angeloasante.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
            Travis Moore (Angelo Asante)
          </a>
        </p>
      </footer>
    </div>
  )
}
