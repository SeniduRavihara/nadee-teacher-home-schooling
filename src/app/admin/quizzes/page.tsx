import DataTable from '@/components/admin/DataTable';
import { Edit, Plus, Trash2 } from 'lucide-react';

export default function QuizzesPage() {
  const quizzes = [
    { id: 1, title: 'Math Adventure: Grade 3', grade: 'Grade 3', subject: 'Math', questions: 15, status: 'Active' },
    { id: 2, title: 'Reading Comprehension', grade: 'Grade 4', subject: 'English', questions: 10, status: 'Draft' },
    { id: 3, title: 'Science Basics', grade: 'Grade 2', subject: 'Science', questions: 12, status: 'Active' },
    { id: 4, title: 'History of Art', grade: 'Grade 5', subject: 'Art', questions: 20, status: 'Archived' },
  ];

  const columns = [
    { header: 'Title', accessor: 'title' as const },
    { header: 'Grade', accessor: 'grade' as const },
    { header: 'Subject', accessor: 'subject' as const },
    { header: 'Questions', accessor: 'questions' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          item.status === 'Active' ? 'bg-green-100 text-green-600' :
          item.status === 'Draft' ? 'bg-yellow-100 text-yellow-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  const actions = (item: any) => (
    <div className="flex justify-end gap-2">
      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        <Edit size={16} />
      </button>
      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Create Quiz
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable columns={columns} data={quizzes} actions={actions} />
      </div>
    </div>
  );
}
