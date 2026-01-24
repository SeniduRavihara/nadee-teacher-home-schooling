'use client';

import { createClient } from '@/utils/supabase/client';
import { BookOpen, Edit, Film, Lock, MonitorPlay, Plus, Search, Trash2, Unlock, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  target_grade: string | string[];
  thumbnail_url: string;
  category: 'recording' | 'movie' | 'yt_video';
  is_single_video: boolean;
  created_at: string;
  videos?: { is_locked: boolean }[];
  hasLocked?: boolean; // derived client-side
}

export default function AdminCoursesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetGrade: ['Preschool'],
    thumbnailUrl: '',
    category: 'yt_video' as Course['category'],
    isSingleVideo: false,
    videoUrl: '',
    duration: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, videos(is_locked)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const coursesWithLockFlag = (data || []).map((c) => ({
        ...c,
        hasLocked: (c as any)?.videos?.some((v: any) => v.is_locked) || false,
      }));

      setCourses(coursesWithLockFlag as Course[]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      description: course.description,
      targetGrade: Array.isArray(course.target_grade) ? course.target_grade : [course.target_grade],
      thumbnailUrl: course.thumbnail_url || '',
      category: course.category || 'yt_video',
      isSingleVideo: course.is_single_video || false,
      videoUrl: '', // We don't fetch video details here for edit, user manages videos separately
      duration: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      targetGrade: ['Preschool'],
      thumbnailUrl: '',
      category: 'yt_video',
      isSingleVideo: false,
      videoUrl: '',
      duration: ''
    });
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        target_grade: formData.targetGrade,
        thumbnail_url: formData.thumbnailUrl,
        category: formData.category,
        is_single_video: formData.isSingleVideo
      };

      let error;

      if (editingId) {
        // Update existing course
        const { error: updateError } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingId);
        error = updateError;
      } else {
        // Create new course
        const { data: newCourse, error: insertError } = await supabase
          .from('courses')
          .insert([courseData])
          .select()
          .single();
        
        error = insertError;

        // If Single Video mode is enabled, create the video immediately
        if (!error && newCourse && formData.isSingleVideo) {
          const { error: videoError } = await supabase
            .from('videos')
            .insert([{
              title: formData.title, // Use course title for the video
              description: formData.description,
              video_url: formData.videoUrl,
              duration: formData.duration,
              is_locked: true, // Default to locked
              course_id: newCourse.id,
              position: 0
            }]);
          
          if (videoError) {
            console.error('Error creating video:', videoError);
            alert('Course created, but failed to create the video inside it.');
          }
        }
      }

      if (error) throw error;

      fetchCourses();
      handleCloseModal();
      
    } catch (error: any) {
      console.error('Error saving course:', error);
      alert(`Failed to save course: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all videos within it.')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const toggleCourseLock = async (course: Course, lock: boolean) => {
    try {
      if (!course.videos || course.videos.length === 0) {
        alert('Add at least one video to this course before toggling lock.');
        return;
      }

      const { error } = await supabase
        .from('videos')
        .update({ is_locked: lock })
        .eq('course_id', course.id);

      if (error) throw error;

      setCourses(prev => prev.map(c => c.id === course.id ? { 
        ...c, 
        hasLocked: lock,
        videos: c.videos?.map(v => ({ ...v, is_locked: lock }))
      } : c));
    } catch (error) {
      console.error('Error toggling course lock:', error);
      alert('Failed to toggle lock for this course.');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Array.isArray(course.target_grade) 
      ? (course.target_grade as string[]).some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      : (course.target_grade as string).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movie': return <Film size={16} />;
      case 'recording': return <Video size={16} />;
      default: return <MonitorPlay size={16} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'movie': return 'Movie';
      case 'recording': return 'Recording';
      default: return 'YT Video';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Courses</h1>
          <p className="text-gray-500 mt-2">Manage your video classes and lessons</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              description: '',
              targetGrade: ['Preschool'],
              thumbnailUrl: '',
              category: 'yt_video',
              isSingleVideo: false,
              videoUrl: '',
              duration: ''
            });
            setIsCreateModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Course
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading courses...</div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                    {Array.isArray(course.target_grade) 
                      ? course.target_grade.join(', ') 
                      : course.target_grade}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 flex items-center gap-1">
                    {getCategoryIcon(course.category || 'yt_video')}
                    {getCategoryLabel(course.category || 'yt_video')}
                  </span>
                  {course.is_single_video && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-600">
                      Single
                    </span>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => toggleCourseLock(course, !course.hasLocked)}
                    className={`p-2 rounded-lg transition-colors border ${course.hasLocked ? 'text-orange-600 bg-orange-50 border-orange-100 hover:bg-orange-100' : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100'}`}
                    title={course.hasLocked ? 'Unlock course (make free)' : 'Lock course (requires payment)'}
                  >
                    {course.hasLocked ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <button 
                    onClick={() => handleEdit(course)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{course.is_single_video ? 'Single Video' : 'Course'}</span>
                </div>
                {/* We could fetch video count here if needed, or join in the query */}
              </div>

              <Link 
                href={`/admin/videos/${course.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <Video size={20} />
                Manage Videos
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No courses found. Create one to get started!
          </div>
        )}
      </div>

      {/* Create/Edit Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Course' : 'Create New Course'}</h2>
            <form onSubmit={handleSaveCourse} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., English Grammar Basics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will students learn?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Grade(s)</label>
                    <div className="flex flex-wrap gap-2">
                       {['Preschool', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].map((grade) => (
                          <label key={grade} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              checked={formData.targetGrade.includes(grade)}
                              onChange={(e) => {
                                const newGrades = e.target.checked
                                  ? [...formData.targetGrade, grade]
                                  : formData.targetGrade.filter((g) => g !== grade);
                                setFormData({ ...formData, targetGrade: newGrades });
                              }}
                            />
                            <span className="text-sm text-gray-700 font-medium select-none">{grade}</span>
                          </label>
                       ))}
                    </div>
                    {formData.targetGrade.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">Please select at least one grade.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    <option value="yt_video">YT Video</option>
                    <option value="recording">Recording</option>
                    <option value="movie">Movie</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL (Optional)</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Single Video Mode Checkbox - Only show when creating new course */}
              {!editingId && (
                <div className="bg-blue-50 p-4 rounded-xl space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.isSingleVideo}
                      onChange={(e) => setFormData({ ...formData, isSingleVideo: e.target.checked })}
                    />
                    <div>
                      <span className="block font-bold text-gray-900">Single Video Mode</span>
                      <span className="block text-xs text-gray-500">Create a course with one video directly</span>
                    </div>
                  </label>

                  {formData.isSingleVideo && (
                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                        <input
                          type="url"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
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
                    </div>
                  )}
                </div>
              )}

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
                  {editingId ? 'Update Course' : (formData.isSingleVideo ? 'Create Course & Video' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
