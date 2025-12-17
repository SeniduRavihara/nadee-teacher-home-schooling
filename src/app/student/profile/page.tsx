"use client";

import AddChildModal from "@/components/student/AddChildModal";
import PaymentHistory from "@/components/student/PaymentHistory";
import { useData } from "@/context/DataContext";
import { useDialog } from "@/context/DialogContext";
import { createClient } from "@/utils/supabase/client";
import { CreditCard, Heart, Plus, Save, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string;
  grade: string;
  age: number | null;
  address: string;
  contact_number: string;
  parent_name: string;
  child_name: string;
  special_note: string;
  student_id: string;
}

export default function StudentProfilePage() {
  const { profile, students, activeStudent, switchStudent, refreshProfile } = useData();
  const [loading, setLoading] = useState(false); // Managed by context mostly, but local loading state
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "payments">("details");
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const supabase = createClient();
  const { showAlert } = useDialog();

  const [formData, setFormData] = useState({
    fullName: "",
    grade: "Grade 1",
    age: "",
    address: "",
    contactNumber: "",
    parentName: "",
    childName: "",
    specialNote: "",
    studentId: "",
  });

  useEffect(() => {
    if (profile) {
      // Parent Data from 'profiles'
      const parentData = {
        address: profile.address || "",
        contactNumber: profile.contact_number || "",
        parentName: profile.parent_name || "",
        specialNote: profile.special_note || "",
      };

      // Child Data from 'activeStudent'
      const childData = activeStudent ? {
        childName: activeStudent.full_name || "",
        grade: activeStudent.grade || "Grade 1",
        age: activeStudent.age?.toString() || "",
        studentId: activeStudent.student_id || "",
        fullName: activeStudent.full_name || "", // Legacy field sync
      } : {
        childName: "",
        grade: "Grade 1",
        age: "",
        studentId: "",
        fullName: "",
      };

      setFormData({
        ...parentData,
        ...childData
      });
    }
  }, [profile, activeStudent]);


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    try {
      // 1. Update Parent Profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          address: formData.address,
          contact_number: formData.contactNumber,
          parent_name: formData.parentName,
          special_note: formData.specialNote,
        })
        .eq("id", profile.id);

      if (profileError) throw profileError;

      // 2. Update Active Student (if selected)
      if (activeStudent) {
         const { error: studentError } = await supabase
            .from("students")
            .update({
                full_name: formData.childName,
                grade: formData.grade,
                age: parseInt(formData.age) || null,
            })
            .eq("id", activeStudent.id);
            
         if (studentError) throw studentError;
      }

      await showAlert("Profile updated successfully!", "Success");
      refreshProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      await showAlert("Failed to update profile", "Error");
    } finally {
      setSaving(false);
    }
  };

  if (!profile && !activeStudent)
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
            <Sparkles className="text-white" size={32} />
          </div>
          <p className="text-purple-600 font-bold text-lg">
            Loading your profile... ✨
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border-4 border-white">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-300">
            <User size={40} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-black mb-2">My Profile! 👤</h1>
            <p className="text-white/95 font-bold text-lg">
              Manage your info for {activeStudent?.full_name || 'your child'}! 💳
            </p>
          </div>
          <Heart
            className="text-yellow-300 animate-pulse"
            size={48}
            fill="currentColor"
          />
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-yellow-300/20 rounded-full -mb-8"></div>
        <Sparkles
          className="absolute top-8 right-32 text-yellow-300 animate-pulse"
          size={24}
        />
      </div>

      {/* Colorful Tabs */}
      <div className="flex gap-3 border-b-4 border-purple-200 bg-white/60 backdrop-blur-sm rounded-t-2xl p-2">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-3 px-6 py-3 font-black transition-all relative rounded-xl ${
            activeTab === "details"
              ? "text-white bg-gradient-to-r from-purple-500 to-pink-400 shadow-lg scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <User size={20} />
            My Details 📝
          </div>
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-3 px-6 py-3 font-black transition-all relative rounded-xl ${
            activeTab === "payments"
              ? "text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <CreditCard size={20} />
            Payments 💰
          </div>
        </button>
      </div>

      {activeTab === "details" ? (
        <form
          onSubmit={handleUpdateProfile}
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {/* Children Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-pink-200">
             <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                 <User size={20} className="text-white" />
               </div>
               My Children 🧸
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {students.map((student) => (
                    <div 
                        key={student.id}
                        onClick={() => switchStudent(student.id)}
                        className={`p-6 rounded-2xl border-4 transition-all cursor-pointer relative group ${activeStudent?.id === student.id ? 'border-purple-400 bg-purple-50 shadow-md ring-2 ring-purple-200 ring-offset-2' : 'border-gray-100 bg-white hover:border-purple-200'}`}
                    >
                        {activeStudent?.id === student.id && (
                            <div className="absolute top-4 right-4 bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm">
                                <Sparkles size={12} />
                                Active
                            </div>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-white rounded-full border-2 border-purple-200 p-1">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`} alt="avatar" className="w-full h-full rounded-full" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{student.full_name}</h3>
                                <p className="text-purple-600 font-bold text-sm">{student.grade}</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                            Student ID: <span className="text-gray-700">{student.student_id}</span>
                        </div>
                    </div>
                ))}

                {/* Add New Child Button */}
                <button
                    type="button"
                    onClick={() => setIsAddChildOpen(true)}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-purple-300 transition-all group min-h-[160px]"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="text-purple-500" size={24} />
                    </div>
                    <p className="font-bold text-gray-600 group-hover:text-purple-600">Add Another Child</p>
                    <p className="text-xs text-center text-gray-400 mt-1">Register a sibling for classes</p>
                </button>
             </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-purple-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              Personal Details 📋
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-purple-700 mb-2">
                  Student ID 🆔
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 bg-purple-50 text-gray-600 focus:outline-none cursor-not-allowed font-bold"
                  value={formData.studentId}
                  readOnly
                  placeholder="Student ID"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-purple-700 mb-2">
                  Child's Name 👶
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 font-bold text-gray-800"
                  value={formData.childName}
                  onChange={(e) =>
                    setFormData({ ...formData, childName: e.target.value })
                  }
                  placeholder="Student's Name"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-purple-700 mb-2">
                  Grade 🎓
                </label>
                <select
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 font-bold text-gray-800 bg-white"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                >
                  <option value="Preschool">Preschool</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-purple-700 mb-2">
                  Age 🎂
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 font-bold text-gray-800"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Student's Age"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-blue-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              Contact Info 📞
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-blue-700 mb-2">
                  Parent's Name 👨‍👩‍👧
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 font-bold text-gray-800"
                  value={formData.parentName}
                  onChange={(e) =>
                    setFormData({ ...formData, parentName: e.target.value })
                  }
                  placeholder="Parent/Guardian Name"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-blue-700 mb-2">
                  Phone Number 📱
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 font-bold text-gray-800"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  placeholder="+94 7..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-blue-700 mb-2">
                  Address 🏠
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 font-bold text-gray-800"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Home Address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-blue-700 mb-2">
                  Special Notes 📝
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 font-bold text-gray-800"
                  value={formData.specialNote}
                  onChange={(e) =>
                    setFormData({ ...formData, specialNote: e.target.value })
                  }
                  placeholder="Any special requirements, allergies, etc..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg border-2 border-white"
            >
              <Save size={24} />
              {saving ? "Saving... ⏳" : "Save Changes! ✓"}
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PaymentHistory />
        </div>
      )}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onSuccess={() => {
            // Re-fetch profile or update list
            refreshProfile();
        }}
      />
    </div>
  );
}
