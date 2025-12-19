"use client";

import { useData } from "@/context/DataContext";
import { Check, ChevronDown, LayoutDashboard, Menu, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloudSVG } from "./decorations/CloudSVG";
import { SunSVG } from "./decorations/SunSVG";

interface StudentHeaderProps {
  onMenuClick?: () => void;
}

export default function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  const { profile, activeStudent, students, switchStudent } = useData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSwitchStudent = (studentId: string) => {
    switchStudent(studentId);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-100 via-cyan-100 to-purple-100 backdrop-blur-md border-b-4 border-blue-300 h-20 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-64 z-40 transition-all duration-300 shadow-lg overflow-visible">
      {/* Decorative elements */}
      <CloudSVG
        className="absolute top-2 right-20 w-16 h-8 opacity-40 pointer-events-none"
        color="#E0E7FF"
      />
      <SunSVG className="absolute top-1 right-4 w-12 h-12 opacity-80 pointer-events-none" />

      <div className="flex items-center gap-4 flex-1 relative z-10">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-3 text-purple-600 hover:bg-white/60 rounded-2xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar Removed as per request */}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 md:gap-6 relative z-20">
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors bg-white/80 hover:bg-white px-4 py-2.5 rounded-full shadow-md hover:shadow-lg border-2 border-purple-200"
          >
            <LayoutDashboard size={18} />
            <span className="hidden md:inline">Admin View</span>
          </Link>
        )}

        {/* Student Switcher / Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-4 md:pl-6 border-l-4 border-purple-300 hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden md:block">
              <div className="text-sm font-black text-purple-800 flex items-center justify-end gap-1">
                {activeStudent?.full_name || profile?.full_name || "Loading..."}
                <ChevronDown size={14} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border-2 border-purple-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-5">
              <div className="px-4 py-2 border-b border-purple-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Switch Child</p>
              </div>
              
              {students && students.length > 0 ? (
                students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleSwitchStudent(student.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors ${
                      activeStudent?.id === student.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden border border-indigo-200">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`}
                        alt={student.full_name}
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${activeStudent?.id === student.id ? 'text-purple-700' : 'text-gray-700'}`}>
                        {student.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{student.grade}</p>
                    </div>
                    {activeStudent?.id === student.id && (
                      <Check size={16} className="text-purple-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No other students found
                </div>
              )}
              
              <div className="border-t border-purple-50 mt-1 pt-1">
                <Link 
                   href="/student/profile" 
                   className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors text-purple-600 text-sm font-bold"
                   onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                     <User size={16} />
                  </div>
                  Manage Profiles
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
