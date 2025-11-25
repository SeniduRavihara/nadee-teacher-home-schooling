
export default function Hero() {
  return (
    <section className="relative bg-[#0a0a4a] text-white pt-32 pb-20 overflow-hidden">
      {/* Background Shapes/Curve - Simplified representation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[50%] transform scale-x-150 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-block bg-blue-900/50 px-4 py-1 rounded-full text-sm font-semibold text-blue-200 mb-2">
              See learning outcomes in 2 weeks
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Kids see fun.
              <br />
              You see real <span className="italic text-blue-300">learning outcomes</span>.
            </h1>
            <p className="text-lg text-blue-100 max-w-lg">
              Scientifically-designed games that bring out the best in every child.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                I'm a Parent
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                I'm a Teacher
              </button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center">
             {/* In a real app, this would be a composed image of kids and characters */}
             <div className="relative w-full h-full">
                {/* Placeholder for the main hero graphic */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border-2 border-white/10 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white/50 text-xl font-medium">Hero Image Area</span>
                    </div>
                </div>
                
                {/* Floating Elements (Decorative) */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-xl opacity-20"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
