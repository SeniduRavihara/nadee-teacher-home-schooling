'use client';

import FadeIn from '@/components/animations/FadeIn';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Syllabus } from '@/data/syllabus';
import { Award, BookOpen, Clock, Globe, Music, Star } from 'lucide-react';
import Image from 'next/image';

const iconMap: Record<string, any> = {
  Music,
  Star,
  Globe,
  BookOpen,
  Clock,
  Award,
};

interface GradePageContentProps {
  data: Syllabus | null;
}

export default function GradePageContent({ data }: GradePageContentProps) {
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
              {data.image && (
                <div className="mb-8 flex justify-center">
                  <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] rounded-3xl border-8 border-white/30 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                    <Image 
                      src={data.image} 
                      alt={`${data.title} Syllabus`} 
                      fill 
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">{data.title}</h1>
              <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto drop-shadow-md">{data.description}</p>
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
              {data.modules.map((module, index) => {
                const IconComponent = iconMap[module.icon as keyof typeof iconMap] || Star;
                
                return (
                  <FadeIn key={index} delay={index * 0.1} direction="up">
                    <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      
                      {/* Content Card */}
                      <div className="flex-1 w-full">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-colors relative group">
                          <div className={`absolute top-6 ${index % 2 === 0 ? 'left-0 md:-left-3' : 'right-0 md:-right-3'} w-6 h-6 bg-white transform rotate-45 border-l-2 border-b-2 border-gray-100 hidden md:block group-hover:border-blue-200`}></div>
                          <div className="flex items-center gap-4 mb-3">
                             <div className={`p-3 rounded-2xl bg-gradient-to-br ${data.color} text-white shadow-md`}>
                               <IconComponent size={24} />
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
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
