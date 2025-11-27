'use client';

import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Clock, Edit, GripVertical, Lock, Plus, Trash2, Unlock } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  position: number;
  is_locked: boolean;
}

interface Course {
  id: string;
  title: string;
  target_grade: string;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const supabase = createClient();

  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    isLocked: true
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchVideos();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, target_grade')
      .eq('id', courseId)
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      // router.push('/admin/videos'); // Redirect if not found
    } else {
      setCourse(data);
    }
  };

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('course_id', courseId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description,
      videoUrl: video.video_url,
      duration: video.duration,
      isLocked: video.is_locked
    });
    setIsAddVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddVideoModalOpen(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      isLocked: true
    });
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const videoData = {
        title: formData.title,
        description: formData.description,
        video_url: formData.videoUrl,
        duration: formData.duration,
        is_locked: formData.isLocked
      };

      let error;

      if (editingId) {
        // Update existing video
        const { error: updateError } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingId);
        error = updateError;
      } else {
        // Create new video
        const nextPosition = videos.length > 0 ? Math.max(...videos.map(v => v.position)) + 1 : 0;
        const { error: insertError } = await supabase
          .from('videos')
          .insert([{
            ...videoData,
            course_id: courseId,
            position: nextPosition
          }]);
        error = insertError;
      }

      if (error) throw error;

      fetchVideos();
      handleCloseModal();

    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVideos(videos.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  const toggleLock = async (video: Video) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_locked: !video.is_locked })
        .eq('id', video.id);

      if (error) throw error;
      
      setVideos(videos.map(v => v.id === video.id ? { ...v, is_locked: !v.is_locked } : v));
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading course details...</div>;
  if (!course) return <div className="p-8 text-center text-gray-500">Course not found</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/videos" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit">
          <ArrowLeft size={20} />
          <span>Back to Courses</span>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                {course.target_grade}
              </span>
            </div>
            <p className="text-gray-500">Manage videos and lessons for this course</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                videoUrl: '',
                duration: '',
                isLocked: true
              });
              setIsAddVideoModalOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Video
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {videos.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {videos.map((video, index) => (
              <div key={video.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors group">
                <div className="text-gray-300 cursor-move">
                  <GripVertical size={20} />
                </div>
                
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{video.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{video.duration}</span>
                    </div>
                    {video.is_locked ? (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Lock size={14} />
                        <span>Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600">
                        <Unlock size={14} />
                        <span>Free Preview</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleLock(video)}
                    className={`p-2 rounded-lg transition-colors ${video.is_locked ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                    title={video.is_locked ? "Unlock Video" : "Lock Video"}
                  >
                    {video.is_locked ? <Lock size={20} /> : <Unlock size={20} />}
                  </button>
                  <button 
                    onClick={() => handleEdit(video)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Video"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteVideo(video.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Video"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No videos added to this course yet.
          </div>
        )}
      </div>

      {/* Add/Edit Video Modal */}
      {isAddVideoModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Video' : 'Add New Video'}</h2>
            <form onSubmit={handleSaveVideo} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Lesson 1: Introduction"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the lesson"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 10:00"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.isLocked}
                      onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                    />
                    <span className="text-gray-700 font-medium">Locked Content</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube/Vimeo)</label>
                <input
                  type="url"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
