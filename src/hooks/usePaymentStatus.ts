'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export function usePaymentStatus() {
  const [isPaid, setIsPaid] = useState<boolean | null>(null); // null = loading
  const [paidMonths, setPaidMonths] = useState<string[]>([]); // list of YYYY-MM-01 strings
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const checkPaymentStatus = async (grade?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsPaid(false);
        setPaidMonths([]);
        setLoading(false);
        return;
      }

      // Build query for ALL approved payments for this user (optionally filtered by grade)
      let query = supabase
        .from('payments')
        .select('billing_month, status')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      if (grade) {
        query = query.eq('grade', grade);
      }

      const { data, error } = await query;

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking payment status:', error);
      }

      // Build a list of all approved billing months (normalised to YYYY-MM-01)
      const months = (data || []).map((row) => {
        const d = new Date(row.billing_month);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}-01`;
      });

      setPaidMonths(months);

      // isPaid = true if current month is in the paid months list
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      setIsPaid(months.includes(currentMonth));

    } catch (error) {
      console.error('Error in usePaymentStatus:', error);
      setIsPaid(false);
      setPaidMonths([]);
    } finally {
      setLoading(false);
    }
  };

  return { isPaid, paidMonths, loading, checkPaymentStatus };
}
