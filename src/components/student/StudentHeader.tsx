import { Bell, Search } from 'lucide-react';

export default function StudentHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      {/* Search Bar */}
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search for lessons, quizzes..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-blue-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-900">Alex Johnson</div>
            <div className="text-xs text-gray-500">Grade 4 Student</div>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Student Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
}
