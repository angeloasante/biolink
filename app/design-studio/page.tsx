'use client'

import { Palette, Sparkles, ArrowLeft, Wand2 } from 'lucide-react'
import Link from 'next/link'

export default function DesignStudioPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/5 rounded-full blur-[200px] -z-10"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] -z-10"></div>

      {/* Floating Elements */}
      <div className="absolute top-32 right-32 opacity-30">
        <Wand2 className="w-8 h-8 text-green-400 animate-bounce" />
      </div>
      <div className="absolute bottom-40 left-32 opacity-20">
        <div className="w-12 h-12 border-2 border-green-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl border border-green-500/20 flex items-center justify-center backdrop-blur-sm">
            <Palette className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-medium tracking-wide uppercase mb-6">
          <Sparkles className="w-3 h-3" />
          Under Development
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6">
          Design Studio
          <br />
          <span className="font-serif italic text-green-400">loading...</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Our powerful design studio is being built with creators in mind. 
          Drag, drop, customize — all without writing a single line of code.
        </p>

        {/* Feature Preview */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-md">
          <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
            </div>
            <span className="text-xs text-gray-500">Colors</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-green-400 font-bold text-sm">Aa</span>
            </div>
            <span className="text-xs text-gray-500">Fonts</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-green-400 rounded"></div>
            </div>
            <span className="text-xs text-gray-500">Layouts</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Follow me for updates on launch
        </p>

        <a 
          href="https://www.tiktok.com/@travis_moore11?is_from_webapp=1&sender_device=pc" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-green-500 to-emerald-400 text-black px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-green-500/20"
        >
          Follow on TikTok
        </a>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 BioFolio. Developed by{' '}
          <a href="https://angeloasante.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
            Travis Moore (Angelo Asante)
          </a>
        </p>
      </footer>
    </div>
  )
}
