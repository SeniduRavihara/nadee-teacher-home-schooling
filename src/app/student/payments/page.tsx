'use client';

import PaymentModal from '@/components/student/PaymentModal';
import { createClient } from '@/utils/supabase/client';
import { Calendar, Check, Clock, CreditCard, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Payment {
  id: string;
  billing_month: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_note: string | null;
}

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('billing_month', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
    } else {
      setPayments(data as any);
    }
    setLoading(false);
  };

  const getMonthName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check size={16} />;
      case 'rejected': return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Payments</h1>
          <p className="text-gray-500">Manage your monthly subscriptions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
        >
          <Upload size={20} />
          Upload New Slip
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading payments...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {payments.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Billing Month</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Submitted On</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {getMonthName(payment.billing_month)}
                    </td>
                    <td className="p-4 text-gray-600">LKR {payment.amount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-500 italic">
                      {payment.admin_note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No payments yet</h3>
              <p className="text-gray-500 mb-6">Upload your first bank slip to unlock premium content.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-orange-500 font-semibold hover:text-orange-600"
              >
                Upload Slip Now
              </button>
            </div>
          )}
        </div>
      )}

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPayments}
      />
    </div>
  );
}
