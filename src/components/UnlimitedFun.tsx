'use client';

import { useState } from 'react';

const grades = [
  'Pre-Kindergarten',
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
];

const games = [
  {
    title: 'Counting with Animals',
    grade: 'Pre-Kindergarten',
    subject: 'Math',
    image: '/placeholder-game-1.png', // Placeholder
    color: 'bg-green-100',
  },
  {
    title: 'Shape Adventure',
    grade: 'Kindergarten',
    subject: 'Math',
    image: '/placeholder-game-2.png', // Placeholder
    color: 'bg-purple-100',
  },
  {
    title: 'Word Builder',
    grade: 'Grade 1',
    subject: 'Reading',
    image: '/placeholder-game-3.png', // Placeholder
    color: 'bg-orange-100',
  },
  {
    title: 'Math Racer',
    grade: 'Grade 2',
    subject: 'Math',
    image: '/placeholder-game-4.png', // Placeholder
    color: 'bg-blue-100',
  },
];

export default function UnlimitedFun() {
  const [activeGrade, setActiveGrade] = useState('Pre-Kindergarten');

  return (
    <section className="py-20 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Unlimited fun. Unlimited learning.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scientifically-designed games that bring out the best in every child.
          </p>
        </div>

        {/* Grade Selector */}
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

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
            >
              {/* Game Image Placeholder */}
              <div className={`h-40 ${game.color} relative flex items-center justify-center`}>
                <span className="text-gray-400 font-medium">Game Preview</span>
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
          ))}
        </div>
        
        <div className="text-center mt-12">
            <button className="text-blue-600 font-bold hover:text-blue-800 flex items-center justify-center gap-2 mx-auto">
                View all games
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
    </section>
  );
}
