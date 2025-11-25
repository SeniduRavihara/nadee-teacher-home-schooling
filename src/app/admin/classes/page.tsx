import DataTable from '@/components/admin/DataTable';
import { Edit, Plus, Trash2, Video } from 'lucide-react';

export default function ClassesPage() {
  const classes = [
    { id: 1, title: 'Advanced Math Concepts', instructor: 'Mr. Smith', date: '2023-11-20', time: '10:00 AM', students: 25 },
    { id: 2, title: 'Creative Writing Workshop', instructor: 'Ms. Johnson', date: '2023-11-21', time: '02:00 PM', students: 18 },
    { id: 3, title: 'Science Experiments Live', instructor: 'Dr. Brown', date: '2023-11-22', time: '11:00 AM', students: 30 },
  ];

  const columns = [
    { header: 'Class Title', accessor: 'title' as const },
    { header: 'Instructor', accessor: 'instructor' as const },
    { header: 'Date', accessor: 'date' as const },
    { header: 'Time', accessor: 'time' as const },
    { header: 'Students', accessor: 'students' as const },
  ];

  const actions = (item: any) => (
    <div className="flex justify-end gap-2">
      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Join Class">
        <Video size={16} />
      </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Online Classes</h1>
          <p className="text-gray-500">Schedule and manage live sessions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Schedule Class
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable columns={columns} data={classes} actions={actions} />
      </div>
    </div>
  );
}
