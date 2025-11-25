import { Clock, Play } from 'lucide-react';
import Link from 'next/link';

export default function StudentVideosPage() {
  const courses = [
    {
      id: 1,
      title: 'The Solar System Adventure',
      description: 'Explore the planets, stars, and mysteries of our universe.',
      videos: 8,
      duration: '1h 30m',
      thumbnailColor: 'bg-blue-900',
      progress: 0
    },
    {
      id: 2,
      title: 'Math Magicians: Multiplication',
      description: 'Master multiplication tables with fun tricks and games.',
      videos: 12,
      duration: '2h 15m',
      thumbnailColor: 'bg-purple-600',
      progress: 45
    },
    {
      id: 3,
      title: 'Storytelling 101',
      description: 'Learn how to write your own amazing stories.',
      videos: 6,
      duration: '1h 00m',
      thumbnailColor: 'bg-orange-500',
      progress: 100
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Library</h1>
        <p className="text-gray-500">Watch and learn at your own pace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link href={`/student/videos/${course.id}`} key={course.id} className="block group">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
              {/* Thumbnail */}
              <div className={`h-48 ${course.thumbnailColor} relative flex items-center justify-center`}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <Play size={32} className="text-white ml-1" fill="currentColor" />
                </div>
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                    <div className="h-full bg-green-400" style={{ width: `${course.progress}%` }}></div>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-1">{course.description}</p>
                
                <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                  <div className="flex items-center gap-1">
                    <Play size={14} />
                    <span>{course.videos} Videos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
