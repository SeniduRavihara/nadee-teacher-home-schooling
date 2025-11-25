'use client';

import {
    BookOpen,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    Video
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: BookOpen, label: 'Quizzes', href: '/admin/quizzes' },
  { icon: Users, label: 'Online Classes', href: '/admin/classes' },
  { icon: Video, label: 'Video Classes', href: '/admin/videos' },
  { icon: FileText, label: 'Reports', href: '/admin/reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0a4a] text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 flex items-center gap-2 border-b border-blue-900">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-900 font-bold">S</div>
        <span className="text-xl font-bold">SplashAdmin</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white font-medium shadow-lg' 
                  : 'text-blue-200 hover:bg-blue-900 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-900">
        <button className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white w-full rounded-xl hover:bg-blue-900 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
