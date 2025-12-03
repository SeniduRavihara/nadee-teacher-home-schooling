import { useData } from '@/context/DataContext';
import { LayoutDashboard, Menu, Search } from 'lucide-react';
import Link from 'next/link';

interface StudentHeaderProps {
  onMenuClick?: () => void;
}

export default function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  const { profile } = useData();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-64 z-10 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <input
            type="text"
            placeholder="Search for lessons, quizzes..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification button removed as requested */}
        
        {profile?.role === 'admin' && (
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg"
          >
            <LayoutDashboard size={18} />
            Admin View
          </Link>
        )}
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">{profile?.full_name || 'Loading...'}</div>
            <div className="text-xs text-gray-500">{profile?.grade || ''}</div>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || 'User'}`} 
              alt="Student Avatar" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
