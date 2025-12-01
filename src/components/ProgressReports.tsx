import { Check } from 'lucide-react';
import Image from 'next/image';
import FadeIn from './animations/FadeIn';

export default function ProgressReports() {
  const features = [
    'Daily progress reports',
    'Skill mastery tracking',
    'Personalized practice packs',
    'Parent dashboard access',
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <FadeIn direction="right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The most comprehensive progress reports ever. Period.
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Stay on top of your child's learning with detailed insights and reports delivered straight to your inbox.
              </p>
              
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="mt-8 bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-colors">
                See how it works
              </button>
            </FadeIn>
          </div>

          {/* Dashboard Mockup */}
          <FadeIn direction="left" className="order-1 lg:order-2 relative">
             <div className="relative w-full aspect-[4/3] transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/images/progress-report-mockup.png" 
                  alt="Progress Report Dashboard" 
                  fill 
                  className="object-contain drop-shadow-2xl rounded-3xl"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                        100%
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Weekly Goal</div>
                        <div className="font-bold text-gray-900">Achieved!</div>
                    </div>
                </div>
             </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
