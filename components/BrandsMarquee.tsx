'use client'

import { Figma, Github, Slack, Dribbble, Framer, Twitch, Twitter } from 'lucide-react'

export default function BrandsMarquee() {
  const icons = [
    <Figma key="figma" className="w-8 h-8" />,
    <Github key="github" className="w-8 h-8" />,
    <Slack key="slack" className="w-8 h-8" />,
    <Dribbble key="dribbble" className="w-8 h-8" />,
    <Framer key="framer" className="w-8 h-8" />,
    <Twitch key="twitch" className="w-8 h-8" />,
    <Twitter key="twitter" className="w-8 h-8" />,
  ]

  return (
    <div className="border-y border-white/5 bg-black/50 py-10 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

      <div className="flex gap-16 items-center animate-marquee w-max opacity-40 hover:opacity-100 transition-opacity duration-500">
        {/* Logos repeated twice for seamless loop */}
        <div className="flex gap-16">
          {icons}
        </div>
        <div className="flex gap-16">
          {icons}
        </div>
      </div>
    </div>
  )
}
