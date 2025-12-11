'use client';

import { createClient } from '@/utils/supabase/client';
import { Download, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  grade: string;
  parent_name: string;
  contact_number: string;
  created_at: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [downloading, setDownloading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // 1. Get current billing month
      const now = new Date();
      const billingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

      // 2. Fetch payments for this month
      const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('user_id, status')
        .eq('billing_month', billingMonth);

      if (paymentError) throw paymentError;

      // Create a map for quick lookup
      const paymentMap = new Map();
      payments?.forEach(p => paymentMap.set(p.user_id, p.status));

      // 3. Generate Excel Data
      const studentsToExport = filteredStudents.length > 0 ? filteredStudents : students;

      const excelData = studentsToExport.map(student => ({
        'Student ID': student.student_id || 'N/A',
        'Student Name': student.full_name || '',
        'Email': student.email || '',
        'Grade': student.grade || '',
        'Parent Name': student.parent_name || '',
        'Contact Number': student.contact_number || '',
        [`Payment Status (${monthName})`]: paymentMap.get(student.id) || 'Not Paid'
      }));

      // 4. Create Workbook and Download
      // Dynamically import xlsx to avoid server-side issues if any
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
      
      XLSX.writeFile(workbook, `students_payment_status_${billingMonth}.xlsx`);

    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Failed to download student data.');
    } finally {
      setDownloading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-2">Manage and view all registered students</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium">
            Total Students: {students.length}
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Download size={20} />
            {downloading ? 'Exporting...' : 'Download Excel'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="All">All Grades</option>
          <option value="Preschool">Preschool</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Student ID</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Student Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Grade</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Parent Details</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading students...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No students found matching your filters.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {student.student_id || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {student.full_name?.[0]?.toUpperCase() || <User size={18} />}
                        </div>
                        <div className="font-medium text-gray-900">{student.full_name || 'Unnamed Student'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {student.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{student.parent_name || 'N/A'}</div>
                        <div className="text-gray-500">{student.contact_number || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
