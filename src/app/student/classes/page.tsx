'use client';

import PaymentModal from '@/components/student/PaymentModal';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { createClient } from '@/utils/supabase/client';
import { Calendar, Clock, Lock, User, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ClassesPage() {
  const [userGrade, setUserGrade] = useState<string>('Grade 1');
  const [loading, setLoading] = useState(true);
  const { isPaid, loading: paymentLoading, checkPaymentStatus } = usePaymentStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('grade')
        .eq('id', user.id)
        .single();
      if (profile?.grade) {
        setUserGrade(profile.grade);
        fetchClasses(profile.grade);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchClasses = async (grade: string) => {
    try {
      const { data, error } = await supabase
        .from('online_classes')
        .select('*')
        .eq('target_grade', grade)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedClasses = (data || []).map(cls => {
        const startTime = new Date(cls.start_time);
        const durationMs = (cls.duration_minutes || 60) * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);
        const now = new Date();
        
        let status = 'Upcoming';
        if (now >= startTime && now < endTime) {
          status = 'Live';
        } else if (now >= endTime) {
          status = 'Completed';
        }

        const dateStr = startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Helper for colors based on title (since subject column is missing)
        const getSubjectColors = (title: string) => {
          const s = (title || '').toLowerCase();
          if (s.includes('math')) return { color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' };
          if (s.includes('science')) return { color: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600' };
          if (s.includes('english')) return { color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' };
          return { color: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' };
        };

        const colors = getSubjectColors(cls.title);

        return {
          id: cls.id,
          title: cls.title,
          instructor: cls.instructor_name,
          date: startTime.toDateString() === now.toDateString() ? 'Today' : dateStr,
          time: timeStr,
          duration: `${cls.duration_minutes} mins`,
          status,
          color: colors.color,
          lightColor: colors.light,
          textColor: colors.text,
          targetGrade: cls.target_grade,
          zoomLink: cls.zoom_link
        };
      });

      setClasses(formattedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const [classes, setClasses] = useState<any[]>([]);

  const handleClassAction = (cls: any) => {
    if (cls.status === 'Upcoming') {
      alert('Reminder set! (This is a demo feature)');
    } else if (cls.status === 'Completed') {
      alert('Recording not available yet.');
    }
  };

  if (loading || paymentLoading) {
    return <div className="p-8 text-center">Loading classes...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Online Class ({userGrade})</h1>
        <p className="text-gray-500 mt-2">Join your live sessions and view upcoming schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <div key={cls.id} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
              
              {/* Locking Overlay */}
              {!isPaid && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Lock className="text-gray-500" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Content Locked</h3>
                  <p className="text-sm text-gray-500 mb-4">Payment required for this month</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Unlock Now
                  </button>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${cls.lightColor} ${cls.textColor}`}>
                  {cls.status}
                </div>
                <div className={`w-10 h-10 rounded-full ${cls.lightColor} flex items-center justify-center ${cls.textColor}`}>
                  <Video size={20} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{cls.title}</h3>
              
              <div className="space-y-3 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{cls.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{cls.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{cls.time} ({cls.duration})</span>
                </div>
              </div>

              {cls.status === 'Live' || cls.status === 'Upcoming' ? (
                <a 
                  href={cls.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full mt-6 py-3 rounded-xl font-bold text-white text-center transition-opacity ${cls.color} hover:opacity-90`}
                >
                  {cls.status === 'Live' ? 'Join Now' : 'Join Early'}
                </a>
              ) : (
                <button 
                  onClick={() => handleClassAction(cls)}
                  className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition-opacity ${cls.color} ${cls.status === 'Completed' ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                >
                  {cls.status === 'Completed' ? 'Watch Recording' : 'Set Reminder'}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No classes scheduled for {userGrade} yet.
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          checkPaymentStatus();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
