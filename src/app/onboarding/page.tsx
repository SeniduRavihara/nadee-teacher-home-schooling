'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Parent Details, 2: Child Details
  
  const [formData, setFormData] = useState({
    // Parent Details
    parentName: '',
    contactNumber: '',
    address: '',
    
    // Child Details
    childName: '',
    grade: 'Grade 1',
    specialNote: '',
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          parent_name: formData.parentName,
          contact_number: formData.contactNumber,
          address: formData.address,
          child_name: formData.childName,
          grade: formData.grade,
          special_note: formData.specialNote,
          is_profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      router.push('/student');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? 'Parent Details' : 'Child Details'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Step {step} of 2
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={step === 1 ? handleNext : handleSubmit}>
            
            {step === 1 && (
              <>
                {/* Parent Name */}
                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                    Parent Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="parentName"
                      name="parentName"
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Child Details
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Child Name */}
                <div>
                  <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                    Child Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="childName"
                      name="childName"
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.childName}
                      onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Grade Selection */}
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <div className="mt-1">
                    <select
                      id="grade"
                      name="grade"
                      required
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    >
                      <option value="Preschool">Preschool</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                    </select>
                  </div>
                </div>

                {/* Special Note */}
                <div>
                  <label htmlFor="specialNote" className="block text-sm font-medium text-gray-700">
                    Special Note (Optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="specialNote"
                      name="specialNote"
                      rows={3}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.specialNote}
                      onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                      placeholder="Any special requirements or notes about your child..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Completing...' : 'Complete Profile'}
                  </button>
                </div>
              </>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
