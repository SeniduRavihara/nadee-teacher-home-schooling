'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export function usePaymentStatus() {
  const [isPaid, setIsPaid] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsPaid(false);
        setLoading(false);
        return;
      }

      // Get current month's first day (e.g., '2025-11-01')
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data, error } = await supabase
        .from('payments')
        .select('status')
        .eq('user_id', user.id)
        .eq('billing_month', currentMonth)
        .eq('status', 'approved')
        .single();

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
