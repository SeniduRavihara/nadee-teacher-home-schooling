'use client';

import StudentHeader from '@/components/student/StudentHeader';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useState } from 'react';

export default function StudentLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <StudentSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <StudentHeader 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />
      
      <main className="pl-0 md:pl-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
