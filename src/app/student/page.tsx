"use client";

import { useData } from "@/context/DataContext";
import { createClient } from "@/utils/supabase/client";
import { Book, Calendar, Clock, Play, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const { activeStudent } = useData();
  const userName = activeStudent?.full_name?.split(' ')[0] || 'Student';
  const supabase = createClient();

  useEffect(() => {
    if (activeStudent) {
        fetchDashboardData();
    }
  }, [activeStudent]);

  const fetchDashboardData = async () => {
    try {
      if (!activeStudent) return;

      // Fetch Upcoming Classes for Active Student's Grade
      const { data: classes } = await supabase
        .from("online_classes")
        .select("*")
        .eq("target_grade", activeStudent.grade)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(2);

      setUpcomingClasses(classes || []);

      // Fetch Recent Courses for Active Student's Grade
      const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .eq("target_grade", activeStudent.grade)
        .limit(2);

      setRecentCourses(courses || []);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
            <Sparkles className="text-white" size={32} />
          </div>
          <p className="text-purple-600 font-bold text-lg">
            Loading your awesome dashboard... ✨
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section with colorful gradient */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl border-4 border-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="animate-bounce" size={36} />
            <h1 className="text-3xl md:text-4xl font-black">
              Welcome back, {userName}! 🎉
            </h1>
          </div>
          <p className="text-white/95 mb-6 max-w-lg text-lg font-medium">
            Ready for another awesome day of learning? Let's have fun and earn
            those stars! ⭐
          </p>
          <Link
            href="/student/videos"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-black hover:bg-yellow-300 hover:text-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
          >
            <Play size={20} fill="currentColor" />
            Start Learning! 🚀
          </Link>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-yellow-300/20 rounded-full -mb-10"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
        <Sparkles
          className="absolute top-8 right-32 text-yellow-300 animate-pulse"
          size={28}
        />
        <Sparkles
          className="absolute bottom-12 right-48 text-white animate-pulse"
          size={24}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recommended Courses Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Book className="text-purple-600" size={28} />
              <h2 className="text-2xl font-black text-gray-900">
                Fun Courses for You! 📚
              </h2>
            </div>
            <Link
              href="/student/videos"
              className="text-purple-600 font-black text-sm hover:text-purple-800 bg-purple-100 px-4 py-2 rounded-full hover:bg-purple-200 transition-all border-2 border-purple-300"
            >
              View All →
            </Link>
          </div>

          {recentCourses.length > 0 ? (
            recentCourses.map((course, index) => {
              const cardColors = [
                {
                  bg: "bg-gradient-to-br from-blue-400 to-cyan-300",
                  icon: "text-blue-600",
                  border: "border-blue-300",
                },
                {
                  bg: "bg-gradient-to-br from-purple-400 to-pink-300",
                  icon: "text-purple-600",
                  border: "border-purple-300",
                },
                {
                  bg: "bg-gradient-to-br from-green-400 to-emerald-300",
                  icon: "text-green-600",
                  border: "border-green-300",
                },
                {
                  bg: "bg-gradient-to-br from-orange-400 to-yellow-300",
                  icon: "text-orange-600",
                  border: "border-orange-300",
                },
              ];
              const color = cardColors[index % cardColors.length];

              return (
                <Link href={`/student/videos/${course.id}`} key={course.id}>
                  <div
                    className={`bg-white p-5 rounded-3xl shadow-lg border-4 ${color.border} flex gap-4 items-center hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group`}
                  >
                    <div
                      className={`w-24 h-24 ${color.bg} rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md`}
                    >
                      <Play
                        size={32}
                        className="text-white group-hover:scale-125 transition-transform"
                        fill="currentColor"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-gray-900 text-lg">
                          {course.title}
                        </h3>
                        <span
                          className={`text-xs font-black ${color.icon} bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-1.5 rounded-full border-2 border-yellow-300`}
                        >
                          {course.subject || "Fun!"} ✨
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 font-medium">
                        {course.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-3xl text-center border-4 border-purple-200">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-purple-700 font-bold text-lg">
                No courses yet, but exciting ones are coming soon! 🎉
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Classes Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="text-orange-500" size={28} />
              <h2 className="text-2xl font-black text-gray-900">Classes 📅</h2>
            </div>
            <Link
              href="/student/classes"
              className="text-orange-600 font-black text-sm hover:text-orange-800 bg-orange-100 px-3 py-2 rounded-full hover:bg-orange-200 transition-all border-2 border-orange-300"
            >
              All →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-orange-200 space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls, index) => {
                const date = new Date(cls.start_time);
                const bgColors = [
                  "bg-gradient-to-br from-orange-400 to-red-400",
                  "bg-gradient-to-br from-pink-400 to-rose-400",
                ];
                return (
                  <div
                    key={cls.id}
                    className="flex gap-4 items-start pb-4 border-b-2 border-orange-100 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-16 h-16 ${
                        bgColors[index % bgColors.length]
                      } rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0 shadow-md border-2 border-white`}
                    >
                      <span className="text-xs font-black">
                        {date
                          .toLocaleDateString("en-US", { month: "short" })
                          .toUpperCase()}
                      </span>
                      <span className="text-2xl font-black leading-none">
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-gray-900 text-base mb-1">
                        {cls.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 font-bold">
                        <Clock size={14} />
                        <span>
                          {date.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>•</span>
                        <span>{cls.instructor_name}</span>
                      </div>
                      <Link
                        href="/student/classes"
                        className="text-xs font-black text-orange-600 bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 px-4 py-2 rounded-full hover:from-orange-200 hover:to-yellow-200 transition-all inline-block shadow-sm"
                      >
                        Join Now! 🎓
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">📅</div>
                <p className="text-gray-600 font-bold">
                  No classes scheduled yet! Check back soon! 😊
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
