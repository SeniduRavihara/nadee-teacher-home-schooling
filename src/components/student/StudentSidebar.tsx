'use client';

import { createClient } from '@/utils/supabase/client';
import {
    BookOpen,
    LayoutDashboard,
    Star,
    User,
    Users,
    Video
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems = [
  { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { name: 'Online Class', href: '/student/classes', icon: Users },
  { name: 'Quizzes', href: '/student/quizzes', icon: BookOpen },
  { name: 'Video Library', href: '/student/videos', icon: Video },
  { name: 'Profile', href: '/student/profile', icon: User },
];

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [stars, setStars] = useState(1250); // Default/Mock value

  useEffect(() => {
    // Optional: Fetch real stars if available
    const fetchStars = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Example: Fetch from a 'stats' table or sum quiz scores
        // For now, we keep the mock value or fetch if logic exists
      }
    };
    fetchStars();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        w-64 bg-white text-gray-900 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 border-r border-gray-100
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
           <Link href="/student" onClick={onClose} className="flex items-center gap-3">
             <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
             </div>
             <span className="text-xl font-bold text-gray-900">NadeeTeacher</span>
           </Link>
        </div>

        <div className="px-4 mb-6">
            {/* Stars Card */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-200">
                <div className="flex items-center gap-2 mb-1">
                    <Star fill="currentColor" className="text-white" size={20} />
                    <span className="text-2xl font-bold">{stars.toLocaleString()}</span>
                </div>
                <div className="text-sm font-medium text-white/90">Total Stars Earned</div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 w-full rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                N
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
