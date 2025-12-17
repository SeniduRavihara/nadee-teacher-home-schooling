"use client";

import { useData } from "@/context/DataContext";
import { LayoutDashboard, Menu, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { CloudSVG } from "./decorations/CloudSVG";
import { SunSVG } from "./decorations/SunSVG";

interface StudentHeaderProps {
  onMenuClick?: () => void;
}

export default function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  const { profile, activeStudent } = useData();

  return (
    <header className="bg-gradient-to-r from-blue-100 via-cyan-100 to-purple-100 backdrop-blur-md border-b-4 border-blue-300 h-20 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-64 z-40 transition-all duration-300 shadow-lg overflow-hidden">
      {/* Decorative elements */}
      <CloudSVG
        className="absolute top-2 right-20 w-16 h-8 opacity-40"
        color="#E0E7FF"
      />
      <SunSVG className="absolute top-1 right-4 w-12 h-12 opacity-80" />

      <div className="flex items-center gap-4 flex-1 relative z-10">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-3 text-purple-600 hover:bg-white/60 rounded-2xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <input
            type="text"
            placeholder="Search for fun lessons & quizzes... 🔍"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 focus:ring-4 focus:ring-purple-300 focus:bg-white transition-all font-medium text-gray-700 placeholder:text-purple-400 shadow-md"
          />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400"
            size={20}
          />
          <Sparkles
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400"
            size={18}
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 md:gap-6 relative z-10">
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors bg-white/80 hover:bg-white px-4 py-2.5 rounded-full shadow-md hover:shadow-lg border-2 border-purple-200"
          >
            <LayoutDashboard size={18} />
            <span className="hidden md:inline">Admin View</span>
          </Link>
        )}

        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l-4 border-purple-300">
          <div className="text-right hidden md:block">
            <div className="text-sm font-black text-purple-800">
              {activeStudent?.full_name || profile?.full_name || "Loading..."}
            </div>
            <div className="text-xs text-purple-600 font-bold">
              {activeStudent?.grade || profile?.grade || ""} 🎓
            </div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg overflow-hidden hover:scale-110 transition-transform">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                activeStudent?.full_name || profile?.full_name || "User"
              }`}
              alt="Student Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
