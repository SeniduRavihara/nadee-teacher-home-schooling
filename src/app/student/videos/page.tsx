"use client";

import PaymentModal from "@/components/student/PaymentModal";
import { useData } from "@/context/DataContext";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { createClient } from "@/utils/supabase/client";
import {
    Clapperboard,
    Clock,
    Film,
    Lock,
    MonitorPlay,
    PlayCircle,
    Sparkles,
    Video,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VideosPage() {
  const { activeStudent } = useData();
  const [loading, setLoading] = useState(true);
  const {
    isPaid,
    loading: paymentLoading,
    checkPaymentStatus,
  } = usePaymentStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "recording" | "movie" | "yt_video"
  >("recording");
  const [courses, setCourses] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (activeStudent) {
      checkPaymentStatus(activeStudent.grade);
      fetchCourses(activeStudent.grade);
    } else {
      setLoading(false);
    }
  }, [activeStudent]);

  const fetchCourses = async (grade: string) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*, videos(id, is_locked)")
        .eq("target_grade", grade)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedCourses = (data || []).map((course) => {
        // Helper for colors based on title/subject
        const getColors = (title: string) => {
          const t = title.toLowerCase();
          if (t.includes("math")) return "bg-blue-600";
          if (t.includes("science")) return "bg-green-600";
          if (t.includes("english") || t.includes("grammar"))
            return "bg-yellow-500";
          if (t.includes("art") || t.includes("creative"))
            return "bg-purple-600";
          return "bg-indigo-600";
        };

        // Check if any video is unlocked (free)
        const hasFreeVideo =
          course.videos?.some((v: any) => !v.is_locked) || false;
        const videoCount = course.videos?.length || 0;

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          videos: videoCount,
          duration: "1h 30m", // Placeholder as we don't calculate total duration yet
          thumbnailColor: getColors(course.title),
          progress: 0, // Placeholder for progress tracking
          targetGrade: course.target_grade,
          category: course.category || "yt_video",
          isSingleVideo: course.is_single_video,
          hasFreeVideo,
        };
      });

      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) => course.category === activeTab
  );

  if (loading || paymentLoading) {
    return <div className="p-8 text-center">Loading videos...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section with Colorful Design */}
      <div className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border-4 border-white">
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clapperboard className="animate-pulse" size={36} />
              <h1 className="text-4xl font-black">Video Library! 🎬</h1>
            </div>
            <p className="text-white/95 text-lg font-bold">
              Watch awesome videos and learn at your pace! 🚀
            </p>
            <p className="text-white/90 text-sm font-medium mt-1">
              {activeStudent?.grade || 'Grade 1'}
            </p>
          </div>

          {/* Introductory Video - Enhanced */}
          {/* <div className="relative w-48 h-28 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-300 hover:scale-[2.2] hover:shadow-2xl hover:z-50 origin-top-right group cursor-pointer">
            <iframe
              src="https://www.youtube.com/embed/jfKfPfyJRdk?controls=0&mute=1"
              className="w-full h-full object-cover"
              title="Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full animate-pulse">
              WATCH ME!
            </div>  
          </div> */}
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-yellow-300/20 rounded-full -mb-8"></div>
        <Sparkles
          className="absolute top-8 right-1/3 text-yellow-300 animate-pulse"
          size={24}
        />
      </div>

      {/* Colorful Tabs */}
      <div className="flex gap-3 border-b-4 border-purple-200 overflow-x-auto pb-1 bg-white/60 backdrop-blur-sm rounded-t-2xl p-2">
        <button
          onClick={() => setActiveTab("recording")}
          className={`pb-3 px-6 py-3 font-black transition-all relative whitespace-nowrap flex items-center gap-2 rounded-xl ${
            activeTab === "recording"
              ? "text-white bg-linear-to-r from-blue-500 to-cyan-400 shadow-lg scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          }`}
        >
          <Video size={20} />
          Recordings 📹
        </button>

        <button
          onClick={() => setActiveTab("movie")}
          className={`pb-3 px-6 py-3 font-black transition-all relative whitespace-nowrap flex items-center gap-2 rounded-xl ${
            activeTab === "movie"
              ? "text-white bg-linear-to-r from-purple-500 to-pink-400 shadow-lg scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          }`}
        >
          <Film size={20} />
          Movies 🎥
        </button>

        <button
          onClick={() => setActiveTab("yt_video")}
          className={`pb-3 px-6 py-3 font-black transition-all relative whitespace-nowrap flex items-center gap-2 rounded-xl ${
            activeTab === "yt_video"
              ? "text-white bg-linear-to-r from-orange-500 to-red-400 shadow-lg scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          }`}
        >
          <MonitorPlay size={20} />
          YT Videos 📺
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => {
            const cardColors = [
              "from-blue-400 to-cyan-300",
              "from-purple-400 to-pink-300",
              "from-green-400 to-emerald-300",
              "from-orange-400 to-yellow-300",
              "from-red-400 to-pink-300",
              "from-indigo-400 to-purple-300",
            ];
            const colorGradient = cardColors[index % cardColors.length];

            return (
              <div
                key={course.id}
                className="relative group bg-white rounded-3xl overflow-hidden shadow-lg border-4 border-purple-200 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                {/* Locking Overlay */}
                {!isPaid &&
                  activeTab !== "yt_video" &&
                  !course.hasFreeVideo && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-16 h-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 shadow-md border-4 border-white">
                        <Lock className="text-gray-500" size={28} />
                      </div>
                      <h3 className="font-black text-gray-900 mb-1 text-lg">
                        Locked! 🔒
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 font-bold">
                        Payment needed to watch
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white text-sm font-black rounded-full hover:scale-105 transition-all shadow-lg border-2 border-white"
                      >
                        Unlock Now! 🔓
                      </button>
                    </div>
                  )}

                <Link
                  href={
                    !isPaid && activeTab !== "yt_video" && !course.hasFreeVideo
                      ? "#"
                      : `/student/videos/${course.id}`
                  }
                  className="block"
                >
                  <div
                    className={`h-48 bg-linear-to-br ${colorGradient} relative flex items-center justify-center`}
                  >
                    <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:scale-125 transition-transform shadow-xl border-4 border-white/50">
                      <PlayCircle size={40} fill="currentColor" />
                    </div>

                    {/* Free Preview Badge */}
                    {!isPaid &&
                      activeTab !== "yt_video" &&
                      course.hasFreeVideo && (
                        <div className="absolute top-4 left-4 bg-linear-to-r from-green-400 to-emerald-500 text-white text-xs font-black px-3 py-2 rounded-full shadow-lg flex items-center gap-1 animate-pulse border-2 border-white">
                          <PlayCircle size={14} fill="currentColor" />
                          FREE! 🎁
                        </div>
                      )}

                    {course.isSingleVideo && (
                      <div className="absolute top-4 right-4 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-black px-3 py-2 rounded-full shadow-lg border-2 border-white">
                        Single Video 🎬
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1 border-2 border-white/50">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-medium">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm mb-4">
                      {course.isSingleVideo ? (
                        <span className="font-black text-purple-600 flex items-center gap-1 bg-purple-50 px-3 py-2 rounded-full border-2 border-purple-200">
                          <PlayCircle size={16} />
                          Watch! 🎬
                        </span>
                      ) : (
                        <span className="font-black text-blue-600 bg-blue-50 px-3 py-2 rounded-full border-2 border-blue-200">
                          {course.videos} Videos 📹
                        </span>
                      )}

                      {course.progress > 0 ? (
                        <span className="text-green-600 font-black bg-green-50 px-3 py-2 rounded-full border-2 border-green-200">
                          {course.progress}% ✓
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold">
                          Start! 🚀
                        </span>
                      )}
                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200">
                      <div
                        className="h-full bg-linear-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    {/* Watch Free Video Button */}
                    {!isPaid &&
                      activeTab !== "yt_video" &&
                      course.hasFreeVideo && (
                        <div className="mt-4 pt-4 border-t-2 border-purple-100">
                          <span className="block w-full text-center py-3 bg-linear-to-r from-green-400 to-emerald-500 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-md border-2 border-white">
                            Watch Free! 🎁
                          </span>
                        </div>
                      )}
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-linear-to-br from-purple-100 to-pink-100 p-12 rounded-3xl text-center border-4 border-purple-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 shadow-lg border-4 border-purple-300">
              {activeTab === "recording" && <Video size={36} />}
              {activeTab === "movie" && <Film size={36} />}
              {activeTab === "yt_video" && <MonitorPlay size={36} />}
            </div>
            <h3 className="text-2xl font-black text-purple-700 mb-2">
              No Videos Yet! 📺
            </h3>
            <p className="text-purple-600 font-bold">
              Exciting {activeTab.replace("_", " ")} content is coming soon! 🎉
            </p>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          checkPaymentStatus(activeStudent?.grade || 'Grade 1');
          setIsModalOpen(false);
        }}
        defaultGrade={activeStudent?.grade || 'Grade 1'}
      />
    </div>
  );
}
