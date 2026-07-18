'use client';

import { GRADES, GRADE_PREFIXES, type Grade } from '@/constants/grades';
import { useData } from '@/context/DataContext';
import { useDialog } from '@/context/DialogContext';
import { createClient } from '@/utils/supabase/client';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [studentIdSuffix, setStudentIdSuffix] = useState('');
  const [isSuffixManuallyEdited, setIsSuffixManuallyEdited] = useState(false);

  const supabase = createClient();
  const { showAlert } = useDialog();
  const { students } = useData();

  const getDefaultSuffix = (gradeName: string, existingStudents: any[]) => {
    if (gradeName === 'Homeschooling with spoken english' || gradeName === 'PHONICS LEVEL 1') {
      return '';
    }
    if (existingStudents.length > 0) {
      const prefixes = GRADE_PREFIXES[gradeName as Grade] || ['P'];
      const L = prefixes.length;
      const additionalChildIndex = existingStudents.length - 1;
      const prefixIndex = additionalChildIndex % L;
      const num = Math.floor(additionalChildIndex / L) + 1;
      return `${prefixes[prefixIndex]}${num}`;
    }
    return '';
  };

  const getPlaceholder = (gradeName: string) => {
    switch (gradeName) {
      case 'Homeschooling with spoken english':
        return 'HP8, HS8, HK8';
      case 'PHONICS LEVEL 1':
        return '7P, 7S, 7K';
      case 'Preschool':
        return 'e.g. P';
      case 'Grade 1':
        return 'e.g. G1';
      case 'Grade 2':
        return 'e.g. G2';
      default:
        return 'e.g. P';
    }
  };

  const getCleanBaseId = () => {
    if (students.length > 0) {
      const baseId = students[0].student_id || '';
      const segments = baseId.split('/');
      if (segments.length >= 2) {
        return `${segments[0]}/${segments[1]}`;
      }
      return baseId;
    }
    return 'mindsp/26';
  };

  const cleanBaseId = getCleanBaseId();

  const handleGradeChange = (newGrade: string) => {
    setFormData(prev => ({ ...prev, grade: newGrade }));
    if (!isSuffixManuallyEdited) {
      setStudentIdSuffix(getDefaultSuffix(newGrade, students));
    }
  };

  const handleClose = () => {
    setIsSuffixManuallyEdited(false);
    setFormData({
      childName: '',
      grade: 'Preschool',
      age: '',
      gender: 'boy',
    });
    setStudentIdSuffix('');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (students.length > 0 && !isSuffixManuallyEdited) {
        setStudentIdSuffix(getDefaultSuffix(formData.grade, students));
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, students]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        let studentId = '';

        if (students.length > 0) {
            studentId = `${cleanBaseId}/${studentIdSuffix.trim()}`;
        } else {
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

        handleClose();
        await showAlert("Child profile created successfully!", "Success");
        onSuccess();

    } catch (error: any) {
        console.error("Error adding child:", error);
        await showAlert(error.message || "Failed to add child", "Error");
    } finally {
        setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 overflow-y-auto grid place-items-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-4 border-purple-100 my-8">
        <button
          onClick={handleClose}
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
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 font-bold bg-white transition-all"
                >
                  <option value="Preschool">SPARK FOUNDATION</option>
                  <option value="Grade 1">SPARK BUILDERS</option>
                  <option value="Grade 2">SPARK ACHIEVERS</option>
                  <option value="Homeschooling with spoken english">Homeschooling with spoken english</option>
                  <option value="PHONICS LEVEL 1">PHONICS LEVEL 1</option>
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
              Student ID Suffix
            </label>
            <div className="relative flex items-center">
              <span className="bg-gray-50 px-4 py-3 rounded-l-xl border-2 border-r-0 border-gray-200 font-bold text-gray-400 select-none text-sm md:text-base whitespace-nowrap">
                {cleanBaseId}/
              </span>
              <input
                type="text"
                required
                value={studentIdSuffix}
                onChange={(e) => {
                  setStudentIdSuffix(e.target.value);
                  setIsSuffixManuallyEdited(true);
                }}
                className="w-full px-4 py-3 rounded-r-xl border-2 border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 font-bold transition-all text-gray-700"
                placeholder={getPlaceholder(formData.grade)}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Auto-filled based on grade, but you can enter your own text.
            </p>
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
