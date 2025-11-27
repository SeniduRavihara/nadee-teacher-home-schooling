'use client';

import {
    BookOpen,
    CreditCard,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    User,
    Video
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { name: 'My Classes', href: '/student/classes', icon: BookOpen },
  { name: 'Quizzes', href: '/student/quizzes', icon: GraduationCap },
  { name: 'Videos', href: '/student/videos', icon: Video },
  { name: 'Payments', href: '/student/payments', icon: CreditCard },
  { name: 'Profile', href: '/student/profile', icon: User },
];

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
  const pathname = usePathname();

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
        w-64 bg-white text-gray-900 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 border-r border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
           <Link href="/student" onClick={onClose}>
             <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
             </div>
           </Link>
          <span className="text-xl font-bold text-gray-900">SplashStudent</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 w-full rounded-xl hover:bg-gray-50 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
