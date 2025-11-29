'use client';

import PaymentModal from '@/components/student/PaymentModal';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { createClient } from '@/utils/supabase/client';
import { Clock, Film, Lock, MonitorPlay, PlayCircle, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function VideosPage() {
  const [userGrade, setUserGrade] = useState<string>('Grade 1');
  const [loading, setLoading] = useState(true);
  const { isPaid, loading: paymentLoading, checkPaymentStatus } = usePaymentStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'recording' | 'movie' | 'yt_video'>('recording');
  const supabase = createClient();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('grade')
        .eq('id', user.id)
        .single();
      if (profile?.grade) {
        setUserGrade(profile.grade);
        fetchCourses(profile.grade);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchCourses = async (grade: string) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, videos(count)')
        .eq('target_grade', grade)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCourses = (data || []).map(course => {
        // Helper for colors based on title/subject
        const getColors = (title: string) => {
          const t = title.toLowerCase();
          if (t.includes('math')) return 'bg-blue-600';
          if (t.includes('science')) return 'bg-green-600';
          if (t.includes('english') || t.includes('grammar')) return 'bg-yellow-500';
          if (t.includes('art') || t.includes('creative')) return 'bg-purple-600';
          return 'bg-indigo-600';
        };

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          videos: course.videos?.[0]?.count || 0,
          duration: '1h 30m', // Placeholder as we don't calculate total duration yet
          thumbnailColor: getColors(course.title),
          progress: 0, // Placeholder for progress tracking
          targetGrade: course.target_grade,
          category: course.category || 'yt_video'
        };
      });

      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const [courses, setCourses] = useState<any[]>([]);

  const filteredCourses = courses.filter(course => course.category === activeTab);

  if (loading || paymentLoading) {
    return <div className="p-8 text-center">Loading videos...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Library ({userGrade})</h1>
          <p className="text-gray-500 mt-2">Watch and learn at your own pace</p>
        </div>
        
        {/* Introductory Video */}
        <div className="relative w-40 h-24 bg-gray-900 rounded-xl overflow-hidden shadow-md border-2 border-white transition-all duration-300 hover:scale-[2.5] hover:shadow-xl hover:z-50 origin-top-right group cursor-pointer">
          <iframe 
            src="https://www.youtube.com/embed/jfKfPfyJRdk?controls=0&mute=1" 
            className="w-full h-full object-cover"
            title="Intro Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('recording')}
          className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'recording' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Video size={18} />
          Recordings
          {activeTab === 'recording' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('movie')}
          className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'movie' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Film size={18} />
          Movies
          {activeTab === 'movie' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('yt_video')}
          className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'yt_video' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MonitorPlay size={18} />
          YT Videos
          {activeTab === 'yt_video' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="relative group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
              
              {/* Locking Overlay */}
              {!isPaid && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Lock className="text-gray-500" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Content Locked</h3>
                  <p className="text-sm text-gray-500 mb-4">Payment required for this month</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Unlock Now
                  </button>
                </div>
              )}

              <Link href={`/student/videos/${course.id}`} className="block">
                <div className={`h-48 ${course.thumbnailColor} relative flex items-center justify-center`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <PlayCircle size={32} fill="currentColor" />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock size={12} />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{course.videos} Videos</span>
                    {course.progress > 0 ? (
                      <span className="text-blue-600 font-bold">{course.progress}% Complete</span>
                    ) : (
                      <span className="text-gray-400">Not Started</span>
                    )}
                  </div>
                  
                  <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              {activeTab === 'recording' && <Video size={32} />}
              {activeTab === 'movie' && <Film size={32} />}
              {activeTab === 'yt_video' && <MonitorPlay size={32} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900">No {activeTab.replace('_', ' ')}s found</h3>
            <p className="text-gray-500 mt-1">Check back later for new content!</p>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          checkPaymentStatus();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
