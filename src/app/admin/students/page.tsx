'use client';

import { updateUserPassword } from '@/app/actions/admin-auth';
import { createClient } from '@/utils/supabase/client';
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
  
  // Password Reset State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [studentToReset, setStudentToReset] = useState<Student | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
            *,
            profiles:parent_id (
                email,
                parent_name,
                contact_number
            )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents((data as any) || []);
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
      // Note: Payments are linked to user_id (parent_id), so we check if the PARENT has paid
      // Ideally payments should be linked to student_id or we check specific grade, 
      // but for now we check if the parent linked to this student has a payment.
      
      const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('user_id, status, grade')
        .eq('billing_month', billingMonth);

      if (paymentError) throw paymentError;

      // Create a map for quick lookup: ParentID -> Status (Simple check)
      // TODO: Improve this to check specific grade payment if needed
      const paymentMap = new Map();
      payments?.forEach(p => paymentMap.set(p.user_id, p.status));

      // 3. Generate Excel Data
      const studentsToExport = filteredStudents.length > 0 ? filteredStudents : students;

      const excelData = studentsToExport.map(student => ({
        'Student ID': student.student_id || 'N/A',
        'Student Name': student.full_name || '',
        'Email': student.profiles?.email || '',
        'Grade': student.grade || '',
        'Parent Name': student.profiles?.parent_name || '',
        'Contact Number': student.profiles?.contact_number || '',
        [`Payment Status (${monthName})`]: paymentMap.get(student.parent_id) || 'Not Paid'
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

  const filteredStudents = students.filter(student => {
    const parentEmail = student.profiles?.email?.toLowerCase() || '';
    const studentName = student.full_name?.toLowerCase() || '';
    const studentId = student.student_id?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();

    const matchesSearch = studentName.includes(term) || parentEmail.includes(term) || studentId.includes(term);
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
            placeholder="Search by student name, ID or parent email..."
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
                <th className="px-6 py-4 font-semibold text-gray-700">Email (Parent)</th>
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
                      <div className="text-sm text-gray-500">{student.profiles?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {student.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{student.profiles?.parent_name || 'N/A'}</div>
                        <div className="text-gray-500">{student.profiles?.contact_number || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
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
