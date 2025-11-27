'use client';

import Playlist from '@/components/student/Playlist';
import VideoPlayer from '@/components/student/VideoPlayer';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CoursePlayerPage({ params }: { params: { courseId: string } }) {
  // Mock data - in a real app, fetch based on courseId
  const [activeVideoId, setActiveVideoId] = useState('1');
  
  const videos = [
    { id: '1', title: 'Introduction to the Solar System', duration: '12:45', isLocked: false, isCompleted: true, isPlaying: activeVideoId === '1' },
    { id: '2', title: 'The Sun: Our Star', duration: '15:20', isLocked: false, isCompleted: false, isPlaying: activeVideoId === '2' },
    { id: '3', title: 'Mercury & Venus', duration: '10:15', isLocked: true, isCompleted: false, isPlaying: activeVideoId === '3' },
    { id: '4', title: 'Earth & Mars', duration: '18:30', isLocked: true, isCompleted: false, isPlaying: activeVideoId === '4' },
    { id: '5', title: 'Jupiter & Saturn', duration: '20:00', isLocked: true, isCompleted: false, isPlaying: activeVideoId === '5' },
    { id: '6', title: 'Uranus & Neptune', duration: '14:10', isLocked: true, isCompleted: false, isPlaying: activeVideoId === '6' },
  ];

  const activeVideo = videos.find(v => v.id === activeVideoId) || videos[0];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-4">
        <Link href="/student/videos" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">The Solar System Adventure</h1>
          <p className="text-gray-500 text-sm">Science • Grade 3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Video Player Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <VideoPlayer title={activeVideo.title} />
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{activeVideo.title}</h2>
            <p className="text-gray-600">
              In this lesson, we will explore the fascinating features of our solar system's center. 
              Learn about solar flares, sunspots, and why the sun is so important for life on Earth.
            </p>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="h-full min-h-[400px]">
          <Playlist videos={videos} onVideoSelect={setActiveVideoId} />
        </div>
      </div>
    </div>
  );
}
