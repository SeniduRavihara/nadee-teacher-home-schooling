import StatCard from '@/components/admin/StatCard';
import { BookOpen, Trophy, Users, Video } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin!</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="12,345"
          change="+12%"
          isPositive={true}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Quizzes"
          value="456"
          change="+5%"
          isPositive={true}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Video Classes"
          value="89"
          change="+2"
          isPositive={true}
          icon={Video}
          color="bg-orange-500"
        />
        <StatCard
          title="Completion Rate"
          value="87%"
          change="+3%"
          isPositive={true}
          icon={Trophy}
          color="bg-green-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New student registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Quizzes</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Math Adventure: Grade 3</p>
                    <p className="text-xs text-gray-500">1.2k attempts</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">92% Pass</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
