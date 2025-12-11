"use client";

import StudentHeader from "@/components/student/StudentHeader";
import StudentSidebar from "@/components/student/StudentSidebar";
import { useState } from "react";
import { BalloonSVG } from "./decorations/BalloonSVG";
import { BirdSVG, ButterflySVG } from "./decorations/ButterflyBirdSVG";
import { BookSVG } from "./decorations/BookSVG";
import { CloudSVG, CloudVariant2 } from "./decorations/CloudSVG";
import { PencilSVG } from "./decorations/PencilSVG";
import { StarsSVG } from "./decorations/StarsSVG";

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
        <BalloonSVG
          className="absolute bottom-24 left-12 w-12 h-18 opacity-30"
          color="#6ED9A0"
        />
        <BalloonSVG
          className="absolute top-1/2 right-1/5 w-10 h-16 opacity-25"
          color="#FFB347"
        />
        {/* Butterflies along the bottom in different colors and positions */}
        <ButterflySVG
          className="absolute bottom-16 left-10 w-16 h-14 opacity-45"
          wingPrimary="#FF6B6B"
          wingSecondary="#FFD93D"
          bodyColor="#4D4D4D"
        />
        <ButterflySVG
          className="absolute bottom-24 left-1/2 w-18 h-16 opacity-40"
          wingPrimary="#6ED9A0"
          wingSecondary="#B197FC"
          bodyColor="#2F4858"
        />
        <ButterflySVG
          className="absolute bottom-12 right-12 w-18 h-16 opacity-42"
          wingPrimary="#4D9EFF"
          wingSecondary="#FFA94D"
          bodyColor="#374151"
        />
        <BirdSVG className="absolute bottom-16 left-1/4 w-16 h-12 opacity-35 animate-pulse" />
        <StarsSVG className="absolute top-10 left-8 w-24 h-24 opacity-25" />
        <StarsSVG className="absolute bottom-12 right-8 w-20 h-20 opacity-20" />
        <PencilSVG className="absolute top-24 left-12 w-20 h-20 opacity-30" />
        <BookSVG className="absolute bottom-32 right-1/3 w-24 h-20 opacity-30" />

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
