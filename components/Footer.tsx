'use client'

import { Twitter, Instagram, Linkedin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="space-y-4">
          <a href="/" className="flex items-center">
            <Image 
              src="/logo-full.png" 
              alt="BioFolio" 
              width={400} 
              height={267} 
              className="h-23 w-auto"
            />
          </a>
          <p className="text-sm text-gray-500 max-w-xs">
            The bridge between your followers and your entire digital world.
          </p>
        </div>

        <div className="flex gap-12 lg:gap-24">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-green-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-green-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a href="/privacy" className="hover:text-green-400 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-green-400 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-600">
          © 2025 BioFolio Inc. All rights reserved.
        </p>
        <div className="flex gap-4 text-gray-500">
          <a href="#" className="hover:text-white transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
