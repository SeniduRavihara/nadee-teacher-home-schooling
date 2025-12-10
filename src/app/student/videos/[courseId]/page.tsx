"use client";

import PaymentModal from "@/components/student/PaymentModal";
import Playlist from "@/components/student/Playlist";
import VideoPlayer from "@/components/student/VideoPlayer";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, Lock, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

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
  is_single_video: boolean;
  category: string;
}

export default function CoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const {
    isPaid,
    loading: paymentLoading,
    checkPaymentStatus,
  } = usePaymentStatus();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(
    new Set()
  );
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // 1. Fetch Course Details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*, category")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);
      checkPaymentStatus(courseData.target_grade);

      // 2. Fetch Videos
      const { data: videosData, error: videosError } = await supabase
        .from("videos")
        .select("*")
        .eq("course_id", courseId)
        .order("position", { ascending: true });

      if (videosError) throw videosError;
      setVideos(videosData || []);
      if (videosData && videosData.length > 0) {
        setActiveVideoId(videosData[0].id);
      }

      // 3. Fetch Progress
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: progressData } = await supabase
          .from("video_progress")
          .select("video_id")
          .eq("user_id", user.id)
          .eq("is_completed", true);

        if (progressData) {
          setCompletedVideoIds(new Set(progressData.map((p) => p.video_id)));
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      checkPaymentStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (videoId: string) => {
    setActiveVideoId(videoId);
    // Optional: Mark as watched logic could go here or be triggered by video end
  };

  if (loading || paymentLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
            <Sparkles className="text-white" size={32} />
          </div>
          <p className="text-purple-600 font-bold text-lg">
            Loading awesome video... 🎬
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <div className="text-7xl mb-4">🎥</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Oops! Course Not Found
        </h2>
        <p className="text-gray-600 font-bold">
          This course doesn't exist or was removed.
        </p>
      </div>
    );
  }

  const activeVideo = videos.find((v) => v.id === activeVideoId) || videos[0];

  // Map videos to Playlist format
  const playlistVideos = videos.map((v) => {
    // Logic: Locked if (video is premium AND user not paid AND category is not yt_video)
    // If video.is_locked is false, it's free for everyone.
    // If video.is_locked is true, it requires payment, unless it's a YT video.
    const isLocked = v.is_locked && !isPaid && course?.category !== "yt_video";

    return {
      id: v.id,
      title: v.title,
      duration: v.duration || "00:00",
      isLocked,
      isCompleted: completedVideoIds.has(v.id),
      isPlaying: v.id === activeVideoId,
    };
  });

  // Check if active video is locked
  const activeVideoIsLocked =
    activeVideo &&
    activeVideo.is_locked &&
    !isPaid &&
    course?.category !== "yt_video";

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col pb-8">
      {/* Colorful Header */}
      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl border-4 border-white">
        <div className="relative z-10 flex items-center gap-4">
          <Link
            href="/student/videos"
            className="p-3 hover:bg-white/20 rounded-full transition-all hover:scale-110 border-2 border-white/50"
          >
            <ChevronLeft size={24} className="text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-1">{course.title} 🎬</h1>
            <p className="text-white/90 text-sm font-bold flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {course.target_grade}
              </span>
              <span>•</span>
              <span>
                {videos.length} Video{videos.length !== 1 ? "s" : ""}
              </span>
            </p>
          </div>
          <PlayCircle
            className="text-yellow-300 animate-pulse"
            size={48}
            fill="currentColor"
          />
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <Sparkles
          className="absolute top-6 right-24 text-yellow-300 animate-pulse"
          size={20}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Video Player Area */}
        <div
          className={`${
            course.is_single_video ? "col-span-full" : "lg:col-span-2"
          } flex flex-col gap-4`}
        >
          {activeVideo ? (
            activeVideoIsLocked ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col items-center justify-center text-white p-8 text-center border-4 border-purple-200 shadow-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-white animate-pulse">
                  <Lock className="text-white" size={40} />
                </div>
                <h3 className="text-3xl font-black mb-3">Video Locked! 🔒</h3>
                <p className="text-gray-300 mb-8 max-w-md text-lg font-bold">
                  Complete your monthly payment to watch this awesome video! 🎉
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-2xl font-black text-lg transition-all hover:scale-110 text-white shadow-2xl border-2 border-white"
                >
                  Unlock Now! 🔓
                </button>
              </div>
            ) : (
              <div className="rounded-3xl overflow-hidden border-4 border-purple-200 shadow-2xl">
                <VideoPlayer
                  title={activeVideo.title}
                  videoUrl={activeVideo.video_url}
                />
              </div>
            )
          ) : (
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl aspect-video flex flex-col items-center justify-center text-purple-600 border-4 border-purple-200">
              <div className="text-6xl mb-4">📹</div>
              <p className="font-black text-xl">No videos available yet!</p>
            </div>
          )}

          {activeVideo && (
            <div className="bg-white p-8 rounded-3xl shadow-lg border-4 border-purple-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <PlayCircle
                    size={20}
                    className="text-white"
                    fill="currentColor"
                  />
                </div>
                <h2 className="text-2xl font-black text-gray-900 flex-1">
                  {activeVideo.title}
                </h2>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed">
                {activeVideo.description || course.description}
              </p>
            </div>
          )}
        </div>

        {/* Playlist Sidebar - Only show if NOT a single video course */}
        {!course.is_single_video && (
          <div className="h-full min-h-[400px]">
            <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-200 p-6 h-full">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
                Course Videos
              </h3>
              <Playlist
                videos={playlistVideos}
                onVideoSelect={handleVideoSelect}
              />
            </div>
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
        defaultGrade={course?.target_grade}
      />
    </div>
  );
}
