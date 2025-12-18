'use client'

import { Palette, CheckCircle2, Sparkles } from 'lucide-react'

export default function EditorSection() {
  return (
    <section className="bg-white text-black py-24 lg:py-32 relative overflow-hidden">
      {/* Decoration */}
      <Sparkles className="absolute top-20 right-12 w-12 h-12 text-yellow-400 opacity-50 rotate-12" />
      <div className="absolute -left-20 top-40 w-64 h-64 bg-green-200 rounded-full blur-[80px] opacity-60"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* UI Mockup */}
          <div className="relative reveal-up active order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-[2rem] -z-10 transform -rotate-2"></div>
            <div className="bg-[#F8F9FA] rounded-3xl border border-gray-200 shadow-2xl p-6 overflow-hidden">
              {/* Mock Editor Header */}
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Editor
                </span>
              </div>

              {/* Mock Editor Content */}
              <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-1/3 space-y-4">
                  <div className="h-8 bg-white rounded-lg border border-gray-200 w-full animate-pulse"></div>
                  <div className="h-24 bg-white rounded-lg border border-gray-200 w-full p-3 flex flex-col gap-2">
                    <div className="w-12 h-2 bg-gray-200 rounded"></div>
                    <div className="w-full h-8 bg-green-500 rounded-md text-white text-[10px] flex items-center justify-center">
                      Custom
                    </div>
                  </div>
                  <div className="h-8 bg-white rounded-lg border border-gray-200 w-3/4"></div>
                </div>

                {/* Preview Area */}
                <div className="w-2/3 bg-white rounded-2xl border border-gray-200 p-4 shadow-inner flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 mb-2"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                  <div className="w-full h-10 bg-black text-white rounded-lg flex items-center justify-center text-xs">
                    Button
                  </div>
                  <div className="w-full h-10 border border-black rounded-lg flex items-center justify-center text-xs">
                    Button
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="reveal-up active order-1 lg:order-2">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <Palette className="w-6 h-6" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight mb-6 text-gray-900">
              Design without
              {' '}
              <span className="font-serif italic text-gray-500">limitations.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Our drag-and-drop editor gives you granular control over every
              pixel. Choose from curated themes or build your own brand identity
              from scratch.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">
                  Custom fonts &amp; colors
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Video backgrounds</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">
                  Integration with 50+ tools
                </span>
              </li>
            </ul>

            <div className="flex gap-4">
              <a href="/design-studio" className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-xl">
                Start Designing
              </a>
              <a href="/templates" className="text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                View Templates
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
