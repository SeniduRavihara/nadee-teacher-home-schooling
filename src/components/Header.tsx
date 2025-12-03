'use client';

import { useData } from '@/context/DataContext';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { ChevronDown, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { profile } = useData();

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);


    };
    getUser();
  }, [supabase]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="NadeeTeacher" width={150} height={40} className="h-10 w-auto" />
              <span className="text-xl font-bold text-blue-900">NadeeTeacher</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 py-2">
                Classes <ChevronDown size={16} />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <Link href="/classes/preschool" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                    Preschool
                  </Link>
                  <Link href="/classes/grade-1" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                    Grade 1
                  </Link>
                  <Link href="/classes/grade-2" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                    Grade 2
                  </Link>
                  <Link href="/classes/grade-3" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                    Grade 3
                  </Link>
                  <Link href="/classes/grade-4" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                    Grade 4
                  </Link>
                  <Link href="/classes/grade-5" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors">
                    Grade 5
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/#our-story" className="text-gray-600 hover:text-blue-600 font-medium py-2">
              Our Story
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="bg-gray-100 text-gray-700 px-3 sm:px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                      <LayoutDashboard size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/student"
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <LayoutDashboard size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 text-sm sm:text-base whitespace-nowrap">
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap hidden sm:block"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
