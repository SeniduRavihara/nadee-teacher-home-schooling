'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { ChevronDown, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ child_name: string; grade: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('child_name, grade')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
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
              <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
                Parents <ChevronDown size={16} />
              </button>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
                Educators <ChevronDown size={16} />
              </button>
            </div>
            <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
              Our Story
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                {profile?.child_name ? (
                  <Link href="/student/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-full transition-colors">
                     <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-gray-900 leading-tight">{profile.child_name}</div>
                        <div className="text-xs text-gray-500 font-medium">{profile.grade}</div>
                     </div>
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        {/* Placeholder Avatar - could be replaced with actual avatar if available */}
                        <Image 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.child_name}`} 
                          alt={profile.child_name}
                          width={40}
                          height={40}
                        />
                     </div>
                  </Link>
                ) : (
                  <Link
                    href="/student"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700">
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors"
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
