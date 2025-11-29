'use client';

import { useState } from 'react';
import FadeIn from './animations/FadeIn';

const grades = [
  'Preschool',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
];

const games = [
  {
    title: 'Counting Adventure',
    grade: 'Preschool',
    subject: 'Math',
    image: '/placeholder-game-1.png',
    color: 'bg-green-100',
  },
  {
    title: 'Word Builder',
    grade: 'Grade 1',
    subject: 'Reading',
    image: '/placeholder-game-3.png',
    color: 'bg-orange-100',
  },
  {
    title: 'Math Challenge',
    grade: 'Grade 2',
    subject: 'Math',
    image: '/placeholder-game-4.png',
    color: 'bg-blue-100',
  },
  {
    title: 'Science Explorer',
    grade: 'Grade 3',
    subject: 'Science',
    image: '/placeholder-game-5.png',
    color: 'bg-teal-100',
  },
  {
    title: 'History Quest',
    grade: 'Grade 4',
    subject: 'Social Studies',
    image: '/placeholder-game-6.png',
    color: 'bg-red-100',
  },
  {
    title: 'Advanced Logic',
    grade: 'Grade 5',
    subject: 'Logic',
    image: '/placeholder-game-7.png',
    color: 'bg-indigo-100',
  },
  // Add more items to ensure every grade has at least one match for demo purposes
  {
    title: 'Color Match',
    grade: 'Preschool',
    subject: 'Art',
    image: '/placeholder-game-8.png',
    color: 'bg-pink-100',
  },
];

export default function UnlimitedFun() {
  const [activeGrade, setActiveGrade] = useState('Preschool');

  const filteredGames = games.filter(game => game.grade === activeGrade);

  return (
    <section className="py-20 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unlimited fun. Unlimited learning.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scientifically-designed activities that bring out the best in every child.
            </p>
          </div>
        </FadeIn>

        {/* Grade Selector */}
        <FadeIn delay={0.2} direction="up">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setActiveGrade(grade)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeGrade === grade
                    ? 'bg-blue-900 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <FadeIn key={index} delay={0.3 + index * 0.1} direction="up" className="h-full">
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer h-full"
                >
                  {/* Game Image Placeholder */}
                  <div className={`h-40 ${game.color} relative flex items-center justify-center`}>
                    <span className="text-gray-500 font-medium opacity-70">Activity Preview</span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{game.grade}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{game.subject}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>More exciting activities coming soon for {activeGrade}!</p>
            </div>
          )}
        </div>
        
        <FadeIn delay={0.8} direction="up">
          <div className="text-center mt-12">
              <button className="text-blue-600 font-bold hover:text-blue-800 flex items-center justify-center gap-2 mx-auto">
                  View all activities
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
              </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
