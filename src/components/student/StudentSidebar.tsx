'use client';

import {
    BookOpen,
    LayoutDashboard,
    LogOut,
    Star,
    Users,
    Video
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
  { icon: Users, label: 'My Classes', href: '/student/classes' },
  { icon: BookOpen, label: 'Quizzes', href: '/student/quizzes' },
  { icon: Video, label: 'Video Library', href: '/student/videos' },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-6 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-bold text-blue-900">SplashStudent</span>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white mb-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Star className="fill-white" size={20} />
            <span className="font-bold text-lg">1,250</span>
          </div>
          <div className="text-xs font-medium opacity-90">Total Stars Earned</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 w-full rounded-xl hover:bg-red-50 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
