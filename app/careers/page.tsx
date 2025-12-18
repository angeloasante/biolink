'use client'

import { Briefcase, Sparkles, ArrowLeft, Users, Rocket, Heart } from 'lucide-react'
import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[200px] -z-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-24 left-24 opacity-20">
        <Users className="w-10 h-10 text-orange-400 animate-pulse" />
      </div>
      <div className="absolute bottom-32 right-32 opacity-20">
        <Rocket className="w-8 h-8 text-amber-400 animate-bounce" />
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-3xl border border-orange-500/20 flex items-center justify-center backdrop-blur-sm">
            <Briefcase className="w-12 h-12 text-orange-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-medium tracking-wide uppercase mb-6">
          <Sparkles className="w-3 h-3" />
          Coming Soon
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6">
          Join Our
          <br />
          <span className="font-serif italic text-orange-400">growing team.</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          We're building something special and we'd love for you to be part of it. 
          Our careers page is coming soon with exciting opportunities.
        </p>

        {/* Values Preview */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Heart className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">Remote First</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Users className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">Diverse Team</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Rocket className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">Fast Growing</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Follow me for updates on launch
        </p>

        <a 
          href="https://www.tiktok.com/@travis_moore11?is_from_webapp=1&sender_device=pc" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-orange-500 to-amber-400 text-black px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-orange-500/20"
        >
          Follow on TikTok
        </a>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 BioFolio. Developed by{' '}
          <a href="https://angeloasante.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">
            Travis Moore (Angelo Asante)
          </a>
        </p>
      </footer>
    </div>
  )
}
