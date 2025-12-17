'use client';

import { createClient } from '@/utils/supabase/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  parent_name: string | null;
  contact_number: string | null;
  address: string | null;
  special_note: string | null;
  is_profile_completed: boolean;
  // Legacy fields kept for compatibility, but we primarily use Student now
  grade: string | null;
  child_name: string | null;
};

export type Student = {
  id: string;
  parent_id: string;
  full_name: string;
  grade: string;
  student_id: string | null;
  gender: string;
  age: number | null;
  avatar_url?: string;
};

type DataContextType = {
  profile: Profile | null;
  students: Student[];
  activeStudent: Student | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  switchStudent: (studentId: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfileAndStudents = async () => {
    if (!user) {
      setProfile(null);
      setStudents([]);
      setActiveStudent(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      let currentProfile = profileData;

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      } else {
        // Create profile if missing
        console.log('Profile not found, creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(newProfile);
          currentProfile = newProfile;
        }
      }

      // 2. Fetch Students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true });

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        setStudents(studentsData || []);
        
        // Set active student logic
        if (studentsData && studentsData.length > 0) {
          // If we already have an active student, keep it if it's still in the list
          setActiveStudent((prev) => {
             // If we already have an active student, keep it (but update data) if it's still in the list
             const match = prev && studentsData.find(s => s.id === prev.id);
             if (match) {
                 return match;
             }
             return studentsData[0]; // Default to first student
          });
        }
      }

    } catch (error) {
      console.error('Unexpected error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStudents();
  }, [user]);

  const switchStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setActiveStudent(student);
    }
  };

  const value = {
    profile,
    students,
    activeStudent,
    loading,
    refreshProfile: fetchProfileAndStudents,
    switchStudent,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
