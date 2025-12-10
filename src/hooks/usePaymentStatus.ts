'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export function usePaymentStatus() {
  const [isPaid, setIsPaid] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // We don't call checkPaymentStatus in useEffect automatically anymore because we might need the grade
  // But for backward compatibility or initial load without grade, we can leave it or adjust logic.
  // Better to expose a way to check with specific grade.

  const checkPaymentStatus = async (grade?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsPaid(false);
        setLoading(false);
        return;
      }

      // Get current month's first day as YYYY-MM-01 (Local Time)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const currentMonth = `${year}-${month}-01`;

      let query = supabase
        .from('payments')
        .select('status')
        .eq('user_id', user.id)
        .eq('billing_month', currentMonth)
        .eq('status', 'approved');

      if (grade) {
        query = query.eq('grade', grade);
      }

      const { data, error } = await query.maybeSingle(); // Use maybeSingle to avoid error if multiple rows (shouldn't happen with unique constraint but safe)

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error checking payment status:', error);
      }

      setIsPaid(!!data); // True if data exists (approved payment found)
    } catch (error) {
      console.error('Error in usePaymentStatus:', error);
      setIsPaid(false);
    } finally {
      setLoading(false);
    }
  };

  return { isPaid, loading, checkPaymentStatus };
}
