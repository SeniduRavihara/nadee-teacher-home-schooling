'use client';

import { createClient } from '@/utils/supabase/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  grade: string | null;
  parent_name: string | null;
  child_name: string | null;
  contact_number: string | null;
  address: string | null;
  special_note: string | null;
  is_profile_completed: boolean;
};

type DataContextType = {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      } else {
        // Profile doesn't exist (trigger might have failed), create it manually
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
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const value = {
    profile,
    loading,
    refreshProfile: fetchProfile,
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
