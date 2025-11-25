import { CheckCircle, Lock, Play } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  duration: string;
  isLocked: boolean;
  isCompleted: boolean;
  isPlaying: boolean;
}

interface PlaylistProps {
  videos: Video[];
  onVideoSelect: (id: number) => void;
}

export default function Playlist({ videos, onVideoSelect }: PlaylistProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-gray-900">Course Content</h3>
        <p className="text-xs text-gray-500">{videos.length} Lessons • {videos.filter(v => v.isCompleted).length} Completed</p>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => !video.isLocked && onVideoSelect(video.id)}
            className={`w-full p-4 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors text-left ${
              video.isPlaying ? 'bg-blue-50' : 'hover:bg-gray-50'
            } ${video.isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex-shrink-0">
              {video.isLocked ? (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <Lock size={14} />
                </div>
              ) : video.isCompleted ? (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle size={14} />
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  video.isPlaying ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium truncate ${video.isPlaying ? 'text-blue-700' : 'text-gray-900'}`}>
                {video.title}
              </h4>
              <span className="text-xs text-gray-500">{video.duration}</span>
            </div>

            {video.isPlaying && (
               <Play size={16} className="text-blue-600 fill-current" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
