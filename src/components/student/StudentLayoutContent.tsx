"use client";

import StudentHeader from "@/components/student/StudentHeader";
import StudentSidebar from "@/components/student/StudentSidebar";
import { useState } from "react";
import { BalloonSVG } from "./decorations/BalloonSVG";
import { ButterflySVG } from "./decorations/ButterflyBirdSVG";
import { CloudSVG, CloudVariant2 } from "./decorations/CloudSVG";

export default function StudentLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <CloudSVG
          className="absolute top-20 right-10 w-32 h-16 opacity-30"
          color="#E0E7FF"
        />
        <CloudVariant2
          className="absolute top-40 left-1/4 w-24 h-12 opacity-25"
          color="#FCE7F3"
        />
        <CloudSVG
          className="absolute top-60 right-1/3 w-28 h-14 opacity-20"
          color="#DBEAFE"
        />
        <BalloonSVG
          className="absolute top-32 right-1/4 w-16 h-24 opacity-40"
          color="#FF6B6B"
        />
        <BalloonSVG
          className="absolute top-80 left-20 w-12 h-18 opacity-35"
          color="#4D9EFF"
        />
        <BalloonSVG
          className="absolute bottom-40 right-20 w-14 h-21 opacity-30"
          color="#B197FC"
        />
        <ButterflySVG className="absolute top-1/3 right-10 w-20 h-16 opacity-40 animate-bounce" />

        {/* Floating decorative circles */}
        <div className="absolute top-1/4 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 right-16 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-pink-200 rounded-full opacity-20 blur-xl"></div>
      </div>

      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} />

      <main className="pl-0 md:pl-64 pt-20 min-h-screen transition-all duration-300 relative z-10">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
