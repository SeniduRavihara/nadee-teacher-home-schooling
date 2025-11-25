import { Maximize, Pause, Volume2 } from 'lucide-react';

export default function VideoPlayer({ title }: { title: string }) {
  return (
    <div className="bg-black rounded-2xl overflow-hidden aspect-video relative group">
      {/* Placeholder for actual video element */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <span className="text-white/50 font-medium">Video Player: {title}</span>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-full bg-white/20 h-1 rounded-full mb-4 cursor-pointer">
          <div className="bg-blue-500 h-full w-1/3 rounded-full relative">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <button className="hover:text-blue-400 transition-colors"><Pause size={24} fill="currentColor" /></button>
            <button className="hover:text-blue-400 transition-colors"><Volume2 size={24} /></button>
            <span className="text-sm font-medium">04:20 / 12:45</span>
          </div>
          <button className="hover:text-blue-400 transition-colors"><Maximize size={24} /></button>
        </div>
      </div>
    </div>
  );
}
