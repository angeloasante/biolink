import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
      <div className="px-6 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center group cursor-pointer">
          <Image 
            src="/logo-full.png" 
            alt="BioFolio" 
            width={400} 
            height={267} 
            className="h-20 w-auto"
          />
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="/auth" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
            Log in
          </a>
          <a href="/auth" className="bg-gradient-to-r from-green-500 to-emerald-400 text-black px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-green-500/20">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  )
}
