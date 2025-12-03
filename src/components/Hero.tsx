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
    <section className="relative bg-[#0a0a4a] text-white pt-32 pb-20 overflow-hidden min-h-[600px] lg:min-h-[800px] flex items-center">
      {/* Background Image */}
        <div className="absolute inset-0 z-0">
        {/* Mobile Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
        >
          <source src="/mobile-video.mp4" type="video/mp4" />
        </video>

        {/* Desktop Background Image */}
        <Image
          src="/new gem.png"
          alt="Background"
          fill
          className="object-cover object-[calc(50%+100px)_top] md:object-top hidden md:block"
          priority
        />
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-[#000]/30"></div> */}
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
                 <span className="text-6xl md:text-7xl lg:text-8xl inline-block font-bold font-chewy tracking-wider">Kids see fun.</span>
                <br />
                 <span className="text-6xl md:text-7xl lg:text-8xl inline-block font-bold font-chewy tracking-wider">You see real</span>{' '}
                <span className="italic text-blue-300">learning outcomes</span>.
              </h1>
            </FadeIn>

            <FadeIn delay={0.6} direction="up">
              <p className="text-lg text-blue-100 max-w-lg">
                Engaging English activities that bring out the best in every child..
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
        </div>
      </div>
    </section>
  );
}
