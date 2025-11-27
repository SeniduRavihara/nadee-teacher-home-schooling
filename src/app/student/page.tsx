'use client';

import { createClient } from '@/utils/supabase/client';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [userGrade, setUserGrade] = useState('Grade 1');
  const [userName, setUserName] = useState('Student');
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('grade, full_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserGrade(profile.grade || 'Grade 1');
        setUserName(profile.full_name?.split(' ')[0] || 'Student');
        
        // Fetch Upcoming Classes
        const { data: classes } = await supabase
          .from('online_classes')
          .select('*')
          .eq('target_grade', profile.grade)
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true })
          .limit(2);
        
        setUpcomingClasses(classes || []);

        // Fetch Recent Courses (simulated "Continue Learning")
        const { data: courses } = await supabase
          .from('courses')
          .select('*')
          .eq('target_grade', profile.grade)
          .limit(2);
          
        setRecentCourses(courses || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 🚀</h1>
          <p className="text-blue-100 mb-6 max-w-lg">
            You're doing great! Check out your upcoming classes and continue your learning journey.
          </p>
          <Link href="/student/videos" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
            Resume Learning
          </Link>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white opacity-10 rounded-full -mb-10"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recommended Courses</h2>
            <Link href="/student/videos" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
          </div>
          
          {recentCourses.length > 0 ? (
            recentCourses.map((course, index) => (
              <Link href={`/student/videos/${course.id}`} key={course.id}>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer group mb-4">
                  <div className={`w-32 h-20 ${index % 2 === 0 ? 'bg-blue-100' : 'bg-purple-100'} rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center`}>
                     <Play size={24} className={`${index % 2 === 0 ? 'text-blue-500' : 'text-purple-500'}`} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h3 className="font-bold text-gray-900">{course.title}</h3>
                       <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{course.subject || 'General'}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{course.description}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-gray-500 text-sm bg-gray-50 p-6 rounded-2xl text-center">
              No courses found for your grade yet.
            </div>
          )}
        </div>

        {/* Upcoming Classes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Classes</h2>
            <Link href="/student/classes" className="text-blue-600 font-bold text-sm hover:underline">View Schedule</Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls) => {
                const date = new Date(cls.start_time);
                return (
                  <div key={cls.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex flex-col items-center justify-center text-orange-600 flex-shrink-0">
                      <span className="text-xs font-bold">{date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                      <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{cls.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • {cls.instructor_name}
                      </p>
                      <Link href="/student/classes" className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors inline-block">
                        Join Class
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No upcoming classes scheduled.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
