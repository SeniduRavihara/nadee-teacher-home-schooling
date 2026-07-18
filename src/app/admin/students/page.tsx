'use client';

import { updateUserPassword } from '@/app/actions/admin-auth';
import { createClient } from '@/utils/supabase/client';
import { GRADES } from '@/constants/grades';
import { Download, Eye, EyeOff, Key, Search, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
  id: string;
  student_id: string;
  full_name: string; // Changed from child_name
  grade: string;
  created_at: string;
  parent_id: string;
  profiles: {
    email: string;
    parent_name: string;
    contact_number: string;
  }
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [downloading, setDownloading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Password Reset State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [studentToReset, setStudentToReset] = useState<Student | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, itemsPerPage, debouncedSearch, selectedGrade]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let parentIds: string[] = [];
      if (debouncedSearch) {
        const { data: matchedProfiles } = await supabase
          .from('profiles')
          .select('id')
          .or(`email.ilike.%${debouncedSearch}%,parent_name.ilike.%${debouncedSearch}%`);
        if (matchedProfiles) {
          parentIds = matchedProfiles.map(p => p.id);
        }
      }

      let query = supabase
        .from('students')
        .select(`
            *,
            profiles:parent_id (
                email,
                parent_name,
                contact_number
            )
        `, { count: 'exact' });

      if (selectedGrade !== 'All') {
        query = query.eq('grade', selectedGrade);
      }

      if (debouncedSearch) {
        let orCondition = `full_name.ilike.%${debouncedSearch}%,student_id.ilike.%${debouncedSearch}%`;
        if (parentIds.length > 0) {
          orCondition += `,parent_id.in.(${parentIds.join(',')})`;
        }
        query = query.or(orCondition);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setStudents((data as any[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let parentIds: string[] = [];
      if (debouncedSearch) {
        const { data: matchedProfiles } = await supabase
          .from('profiles')
          .select('id')
          .or(`email.ilike.%${debouncedSearch}%,parent_name.ilike.%${debouncedSearch}%`);
        if (matchedProfiles) {
          parentIds = matchedProfiles.map(p => p.id);
        }
      }

      let allExportStudents: Student[] = [];
      let from = 0;
      const limit = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from('students')
          .select(`
              *,
              profiles:parent_id (
                  email,
                  parent_name,
                  contact_number
              )
          `);

        if (selectedGrade !== 'All') {
          query = query.eq('grade', selectedGrade);
        }

        if (debouncedSearch) {
          let orCondition = `full_name.ilike.%${debouncedSearch}%,student_id.ilike.%${debouncedSearch}%`;
          if (parentIds.length > 0) {
            orCondition += `,parent_id.in.(${parentIds.join(',')})`;
          }
          query = query.or(orCondition);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .range(from, from + limit - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allExportStudents = [...allExportStudents, ...(data as any[])];
          from += limit;
          if (data.length < limit) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      const now = new Date();
      const billingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

      const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('user_id, status, grade')
        .eq('billing_month', billingMonth);

      if (paymentError) throw paymentError;

      const paymentMap = new Map();
      payments?.forEach(p => paymentMap.set(p.user_id, p.status));

      const excelData = allExportStudents.map(student => ({
        'Student ID': student.student_id || 'N/A',
        'Student Name': student.full_name || '',
        'Email': student.profiles?.email || '',
        'Grade': student.grade || '',
        'Parent Name': student.profiles?.parent_name || '',
        'Contact Number': student.profiles?.contact_number || '',
        [`Payment Status (${monthName})`]: paymentMap.get(student.parent_id) || 'Not Paid'
      }));

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

  const openResetModal = (student: Student) => {
    setStudentToReset(student);
    setNewPassword('');
    setResetModalOpen(true);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToReset || !newPassword) return;

    setResetting(true);
    try {
      const result = await updateUserPassword(studentToReset.parent_id, newPassword);
      
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert('Password updated successfully!');
        setResetModalOpen(false);
        setStudentToReset(null);
      }
    } catch (err) {
      console.error('Failed to reset password', err);
      alert('An unexpected error occurred.');
    } finally {
      setResetting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-2">Manage and view all registered students</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium">
            Total Students: {totalCount}
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
            placeholder="Search by student name, ID or parent email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedGrade}
          onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
        >
          <option value="All">All Grades</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Student ID</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Student Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Email (Parent)</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Grade</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Parent Details</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No students found matching your filters.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-2">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {student.student_id || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-2">
                      <div className="font-medium text-gray-900">{student.full_name || 'Unnamed Student'}</div>
                    </td>
                    <td className="px-6 py-2">
                      <div className="text-sm text-gray-500">{student.profiles?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {student.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-2">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{student.profiles?.parent_name || 'N/A'}</div>
                        <div className="text-gray-500">{student.profiles?.contact_number || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                         <span>{new Date(student.created_at).toLocaleDateString()}</span>
                         <button 
                            onClick={() => openResetModal(student)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Reset Password"
                         >
                            <Key size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {students.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to <span className="font-medium text-gray-900">{Math.min(startIndex + students.length, totalCount)}</span> of <span className="font-medium text-gray-900">{totalCount}</span> students
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Previous
              </button>
              
              <span className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg border border-gray-100 flex items-center min-w-20 justify-center">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetModalOpen && studentToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Reset Password</h3>
              <button 
                onClick={() => setResetModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordReset} className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                <p>Combine resetting password for student: <span className="font-bold">{studentToReset.full_name}</span></p>
                <p className="mt-1 text-xs opacity-75">Parent ID: {studentToReset.parent_id}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Min 6 characters.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {resetting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
