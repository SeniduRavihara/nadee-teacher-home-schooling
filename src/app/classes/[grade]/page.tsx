'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FadeIn from '@/components/animations/FadeIn';
import { Award, Beaker, BookOpen, Calculator, Clock, Globe, Music, Star } from 'lucide-react';
import { useParams } from 'next/navigation';

// Syllabus Data
const syllabusData: Record<string, {
  title: string;
  description: string;
  color: string;
  modules: { title: string; description: string; icon: any }[];
}> = {
  'preschool': {
    title: 'Preschool',
    description: 'Fun basics & discovery',
    color: 'from-pink-400 to-rose-500',
    modules: [
      { title: 'Colors & Shapes', description: 'Identify and sort colors and shapes.', icon: <Star size={24} /> },
      { title: 'Numbers 1-10', description: 'Counting and recognizing numbers.', icon: <Calculator size={24} /> },
      { title: 'Alphabet Fun', description: 'Learning ABCs with songs and games.', icon: <Music size={24} /> },
      { title: 'My World', description: 'Learning about family, friends, and nature.', icon: <Globe size={24} /> },
    ]
  },
  'grade-1': {
    title: 'Grade 1',
    description: 'Reading & counting',
    color: 'from-orange-400 to-amber-500',
    modules: [
      { title: 'Phonics & Reading', description: 'Building words and reading simple sentences.', icon: <BookOpen size={24} /> },
      { title: 'Addition & Subtraction', description: 'Basic math operations up to 20.', icon: <Calculator size={24} /> },
      { title: 'Living Things', description: 'Plants, animals, and us.', icon: <Beaker size={24} /> },
      { title: 'Time & Calendar', description: 'Days of the week and reading the clock.', icon: <Clock size={24} /> },
    ]
  },
  'grade-2': {
    title: 'Grade 2',
    description: 'Math & storytelling',
    color: 'from-green-400 to-emerald-500',
    modules: [
      { title: 'Story Writing', description: 'Creating short stories and understanding plot.', icon: <BookOpen size={24} /> },
      { title: 'Multiplication Basics', description: 'Introduction to times tables.', icon: <Calculator size={24} /> },
      { title: 'Earth & Space', description: 'Our planet and the solar system.', icon: <Globe size={24} /> },
      { title: 'Measurements', description: 'Length, weight, and capacity.', icon: <Beaker size={24} /> },
    ]
  },
  'grade-3': {
    title: 'Grade 3',
    description: 'Science & nature',
    color: 'from-cyan-400 to-blue-500',
    modules: [
      { title: 'Grammar & Usage', description: 'Nouns, verbs, and sentence structure.', icon: <BookOpen size={24} /> },
      { title: 'Fractions & Division', description: 'Understanding parts of a whole.', icon: <Calculator size={24} /> },
      { title: 'Forces & Motion', description: 'How things move and work.', icon: <Beaker size={24} /> },
      { title: 'World Geography', description: 'Continents, oceans, and cultures.', icon: <Globe size={24} /> },
    ]
  },
  'grade-4': {
    title: 'Grade 4',
    description: 'History & art',
    color: 'from-purple-400 to-violet-500',
    modules: [
      { title: 'Creative Writing', description: 'Poetry, essays, and advanced storytelling.', icon: <BookOpen size={24} /> },
      { title: 'Decimals & Geometry', description: 'Angles, shapes, and decimal numbers.', icon: <Calculator size={24} /> },
      { title: 'History of the World', description: 'Ancient civilizations and events.', icon: <Globe size={24} /> },
      { title: 'Energy & Matter', description: 'States of matter and energy forms.', icon: <Beaker size={24} /> },
    ]
  },
  'grade-5': {
    title: 'Grade 5',
    description: 'Logic & reasoning',
    color: 'from-indigo-400 to-blue-600',
    modules: [
      { title: 'Advanced Reading', description: 'Analyzing texts and literature.', icon: <BookOpen size={24} /> },
      { title: 'Algebra Prep', description: 'Variables, equations, and logic.', icon: <Calculator size={24} /> },
      { title: 'Human Body', description: 'Systems of the body and health.', icon: <Beaker size={24} /> },
      { title: 'Data & Graphs', description: 'Interpreting data and statistics.', icon: <Award size={24} /> },
    ]
  },
};

export default function GradePage() {
  const params = useParams();
  const gradeSlug = params.grade as string;
  const data = syllabusData[gradeSlug];

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Grade Not Found</h1>
          <p className="text-gray-600 mt-4">The grade you are looking for does not exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className={`pt-32 pb-20 bg-gradient-to-br ${data.color} text-white relative overflow-hidden`}>
         <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-20"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <FadeIn direction="up">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">{data.title}</h1>
              <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mx-auto">{data.description}</p>
            </FadeIn>
         </div>
         
         {/* Decorative shapes */}
         <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
         <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse delay-700"></div>
      </section>

      {/* Syllabus Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Class Syllabus</h2>
              <p className="text-gray-600">A fun journey through learning!</p>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 rounded-full hidden md:block"></div>

            <div className="space-y-12">
              {data.modules.map((module, index) => (
                <FadeIn key={index} delay={index * 0.1} direction="up">
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Content Card */}
                    <div className="flex-1 w-full">
                      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-colors relative group">
                        <div className={`absolute top-6 ${index % 2 === 0 ? 'left-0 md:-left-3' : 'right-0 md:-right-3'} w-6 h-6 bg-white transform rotate-45 border-l-2 border-b-2 border-gray-100 hidden md:block group-hover:border-blue-200`}></div>
                        <div className="flex items-center gap-4 mb-3">
                           <div className={`p-3 rounded-2xl bg-gradient-to-br ${data.color} text-white shadow-md`}>
                             {module.icon}
                           </div>
                           <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                        </div>
                        <p className="text-gray-600">{module.description}</p>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${data.color} border-4 border-white shadow-lg flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
