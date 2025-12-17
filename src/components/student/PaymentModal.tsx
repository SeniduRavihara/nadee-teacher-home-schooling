'use client';

import { GRADES } from '@/constants/grades';
import { useData } from '@/context/DataContext';
import { useDialog } from '@/context/DialogContext';
import { createClient } from '@/utils/supabase/client';
import { Check, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  billingMonth?: Date; // Optional: Pre-fill month if opened from a locked content
  defaultGrade?: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, billingMonth, defaultGrade = 'Grade 1' }: PaymentModalProps) {
  const { activeStudent, students } = useData();
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState('1000');
  const [grade, setGrade] = useState(activeStudent?.grade || defaultGrade);
  const [selectedStudentId, setSelectedStudentId] = useState(activeStudent?.id || '');
  const [month, setMonth] = useState(
    billingMonth ? billingMonth.toISOString().slice(0, 7) : new Date().toISOString().slice(0, 7)
  );
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  useEffect(() => {
    if (activeStudent) {
        setGrade(activeStudent.grade);
        setSelectedStudentId(activeStudent.id);
    }
  }, [activeStudent]);

  const { showAlert } = useDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = e.target.value;
      setSelectedStudentId(newId);
      const student = students.find(s => s.id === newId);
      if (student) {
          setGrade(student.grade);
      } else {
          // Fallback if selecting a raw grade from legacy list
          setGrade(newId); 
      }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !amount || !month || !grade) return;

    setUploading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // 1. Upload File
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-slips')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-slips')
        .getPublicUrl(fileName);

      // 3. Create or Update Payment Record
      const { error: dbError } = await supabase
        .from('payments')
        .upsert({
          user_id: user.id,
          billing_month: `${month}-01`,
          amount: parseFloat(amount),
          slip_url: publicUrl,
          status: 'pending',
          grade: grade,
          admin_note: null // Clear any previous rejection notes
        }, {
          onConflict: 'user_id, billing_month, grade'
        });

      console.log(user.id, publicUrl, grade);
      

      if (dbError) throw dbError;

      onSuccess();
      onClose();
      await showAlert('Payment slip uploaded successfully! Waiting for approval.', 'Success');
    } catch (error: any) {
      console.error('Error uploading payment:', error);
      await showAlert(error.message || 'Failed to upload payment', 'Error');
    } finally {
      setUploading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-0 right-0 float-right text-gray-400 hover:text-gray-600 bg-white z-10 p-1 rounded-full"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6 clear-both">Upload Payment Slip</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={handleStudentChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none bg-white font-medium"
                required
              >
                {students.length > 0 ? (
                    students.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.full_name} ({s.grade})
                        </option>
                    ))
                ) : (
                    GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (LKR)
            </label>
            <input
              type="number"
              value={amount}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Slip (Image or PDF)
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center gap-2 text-gray-500">
                {file ? (
                  <>
                    <Check className="text-green-500" size={32} />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400" size={32} />
                    <span className="text-sm">Click to upload or drag and drop</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? 'Uploading...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
