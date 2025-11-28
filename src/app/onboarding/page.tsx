'use client';

import { createClient } from '@/utils/supabase/client';
import { FileText, Smile, Star } from 'lucide-react';
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
    age: '',
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
          age: parseInt(formData.age) || null,
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
    <section className="min-h-screen pt-12 pb-16 bg-white relative overflow-hidden flex items-center">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gray-50 rounded-r-[100px] -z-10 hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a4a]">
            {step === 1 ? 'Let\'s get to know you' : 'Tell us about your child'}
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Step {step} of 2: {step === 1 ? 'Parent Information' : 'Student Profile'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image & Value Props */}
          <div className="hidden lg:flex flex-col items-center">
            <div className="relative w-[400px] h-[400px] mb-8">
               {/* Abstract Shape Mask Placeholder */}
               <div className="absolute inset-0 bg-gray-200 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden border-4 border-white shadow-xl">
                  {/* Placeholder for Family Image */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-400 font-medium">Onboarding Illustration</span>
                  </div>
               </div>
               
               {/* Decorative Elements */}
               <div className="absolute top-0 left-10 w-8 h-8 bg-orange-400 rounded-full"></div>
               <div className="absolute top-10 right-0 w-16 h-16 bg-[#0a0a4a] rounded-full"></div>
               <div className="absolute bottom-10 left-0 w-12 h-12 bg-purple-500 rounded-full"></div>
            </div>

            <h2 className="text-xl font-bold text-[#0a0a4a] mb-8 text-center">
              Setup your profile to get the best experience.
            </h2>

            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <Smile size={18} />
                </div>
                <div className="text-xs font-medium text-gray-700 leading-tight">
                  Personalised<br />Content
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Star size={18} />
                </div>
                <div className="text-xs font-medium text-gray-700 leading-tight">
                  Progress<br />Tracking
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileText size={18} />
                </div>
                <div className="text-xs font-medium text-gray-700 leading-tight">
                  Easy<br />Management
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto w-full">
            <form className="space-y-6" onSubmit={step === 1 ? handleNext : handleSubmit}>
              
              {step === 1 && (
                <>
                  {/* Parent Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Parent Name</label>
                    <input
                      id="parentName"
                      name="parentName"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="appearance-none block w-full px-6 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Contact Number</label>
                    <input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      required
                      placeholder="e.g. +94 77 123 4567"
                      className="appearance-none block w-full px-6 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      required
                      placeholder="Your home address"
                      className="appearance-none block w-full px-6 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-md text-lg font-bold text-white bg-[#5B5FC7] hover:bg-[#4a4ea3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
                    >
                      Next Step
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Child Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Child Name</label>
                    <input
                      id="childName"
                      name="childName"
                      type="text"
                      required
                      placeholder="e.g. Sarah Doe"
                      className="appearance-none block w-full px-6 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                      value={formData.childName}
                      onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    />
                  </div>

                  {/* Grade Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Grade</label>
                    <div className="relative">
                      <select
                        id="grade"
                        name="grade"
                        required
                        className="block w-full px-6 py-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-full text-gray-700 appearance-none bg-white"
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Age</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      placeholder="e.g. 7"
                      className="appearance-none block w-full px-6 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  {/* Special Note */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Special Note (Optional)</label>
                    <textarea
                      id="specialNote"
                      name="specialNote"
                      rows={3}
                      placeholder="Any allergies or learning requirements..."
                      className="appearance-none block w-full px-6 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow resize-none"
                      value={formData.specialNote}
                      onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-full shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-full shadow-md text-lg font-bold text-white bg-[#5B5FC7] hover:bg-[#4a4ea3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                    >
                      {loading ? 'Saving...' : 'Complete'}
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
