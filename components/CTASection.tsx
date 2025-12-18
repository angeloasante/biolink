'use client'

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute inset-0 bg-green-500 rounded-[3rem] rotate-1 opacity-20 blur-xl"></div>
        <div className="relative bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 rounded-[2.5rem] p-12 lg:p-24 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent opacity-50"></div>

          <h2 className="relative z-10 text-4xl lg:text-6xl font-medium tracking-tight mb-6">
            Ready to launch?
          </h2>
          <p className="relative z-10 text-gray-400 max-w-lg mx-auto mb-10 text-lg">
            Join 500,000+ creators sharing their content with BioFolio today.
            Start for free, upgrade when you grow.
          </p>

          <form className="relative z-10 max-w-md mx-auto flex flex-col sm:flex-row gap-3" action="/auth">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">
                biofolio.link/
              </span>
              <input 
                type="text" 
                name="username"
                placeholder="username" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-28 pr-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600"
              />
            </div>
            <button type="submit" className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 whitespace-nowrap">
              Claim Link
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
