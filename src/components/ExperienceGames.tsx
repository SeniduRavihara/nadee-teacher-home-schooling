
import FadeIn from './animations/FadeIn';

export default function ExperienceGames() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold uppercase tracking-wider text-sm">Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Experience quizzes that <span className="text-purple-600">educate</span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Device Mockup Placeholder */}
          <FadeIn delay={0.2} direction="right" className="w-full">
            <div className="relative h-[300px] md:h-[400px] w-full bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 font-medium">Device Mockup (Desktop & Mobile)</span>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500 rounded-full blur-xl opacity-20"></div>
              <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-pink-500 rounded-full blur-xl opacity-20"></div>
            </div>
          </FadeIn>

          {/* Content */}
          <div className="space-y-8">
            <FadeIn delay={0.3} direction="left">
              <div className="flex gap-4">
                 <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">4000+ Scientifically designed quizzes</h3>
                   <p className="text-gray-600">
                     Our quizzes are designed by learning experts to build core skills in Math and Reading.
                   </p>
                 </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} direction="left">
              <div className="flex gap-4">
                 <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">2</div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Expert-led Classes</h3>
                   <p className="text-gray-600">
                     Interactive Zoom classes with experienced teachers to guide your child's learning journey.
                   </p>
                 </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.5} direction="left">
              <div className="flex gap-4">
                 <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">3</div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Safe and Ad-free</h3>
                   <p className="text-gray-600">
                     A completely safe environment for kids to explore and learn without any distractions.
                   </p>
                 </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
