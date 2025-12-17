'use client';

import { GRADES } from '@/constants/grades';
import { useData } from '@/context/DataContext';
import { useDialog } from '@/context/DialogContext';
import { createClient } from '@/utils/supabase/client';
import { X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddChildModal({ isOpen, onClose, onSuccess }: AddChildModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    childName: '',
    grade: 'Preschool',
    age: '',
    gender: 'boy',
  });
  const supabase = createClient();
  const { showAlert } = useDialog();
  const { students } = useData();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        let studentId = '';

        if (students.length > 0) {
            // Logic: Get the first student's ID as the "Base ID"
            // Example: mindsp/26/P1/1999
            // If the base ID already has a suffix (which shouldn't happen for the 1st one usually, but we handle it), we clean it?
            // User requirement: "mindsp/26/P1/1999" -> "mindsp/26/P1/1999/a"
            
            // We trust the first student in the array (ordered by created_at) is the "Main" profile.
            const baseId = students[0].student_id || `STU-${Math.floor(1000 + Math.random() * 9000)}`;
            
            // Remove any existing suffix if we accidentally grabbed a child
            // A suffix looks like "/a", "/b" at the end. 
            // Regex to match "slash followed by single letter at end of string"
            const cleanBaseId = baseId.replace(/\/[a-z]$/, '');

            // Generate suffix: 'a', 'b', 'c'...
            // If we have 1 student, we are adding the 2nd one. index=0 ('a')
            // If we have 2 students, we are adding the 3rd one. index=1 ('b')
            // students.length currently includes the main one (1). 
            // So for the NEW child (2nd total), we want 97 + (1-1) = 97 ('a') -> Wait.
            // User example: "every additional child will start with /a"
            // Child 2 -> suffix 'a'. (students.length = 1) -> index 0
            // Child 3 -> suffix 'b'. (students.length = 2) -> index 1
            const suffixIndex = students.length - 1; 
            const suffix = String.fromCharCode(97 + suffixIndex); // 97 is 'a'
            
            studentId = `${cleanBaseId}/${suffix}`;

        } else {
             // Fallback if no students exist (should rarely happen from this modal)
             studentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const { error } = await supabase.from('students').insert({
            parent_id: user.id,
            full_name: formData.childName,
            grade: formData.grade,
            age: parseInt(formData.age),
            gender: formData.gender,
            student_id: studentId
        });

        if (error) throw error;

        onClose();
        await showAlert("Child profile created successfully!", "Success");
        onSuccess();
        
        // Reset form
        setFormData({
            childName: '',
            grade: 'Preschool',
            age: '',
            gender: 'boy',
        });

    } catch (error: any) {
        console.error("Error adding child:", error);
        await showAlert(error.message || "Failed to add child", "Error");
    } finally {
        setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-4 border-purple-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👶</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Add New Child</h2>
            <p className="text-gray-500 font-medium">Create a profile for your other child</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Child's Name
            </label>
            <input
              type="text"
              required
              value={formData.childName}
              onChange={(e) => setFormData({...formData, childName: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 font-bold transition-all"
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 font-bold bg-white transition-all"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 font-bold transition-all"
                  placeholder="Age"
                />
              </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Gender
            </label>
            <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.gender === 'boy' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-blue-200'}`}>
                    <input type="radio" name="gender" value="boy" checked={formData.gender === 'boy'} onChange={() => setFormData({...formData, gender: 'boy'})} className="hidden" />
                    <span className="text-xl">👦</span>
                    <span className="font-bold">Boy</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.gender === 'girl' ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500 hover:border-pink-200'}`}>
                    <input type="radio" name="gender" value="girl" checked={formData.gender === 'girl'} onChange={() => setFormData({...formData, gender: 'girl'})} className="hidden" />
                    <span className="text-xl">👧</span>
                    <span className="font-bold">Girl</span>
                </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 hover:scale-[1.02] transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Creating Profile...' : 'Create Profile ✨'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
