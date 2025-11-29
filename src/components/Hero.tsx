'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FadeIn from './animations/FadeIn';

export default function Hero() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  return (
    <section className="relative bg-[#0a0a4a] text-white pt-32 pb-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/Animated_educational_background.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0a0a4a]/80"></div>
      </div>

      {/* Background Shapes/Curve - Simplified representation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[50%] transform scale-x-150 translate-y-1/2 z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <FadeIn delay={0.2} direction="right">
              <div className="inline-block bg-blue-900/50 px-4 py-1 rounded-full text-sm font-semibold text-blue-200 mb-2">
                See learning outcomes in 2 weeks
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4} direction="up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Kids see fun.
                <br />
                You see real <span className="italic text-blue-300">learning outcomes</span>.
              </h1>
            </FadeIn>

            <FadeIn delay={0.6} direction="up">
              <p className="text-lg text-blue-100 max-w-lg">
                Scientifically-designed quizzes that bring out the best in every child.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.8} direction="up">
              <div className="pt-4">
                <Link 
                  href={user ? "/student" : "/login"}
                  className="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg text-center min-w-[160px]"
                >
                  Get Started
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center">
             {/* In a real app, this would be a composed image of kids and characters */}
             <div className="relative w-full h-full">
                {/* Main Hero Image */}
                <FadeIn delay={0.5} direction="left" className="w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full relative rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                          <Image 
                            src="/nadee-teacher-hero.jpeg" 
                            alt="Nadee Teacher Hero" 
                            fill
                            className="object-cover object-top"
                            priority
                          />
                      </div>
                  </div>
                </FadeIn>
                
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
