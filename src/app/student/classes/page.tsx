"use client";

import PaymentModal from "@/components/student/PaymentModal";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { createClient } from "@/utils/supabase/client";
import { Calendar, Clock, Lock, Sparkles, Tv, User, Video } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClassesPage() {
  const [userGrade, setUserGrade] = useState<string>("Grade 1");
  const [loading, setLoading] = useState(true);
  const {
    isPaid,
    loading: paymentLoading,
    checkPaymentStatus,
  } = usePaymentStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("grade")
        .eq("id", user.id)
        .single();
      if (profile?.grade) {
        setUserGrade(profile.grade);
        fetchClasses(profile.grade);
        checkPaymentStatus(profile.grade);
      } else {
        setLoading(false);
        checkPaymentStatus();
      }
    } else {
      setLoading(false);
      checkPaymentStatus();
    }
  };

  const fetchClasses = async (grade: string) => {
    try {
      const { data, error } = await supabase
        .from("online_classes")
        .select("*")
        .eq("target_grade", grade)
        .order("start_time", { ascending: true });

      if (error) throw error;

      const formattedClasses = (data || []).map((cls) => {
        const startTime = new Date(cls.start_time);
        const durationMs = (cls.duration_minutes || 60) * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);
        const now = new Date();

        let status = "Upcoming";
        if (now >= startTime && now < endTime) {
          status = "Live";
        } else if (now >= endTime) {
          status = "Completed";
        }

        const dateStr = startTime.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const timeStr = startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Helper for colors based on title (since subject column is missing)
        const getSubjectColors = (title: string) => {
          const s = (title || "").toLowerCase();
          if (s.includes("math"))
            return {
              color: "bg-blue-500",
              light: "bg-blue-50",
              text: "text-blue-600",
            };
          if (s.includes("science"))
            return {
              color: "bg-green-500",
              light: "bg-green-50",
              text: "text-green-600",
            };
          if (s.includes("english"))
            return {
              color: "bg-purple-500",
              light: "bg-purple-50",
              text: "text-purple-600",
            };
          return {
            color: "bg-orange-500",
            light: "bg-orange-50",
            text: "text-orange-600",
          };
        };

        const colors = getSubjectColors(cls.title);

        return {
          id: cls.id,
          title: cls.title,
          instructor: cls.instructor_name,
          date:
            startTime.toDateString() === now.toDateString() ? "Today" : dateStr,
          time: timeStr,
          duration: `${cls.duration_minutes} mins`,
          status,
          color: colors.color,
          lightColor: colors.light,
          textColor: colors.text,
          targetGrade: cls.target_grade,
          zoomLink: cls.zoom_link,
        };
      });

      setClasses(formattedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const [classes, setClasses] = useState<any[]>([]);

  const handleClassAction = (cls: any) => {
    if (cls.status === "Upcoming") {
      alert("Reminder set! (This is a demo feature)");
    } else if (cls.status === "Completed") {
      alert("Recording not available yet.");
    }
  };

  if (loading || paymentLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
            <Sparkles className="text-white" size={32} />
          </div>
          <p className="text-blue-600 font-bold text-lg">
            Loading your classes... 📚
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border-4 border-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Tv className="animate-pulse" size={36} />
              <h1 className="text-4xl font-black">Live Classes! 📹</h1>
            </div>
            <p className="text-white/95 text-lg font-bold">
              Join fun live sessions with your friends! 🎉
            </p>
            <p className="text-white/90 text-sm font-medium mt-1">
              {userGrade} • {classes.length} Classes
            </p>
          </div>
          <Video className="text-yellow-300 animate-bounce" size={64} />
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-yellow-300/20 rounded-full -mb-8"></div>
        <Sparkles
          className="absolute top-8 right-1/3 text-yellow-300 animate-pulse"
          size={24}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length > 0 ? (
          classes.map((cls, index) => {
            const cardColors = [
              { gradient: "from-blue-400 to-cyan-300", icon: "bg-blue-500" },
              {
                gradient: "from-purple-400 to-pink-300",
                icon: "bg-purple-500",
              },
              {
                gradient: "from-green-400 to-emerald-300",
                icon: "bg-green-500",
              },
              {
                gradient: "from-orange-400 to-yellow-300",
                icon: "bg-orange-500",
              },
              { gradient: "from-red-400 to-pink-300", icon: "bg-red-500" },
            ];
            const colorTheme = cardColors[index % cardColors.length];

            return (
              <div
                key={cls.id}
                className="relative bg-white rounded-3xl p-6 shadow-lg border-4 border-purple-200 hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden group"
              >
                {/* Locking Overlay */}
                {!isPaid && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 shadow-md border-4 border-white">
                      <Lock className="text-gray-500" size={28} />
                    </div>
                    <h3 className="font-black text-gray-900 mb-1 text-lg">
                      Locked! 🔒
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 font-bold">
                      Payment needed to join
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-black rounded-full hover:scale-105 transition-all shadow-lg border-2 border-white"
                    >
                      Unlock Now! 🔓
                    </button>
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-black ${
                      cls.lightColor
                    } ${cls.textColor} border-2 ${cls.textColor.replace(
                      "text-",
                      "border-"
                    )} shadow-sm`}
                  >
                    {cls.status === "Live" && "🔴 "}
                    {cls.status === "Upcoming" && "⏰ "}
                    {cls.status === "Completed" && "✓ "}
                    {cls.status}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorTheme.gradient} flex items-center justify-center shadow-md border-2 border-white`}
                  >
                    <Video size={24} className="text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2">
                  {cls.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full border-2 border-purple-200">
                    <User size={18} className="text-purple-600" />
                    <span className="text-sm font-bold text-purple-700">
                      {cls.instructor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border-2 border-blue-200">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="text-sm font-bold text-blue-700">
                      {cls.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-full border-2 border-orange-200">
                    <Clock size={18} className="text-orange-600" />
                    <span className="text-sm font-bold text-orange-700">
                      {cls.time} ({cls.duration})
                    </span>
                  </div>
                </div>

                {cls.status === "Live" || cls.status === "Upcoming" ? (
                  <a
                    href={cls.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-4 rounded-2xl font-black text-white text-center transition-all bg-gradient-to-r ${colorTheme.gradient} hover:scale-105 shadow-md border-2 border-white text-lg`}
                  >
                    {cls.status === "Live"
                      ? "🔴 Join Live Now!"
                      : "🚀 Join Class!"}
                  </a>
                ) : (
                  <button
                    onClick={() => handleClassAction(cls)}
                    className={`w-full py-4 rounded-2xl font-black text-white transition-all bg-gradient-to-r ${
                      colorTheme.gradient
                    } ${
                      cls.status === "Completed"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    } shadow-md border-2 border-white text-lg`}
                  >
                    {cls.status === "Completed"
                      ? "📼 Watch Recording"
                      : "🔔 Set Reminder"}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-gradient-to-br from-blue-100 to-cyan-100 p-12 rounded-3xl text-center border-4 border-blue-200">
            <div className="text-7xl mb-4">📹</div>
            <h3 className="text-2xl font-black text-blue-700 mb-2">
              No Classes Yet!
            </h3>
            <p className="text-blue-600 font-bold">
              Classes for {userGrade} are coming soon! Stay tuned! 🎉
            </p>
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
        defaultGrade={userGrade}
      />
    </div>
  );
}
