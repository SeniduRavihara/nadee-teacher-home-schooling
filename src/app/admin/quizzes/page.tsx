'use client';

import DataTable from '@/components/admin/DataTable';
import { createClient } from '@/utils/supabase/client';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  target_grade: string;
  time_limit_minutes: number;
  passing_score: number;
  created_at: string;
}

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'English',
    targetGrade: 'Grade 1',
    timeLimit: '20',
    passingScore: '60'
  });
  const supabase = createClient();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
    } else {
      setQuizzes(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('quizzes')
      .insert({
        title: formData.title,
        subject: formData.subject,
        target_grade: formData.targetGrade,
        time_limit_minutes: parseInt(formData.timeLimit),
        passing_score: parseInt(formData.passingScore)
      });

    if (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    } else {
      fetchQuizzes();
      setIsModalOpen(false);
      setFormData({
        title: '',
        subject: 'English',
        targetGrade: 'Grade 1',
        timeLimit: '20',
        passingScore: '60'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    } else {
      fetchQuizzes();
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' as const },
    { header: 'Grade', accessor: 'target_grade' as const },
    { header: 'Subject', accessor: 'subject' as const },
    { header: 'Time (mins)', accessor: 'time_limit_minutes' as const },
    { header: 'Pass Score', accessor: 'passing_score' as const },
  ];

  const actions = (item: Quiz) => (
    <div className="flex justify-end gap-2">
      <button 
        onClick={() => router.push(`/admin/quizzes/${item.id}`)}
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
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-500">Manage your quizzes and assessments</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              title: '',
              subject: 'English',
              targetGrade: 'Grade 1',
              timeLimit: '20',
              passingScore: '60'
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Quiz
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading quizzes...</div>
        ) : (
          <DataTable columns={columns} data={quizzes} actions={actions} />
        )}
      </div>

      {/* Create Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create New Quiz</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time (mins)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({...formData, timeLimit: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pass Score</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({...formData, passingScore: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
