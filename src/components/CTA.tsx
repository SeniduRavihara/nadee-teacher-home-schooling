'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FadeIn from './animations/FadeIn';

export default function CTA() {
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
    <section className="py-20 bg-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-chewy">
            Try Nadee Teacher for free
          </h2>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up">
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12 text-left max-w-2xl mx-auto">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Money-back guarantee</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Access valid for the paid month</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Full access to all resources</span>
             </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4} direction="up">
          <Link 
            href={user ? "/student" : "/signup"}
            className="inline-block bg-blue-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Sign Up for Free
          </Link>
        </FadeIn>
        
        {/* Decorative elements */}
        <FadeIn delay={0.6} direction="up">
          <div className="mt-12 flex justify-center gap-4 opacity-50">
             {/* Simple shapes to represent fun elements */}
             <div className="w-10 h-10 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
             <div className="w-10 h-10 bg-blue-400 rounded-lg animate-bounce" style={{ animationDelay: '0.2s' }}></div>
             <div className="w-10 h-10 bg-green-400 transform rotate-45 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
