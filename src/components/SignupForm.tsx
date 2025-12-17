'use client';

import { createClient } from '@/utils/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  
  const getGradeCode = (selectedGrade: string) => {
    switch(selectedGrade) {
      case 'Preschool': return 'P1';
      case 'Grade 1': return 'G1';
      case 'Grade 2': return 'G2';
      case 'Grade 3': return 'G3';
      case 'Grade 4': return 'G4';
      case 'Grade 5': return 'G5';
      default: return '';
    }
  };

  const gradeCode = getGradeCode(grade);
  const idPrefix = `mindsp/26/${gradeCode ? gradeCode + '/' : ''}`;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            child_name: childName,
            grade: grade,
            student_id: `${idPrefix}${studentId}`,
          },
        },
      });

      if (error) throw error;
      
      // AUTO-CREATE FIRST STUDENT RECORD
      if (data.user) {
          const fullStudentId = `${idPrefix}${studentId}`;
          const { error: studentError } = await supabase
            .from('students')
            .insert({
                parent_id: data.user.id,
                full_name: childName,
                grade: grade,
                student_id: fullStudentId,
                gender: 'boy', // Default, user can update later
            });
            
          if (studentError) {
             console.error('Error creating student record:', studentError);
             // We don't block the signup flow but log it.
          }
      }

      // For now, we assume auto-confirmation or just redirect to login/onboarding
      // In a real app with email confirmation, you'd show a "Check your email" message
      router.push('/student');
      router.refresh();
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md mx-auto">
      <form className="space-y-4" onSubmit={handleSignUp}>
        <div>
          <input
            type="text"
            placeholder="Child Name"
            required
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
        </div>
        
        <div className="relative">
          <select
            required
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 appearance-none bg-white"
          >
            <option value="" disabled>Select Grade</option>
            <option value="Preschool">Preschool</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <div>
          <p className="text-xs text-red-500 mb-1 ml-4">
            පන්තියට මුදල් ගෙවා ලියාපදිංචි වූ සියලු සිසුන් student id එක ෆිල්කිරීම අනිවාර්ය වේ.
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
              <span className="text-gray-500">{idPrefix}</span>
            </div>
            <input
              type="text"
              placeholder="Student ID Suffix"
              required
              value={studentId}
              onChange={(e) => {
                // Only allow numbers and max 4 digits
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setStudentId(val);
              }}
              maxLength={4}
              className={`w-full pr-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 ${gradeCode ? 'pl-40' : 'pl-32'}`}
            />
          </div>
        </div>

        <div>
          <input
            type="email"
            placeholder="Parent Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Set Password ( 6+ characters )"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5B5FC7] text-white py-3 rounded-full font-bold text-lg hover:bg-[#4a4ea3] transition-colors shadow-md mt-6 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>



      <div className="text-center mt-8 text-xs text-gray-500">
        By Signing up, you agree to our{' '}
        <Link href="#" className="text-blue-500 hover:underline">
          Terms of Use
        </Link>{' '}
        &{' '}
        <Link href="#" className="text-blue-500 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
