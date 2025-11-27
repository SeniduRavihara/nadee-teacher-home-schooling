'use client';

import Playlist from '@/components/student/Playlist';
import VideoPlayer from '@/components/student/VideoPlayer';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { createClient } from '@/utils/supabase/client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  video_url: string;
  is_locked: boolean;
  position: number;
}

interface Course {
  id: string;
  title: string;
  target_grade: string;
  description: string;
}

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { isPaid, loading: paymentLoading } = usePaymentStatus();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set());
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // 1. Fetch Course Details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // 2. Fetch Videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (videosError) throw videosError;
      setVideos(videosData || []);
      if (videosData && videosData.length > 0) {
        setActiveVideoId(videosData[0].id);
      }

      // 3. Fetch Progress
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progressData } = await supabase
          .from('video_progress')
          .select('video_id')
          .eq('user_id', user.id)
          .eq('is_completed', true);
        
        if (progressData) {
          setCompletedVideoIds(new Set(progressData.map(p => p.video_id)));
        }
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (videoId: string) => {
    setActiveVideoId(videoId);
    // Optional: Mark as watched logic could go here or be triggered by video end
  };

  if (loading || paymentLoading) {
    return <div className="flex justify-center items-center h-screen">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center py-12">Course not found</div>;
  }

  const activeVideo = videos.find(v => v.id === activeVideoId) || videos[0];

  // Map videos to Playlist format
  const playlistVideos = videos.map(v => {
    // Logic: Locked if (video is premium AND user not paid)
    // If video.is_locked is false, it's free for everyone.
    // If video.is_locked is true, it requires payment.
    const isLocked = v.is_locked && !isPaid;

    return {
      id: v.id,
      title: v.title,
      duration: v.duration || '00:00',
      isLocked,
      isCompleted: completedVideoIds.has(v.id),
      isPlaying: v.id === activeVideoId
    };
  });

  // Check if active video is locked
  const activeVideoIsLocked = activeVideo && activeVideo.is_locked && !isPaid;

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-4">
        <Link href="/student/videos" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-500 text-sm">{course.target_grade}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Video Player Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {activeVideo ? (
            activeVideoIsLocked ? (
               <div className="bg-black rounded-2xl overflow-hidden aspect-video relative flex flex-col items-center justify-center text-white p-6 text-center">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                   <div className="text-3xl">🔒</div>
                 </div>
                 <h3 className="text-xl font-bold mb-2">This video is locked</h3>
                 <p className="text-gray-400 mb-6 max-w-md">
                   Please complete your monthly payment to access premium content.
                 </p>
                 <Link href="/student/payments" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold transition-colors">
                   Unlock Access
                 </Link>
               </div>
            ) : (
              <VideoPlayer title={activeVideo.title} videoUrl={activeVideo.video_url} />
            )
          ) : (
            <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center text-gray-400">
              No videos available
            </div>
          )}
          
          {activeVideo && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{activeVideo.title}</h2>
              <p className="text-gray-600">
                {activeVideo.description || course.description}
              </p>
            </div>
          )}
        </div>

        {/* Playlist Sidebar */}
        <div className="h-full min-h-[400px]">
          <Playlist videos={playlistVideos} onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    </div>
  );
}
