import { MoreVertical, Play, Upload } from 'lucide-react';

export default function VideosPage() {
  const videos = [
    { id: 1, title: 'Introduction to Algebra', duration: '15:30', views: 1200, date: '2023-11-15' },
    { id: 2, title: 'Photosynthesis Explained', duration: '10:45', views: 850, date: '2023-11-18' },
    { id: 3, title: 'World War II Overview', duration: '25:00', views: 2100, date: '2023-11-10' },
    { id: 4, title: 'Basic Geometry Shapes', duration: '08:20', views: 3000, date: '2023-11-05' },
    { id: 5, title: 'The Solar System', duration: '12:15', views: 1500, date: '2023-11-20' },
    { id: 6, title: 'Grammar: Nouns & Verbs', duration: '18:00', views: 900, date: '2023-11-22' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Classes</h1>
          <p className="text-gray-500">Manage your recorded video lessons</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Upload size={20} />
          Upload Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            {/* Video Thumbnail Placeholder */}
            <div className="relative h-48 bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-blue-600 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </span>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 line-clamp-2">{video.title}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{video.views} views</span>
                <span>{video.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
