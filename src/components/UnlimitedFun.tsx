'use client';

import { BookOpen } from 'lucide-react';
import FadeIn from './animations/FadeIn';

const gradeCards = [
  {
    grade: 'Preschool',
    description: 'Fun basics & discovery',
    icon: <BookOpen size={32} />,
    color: 'bg-gradient-to-br from-pink-400 to-rose-500',
    shadow: 'shadow-pink-200',
    textColor: 'text-pink-600'
  },
  {
    grade: 'Grade 1',
    description: 'Reading & counting',
    icon: <BookOpen size={32} />,
    color: 'bg-gradient-to-br from-orange-400 to-amber-500',
    shadow: 'shadow-orange-200',
    textColor: 'text-orange-600'
  },
  {
    grade: 'Grade 2',
    description: 'Math & storytelling',
    icon: <BookOpen size={32} />,
    color: 'bg-gradient-to-br from-green-400 to-emerald-500',
    shadow: 'shadow-green-200',
    textColor: 'text-green-600'
  },
  {
    grade: 'Grade 3',
    description: 'Science & nature',
    icon: <BookOpen size={32} />,
    color: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    shadow: 'shadow-cyan-200',
    textColor: 'text-cyan-600'
  },
  {
    grade: 'Grade 4',
    description: 'History & art',
    icon: <BookOpen size={32} />,
    color: 'bg-gradient-to-br from-purple-400 to-violet-500',
    shadow: 'shadow-purple-200',
    textColor: 'text-purple-600'
  },
  {
    grade: 'Grade 5',
    description: 'Logic & reasoning',
    icon: <BookOpen size={32} />,
    color: 'bg-gradient-to-br from-indigo-400 to-blue-600',
    shadow: 'shadow-indigo-200',
    textColor: 'text-indigo-600'
  },
];

export default function UnlimitedFun() {
  return (
    <section className="py-20 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-chewy">
              Unlimited fun. Unlimited learning.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Select a grade to explore scientifically-designed activities that bring out the best in every child.
            </p>
          </div>
        </FadeIn>

        {/* Grade Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gradeCards.map((card, index) => (
            <FadeIn key={card.grade} delay={0.1 * index} direction="up" className="h-full">
              <div
                className={`group relative h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-100 ${card.shadow}`}
              >
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-md mb-6 transform group-hover:rotate-6 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.grade}
                  </h3>
                  
                  <p className="text-gray-500 font-medium mb-6">
                    {card.description}
                  </p>

                  <div className={`flex items-center gap-2 font-bold ${card.textColor} group-hover:translate-x-2 transition-transform`}>
                    Explore Activities
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
