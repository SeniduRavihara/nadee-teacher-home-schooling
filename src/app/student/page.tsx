import { Play } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 🚀</h1>
          <p className="text-blue-100 mb-6 max-w-lg">
            You've completed 80% of your weekly goals. Keep up the great work and earn more stars!
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
            Resume Learning
          </button>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white opacity-10 rounded-full -mb-10"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
            <Link href="/student/videos" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-32 h-20 bg-gray-200 rounded-xl flex-shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                     <Play size={14} className="text-blue-600 ml-0.5" fill="currentColor" />
                  </div>
               </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-gray-900">Introduction to Solar System</h3>
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Science</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-blue-500 h-full w-3/4 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500">15 mins remaining</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-32 h-20 bg-gray-200 rounded-xl flex-shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                     <Play size={14} className="text-blue-600 ml-0.5" fill="currentColor" />
                  </div>
               </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-gray-900">Multiplication Tables</h3>
                 <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Math</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-purple-500 h-full w-1/4 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500">25 mins remaining</p>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Classes</h2>
            <Link href="/student/classes" className="text-blue-600 font-bold text-sm hover:underline">View Schedule</Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex flex-col items-center justify-center text-orange-600 flex-shrink-0">
                <span className="text-xs font-bold">NOV</span>
                <span className="text-lg font-bold leading-none">26</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Creative Writing Workshop</h3>
                <p className="text-xs text-gray-500 mb-2">2:00 PM • Ms. Johnson</p>
                <button className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors">
                  Join Class
                </button>
              </div>
            </div>

            <div className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex flex-col items-center justify-center text-green-600 flex-shrink-0">
                <span className="text-xs font-bold">NOV</span>
                <span className="text-lg font-bold leading-none">27</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Science Experiments</h3>
                <p className="text-xs text-gray-500 mb-2">11:00 AM • Dr. Brown</p>
                <button className="text-xs font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full cursor-not-allowed">
                  Starts in 1 day
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
