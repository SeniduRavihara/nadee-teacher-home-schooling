import { Heart, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import FadeIn from './animations/FadeIn';

export default function OurStory() {
  return (
    <section id="our-story" className="py-24 bg-white overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <FadeIn direction="right" className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] transform rotate-3 opacity-10"></div>
              <div className="relative bg-white p-4 rounded-[2rem] shadow-xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-blue-50">
                  <Image
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=NadeeTeacher&backgroundColor=b6e3f4"
                    alt="NadeeTeacher"
                    fill
                    className="object-cover"
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-6 right-6 bg-white py-3 px-5 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slow">
                    <Heart className="text-red-500 fill-current" size={20} />
                    <span className="font-bold text-gray-800">Passionate Educator</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <Star className="absolute -top-6 -left-6 text-yellow-400 fill-current animate-spin-slow" size={48} />
              <Sparkles className="absolute -bottom-8 -right-4 text-purple-400" size={40} />
            </div>
          </FadeIn>

          {/* Content Side */}
          <FadeIn direction="left">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hi, I'm <span className="text-blue-600">NadeeTeacher!</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                I believe that every child has a unique spark waiting to be ignited. My journey began with a simple question: <span className="italic text-gray-800">"How can we make learning as addictive as playing?"</span>
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Fun First Philosophy</h3>
                    <p className="text-gray-600">Learning shouldn't be a chore. We turn complex concepts into exciting adventures.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Nurturing Confidence</h3>
                    <p className="text-gray-600">We celebrate every small win, building the self-belief kids need to tackle big challenges.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                   <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">10+</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Years Exp.</div>
                   </div>
                   <div className="h-10 w-px bg-gray-200"></div>
                   <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">50k+</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Happy Students</div>
                   </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
