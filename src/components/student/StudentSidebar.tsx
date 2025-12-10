"use client";

import { useData } from "@/context/DataContext";
import { createClient } from "@/utils/supabase/client";
import {
  BookOpen,
  LayoutDashboard,
  Star,
  User,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CloudSVG, CloudVariant2 } from "./decorations/CloudSVG";
import { FlowerSVG, FlowerVariant2 } from "./decorations/FlowerSVG";
import { GrassSVG } from "./decorations/GrassSVG";
import { TreeSVG } from "./decorations/TreeSVG";

const menuItems = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "Zoom classes", href: "/student/classes", icon: Users },
  { name: "Quizzes", href: "/student/quizzes", icon: BookOpen },
  { name: "Video Library", href: "/student/videos", icon: Video },
  { name: "Profile", href: "/student/profile", icon: User },
];

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({
  isOpen,
  onClose,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useData();
  const supabase = createClient();
  const [stars, setStars] = useState(0);

  useEffect(() => {
    const fetchStars = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: stats } = await supabase
          .from("student_stats")
          .select("total_stars")
          .eq("user_id", user.id)
          .single();

        if (stats) {
          setStars(stats.total_stars || 0);
        }
      }
    };
    fetchStars();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        w-64 bg-gradient-to-b from-sky-100 via-blue-100 to-cyan-50 text-gray-900 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 border-r-4 border-blue-300 shadow-xl overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Decorative clouds */}
        <CloudSVG
          className="absolute top-10 right-4 w-20 h-10 opacity-70"
          color="#E0F2FE"
        />
        <CloudVariant2
          className="absolute top-24 left-2 w-16 h-8 opacity-60"
          color="#DBEAFE"
        />
        <CloudSVG
          className="absolute top-40 right-8 w-12 h-6 opacity-50"
          color="#F0F9FF"
        />

        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 relative z-10 bg-white/40 backdrop-blur-sm border-b-2 border-purple-200">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <span className="text-xl font-black text-purple-700">
              NadeeTeacher
            </span>
          </Link>
        </div>

        <div className="px-4 mb-6 mt-4 relative z-10">
          {/* Stars Card with playful design */}
          <div className="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 rounded-3xl p-5 text-white shadow-xl shadow-orange-200 border-4 border-yellow-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/20 rounded-full -ml-6 -mb-6"></div>
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <Star
                fill="currentColor"
                className="text-white animate-pulse"
                size={24}
              />
              <span className="text-3xl font-black">
                {stars.toLocaleString()}
              </span>
            </div>
            <div className="text-sm font-bold text-white/95 relative z-10">
              Total Stars Earned! ⭐
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-3 overflow-y-auto relative z-10">
          {menuItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/student" && pathname.startsWith(item.href));
            const colors = [
              {
                bg: "bg-gradient-to-r from-purple-400 to-pink-400",
                text: "text-purple-700",
                activeBg: "bg-purple-100",
              },
              {
                bg: "bg-gradient-to-r from-blue-400 to-cyan-400",
                text: "text-blue-700",
                activeBg: "bg-blue-100",
              },
              {
                bg: "bg-gradient-to-r from-green-400 to-emerald-400",
                text: "text-green-700",
                activeBg: "bg-green-100",
              },
              {
                bg: "bg-gradient-to-r from-orange-400 to-red-400",
                text: "text-orange-700",
                activeBg: "bg-orange-100",
              },
              {
                bg: "bg-gradient-to-r from-pink-400 to-rose-400",
                text: "text-pink-700",
                activeBg: "bg-pink-100",
              },
            ];
            const color = colors[index % colors.length];

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold text-base shadow-md border-2 ${
                  isActive
                    ? `${color.activeBg} ${color.text} border-white scale-105 shadow-lg`
                    : `bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-105 hover:shadow-lg border-white/50`
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? color.bg : "bg-gray-100"
                  } ${isActive ? "text-white" : "text-gray-600"}`}
                >
                  <item.icon size={20} strokeWidth={2.5} />
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Decorative grass at bottom */}
        <div className="absolute bottom-20 left-0 right-0 z-0">
          <GrassSVG className="w-full h-16" />
        </div>

        {/* Flowers */}
        <FlowerSVG className="absolute bottom-20 left-4 w-12 h-16 z-10" />
        <FlowerVariant2 className="absolute bottom-24 right-6 w-10 h-14 z-10" />

        {/* Small tree */}
        <TreeSVG className="absolute bottom-16 right-16 w-10 h-16 z-10" />

        {/* Logout */}
        <div className="p-4 border-t-2 border-purple-200 bg-white/60 backdrop-blur-sm relative z-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 w-full rounded-2xl hover:bg-white/80 transition-all font-bold shadow-sm hover:shadow-md border-2 border-transparent hover:border-gray-200"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-black shadow-md">
              {profile?.full_name?.charAt(0) || "N"}
            </div>
            <span>Logout 👋</span>
          </button>
        </div>
      </aside>
    </>
  );
}
