'use client';

import { useData } from '@/context/DataContext';

import {
  BarChart3,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
  Video
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, name: 'Dashboard', href: '/admin' },
  { icon: GraduationCap, name: 'Students', href: '/admin/students' },
  { icon: BookOpen, name: 'Quizzes', href: '/admin/quizzes' },
  { icon: Users, name: 'Zoom classes', href: '/admin/classes' },
  { icon: Video, name: 'Video Classes', href: '/admin/videos' },
  { icon: CreditCard, name: 'Payments', href: '/admin/payments' },
  { icon: BarChart3, name: 'Reports', href: '/admin/reports' },
  { icon: Shield, name: 'Admin Management', href: '/admin/management' },
  { icon: Settings, name: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { profile } = useData();

  const filteredMenuItems = menuItems.filter(item => {
    if (profile?.role === 'admin' || profile?.role === 'superadmin') return true;
    if (profile?.role === 'moderator') {
      return ['Dashboard', 'Students', 'Payments'].includes(item.name);
    }
    return false;
  });

  return (
    <aside className="w-64 bg-[#0a0a4a] text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-blue-900">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-bold">NadeeTeacher</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
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
              <span>{item.name}</span>
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
