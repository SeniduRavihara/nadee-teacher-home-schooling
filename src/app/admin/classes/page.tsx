'use client';

import DataTable from '@/components/admin/DataTable';
import { createClient } from '@/utils/supabase/client';
import { Edit, Plus, Trash2, Video, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OnlineClass {
  id: string;
  title: string;
  instructor_name: string;
  start_time: string;
  duration_minutes: number;
  zoom_link: string;
  target_grade: string;
  status: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    date: '',
    time: '',
    duration: '60',
    targetGrade: 'Grade 1',
    zoomLink: ''
  });
  const supabase = createClient();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('online_classes')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (classItem: OnlineClass) => {
    setEditingId(classItem.id);
    
    // Parse ISO string to date and time
    const dateObj = new Date(classItem.start_time);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toTimeString().slice(0, 5); // HH:MM

    setFormData({
      title: classItem.title,
      instructor: classItem.instructor_name,
      date: date,
      time: time,
      duration: classItem.duration_minutes.toString(),
      targetGrade: classItem.target_grade,
      zoomLink: classItem.zoom_link
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      title: '',
      instructor: '',
      date: '',
      time: '',
      duration: '60',
      targetGrade: 'Grade 1',
      zoomLink: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time into ISO string
    const startTime = new Date(`${formData.date}T${formData.time}`).toISOString();

    const classData = {
      title: formData.title,
      instructor_name: formData.instructor,
      start_time: startTime,
      duration_minutes: parseInt(formData.duration),
      zoom_link: formData.zoomLink,
      target_grade: formData.targetGrade,
      status: 'scheduled'
    };

    let error;

    if (editingId) {
      // Update existing class
      const { error: updateError } = await supabase
        .from('online_classes')
        .update(classData)
        .eq('id', editingId);
      error = updateError;
    } else {
      // Create new class
      const { error: insertError } = await supabase
        .from('online_classes')
        .insert(classData);
      error = insertError;
    }

    if (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class');
    } else {
      fetchClasses();
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    const { error } = await supabase
      .from('online_classes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class');
    } else {
      fetchClasses();
    }
  };

  const columns = [
    { header: 'Class Title', accessor: 'title' as const },
    { header: 'Instructor', accessor: 'instructor_name' as const },
    { header: 'Target Grade', accessor: 'target_grade' as const },
    { 
      header: 'Date', 
      accessor: (item: OnlineClass) => new Date(item.start_time).toLocaleDateString() 
    },
    { 
      header: 'Time', 
      accessor: (item: OnlineClass) => new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    },
    { header: 'Duration (min)', accessor: 'duration_minutes' as const },
  ];

  const actions = (item: OnlineClass) => (
    <div className="flex justify-end gap-2">
      <a 
        href={item.zoom_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-block" 
        title="Join Class"
      >
        <Video size={16} />
      </a>
      <button 
        onClick={() => handleEdit(item)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => handleDelete(item.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Online Classes</h1>
          <p className="text-gray-500">Schedule and manage live sessions</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              instructor: '',
              date: '',
              time: '',
              duration: '60',
              targetGrade: 'Grade 1',
              zoomLink: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Schedule Class
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading classes...</div>
        ) : (
          <DataTable columns={columns} data={classes} actions={actions} />
        )}
      </div>

      {/* Create/Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Class' : 'Schedule New Class'}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Grade</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.targetGrade}
                  onChange={(e) => setFormData({...formData, targetGrade: e.target.value})}
                >
                  <option value="Preschool">Preschool</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Link</label>
                <input 
                  type="url" 
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.zoomLink}
                  onChange={(e) => setFormData({...formData, zoomLink: e.target.value})}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingId ? 'Update Class' : 'Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
