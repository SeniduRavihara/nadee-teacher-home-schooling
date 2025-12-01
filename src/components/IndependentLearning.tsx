import Image from 'next/image';
import FadeIn from './animations/FadeIn';

export default function IndependentLearning() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Make effective independent learning a reality
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A personalized learning path that adapts to your child's needs, ensuring they master every concept.
            </p>
          </div>
        </FadeIn>

        {/* Learning Path Visual - Simplified */}
        <div className="relative py-10">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-yellow-200 transform -translate-y-1/2 hidden md:block rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <FadeIn delay={0.2} direction="up" className="h-full">
              <div className="flex flex-col items-center">
                 <div className="w-48 h-48 relative mb-4 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                   <Image 
                     src="/images/concept-learning.png" 
                     alt="Watch Video Lessons" 
                     fill
                     className="object-cover rounded-2xl shadow-lg border-4 border-white"
                   />
                 </div>
                 <div className="w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-sm mb-2"></div>
                 <p className="text-center font-medium text-gray-800">Watch Video Lessons</p>
              </div>
            </FadeIn>

            {/* Step 2 */}
            <FadeIn delay={0.4} direction="up" className="h-full">
              <div className="flex flex-col items-center mt-8 md:mt-0">
                 <div className="w-48 h-48 relative mb-4 transform rotate-[3deg] hover:rotate-0 transition-transform duration-300">
                   <Image 
                     src="/images/practice-quiz.png" 
                     alt="Practice with Quizzes" 
                     fill
                     className="object-cover rounded-2xl shadow-lg border-4 border-white"
                   />
                 </div>
                 <div className="w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-sm mb-2"></div>
                 <p className="text-center font-medium text-gray-800">Practice with Quizzes</p>
              </div>
            </FadeIn>

            {/* Step 3 */}
            <FadeIn delay={0.6} direction="up" className="h-full">
              <div className="flex flex-col items-center">
                 <div className="w-48 h-48 relative mb-4 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                   <Image 
                     src="/images/mastery-celebration.png" 
                     alt="Attend Live Classes" 
                     fill
                     className="object-cover rounded-2xl shadow-lg border-4 border-white"
                   />
                 </div>
                 <div className="w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-sm mb-2"></div>
                 <p className="text-center font-medium text-gray-800">Attend Live Classes</p>
              </div>
            </FadeIn>
          </div>
        </div>
        
        <FadeIn delay={0.8} direction="up">
          <div className="text-center mt-16">
              <p className="text-sm text-gray-500">
                  Trusted by over <span className="font-bold text-green-600">40 million</span> learners worldwide
              </p>
              <div className="flex justify-center gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">COPPA Certified</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">kidSAFE Listed</span>
              </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
