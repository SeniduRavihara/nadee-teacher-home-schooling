'use client';

import { createClient } from '@/utils/supabase/client';
import { Check, Eye, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Payment {
  id: string;
  user_id: string;
  billing_month: string;
  amount: number;
  slip_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    grade: string;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    
    // 1. Fetch Payments
    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data: paymentsData, error: paymentsError } = await query;

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      setLoading(false);
      return;
    }

    // 2. Fetch Profiles for these payments
    const userIds = Array.from(new Set((paymentsData || []).map(p => p.user_id)));
    
    let profilesMap: Record<string, any> = {};
    
    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, grade')
        .in('id', userIds);
        
      if (!profilesError && profilesData) {
        profilesMap = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // 3. Merge Data
    const mergedPayments = (paymentsData || []).map(payment => ({
      ...payment,
      profiles: profilesMap[payment.user_id] || { full_name: 'Unknown', email: '', grade: '-' }
    }));

    setPayments(mergedPayments);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('payments')
      .update({ status, admin_note: adminNote })
      .eq('id', id);

    if (error) {
      alert('Error updating payment status');
    } else {
      setSelectedPayment(null);
      setAdminNote('');
      fetchPayments();
    }
  };

  const getMonthName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Reviews</h1>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading payments...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Student</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Month</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{payment.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{payment.profiles?.grade}</div>
                  </td>
                  <td className="p-4 text-gray-600">{getMonthName(payment.billing_month)}</td>
                  <td className="p-4 font-medium text-gray-900">LKR {payment.amount}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      title="View Slip"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="text-center py-12 text-gray-500">No payments found.</div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Review Payment</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-500 mb-1">Student</label>
                  <div className="font-medium">{selectedPayment.profiles?.full_name}</div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Billing Month</label>
                  <div className="font-medium">{getMonthName(selectedPayment.billing_month)}</div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Amount</label>
                  <div className="font-medium">LKR {selectedPayment.amount}</div>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Submitted</label>
                  <div className="font-medium">{new Date(selectedPayment.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="border rounded-lg p-2 bg-gray-50 flex justify-center">
                 {/* Handle PDF vs Image */}
                 {selectedPayment.slip_url.toLowerCase().endsWith('.pdf') ? (
                    <iframe src={selectedPayment.slip_url} className="w-full h-96" />
                 ) : (
                    <div className="relative w-full h-96">
                        <Image 
                            src={selectedPayment.slip_url} 
                            alt="Payment Slip" 
                            fill 
                            className="object-contain"
                        />
                    </div>
                 )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Note (Optional)</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Reason for rejection or internal note..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleUpdateStatus(selectedPayment.id, 'rejected')}
                  className="flex-1 py-3 px-4 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={20} /> Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedPayment.id, 'approved')}
                  className="flex-1 py-3 px-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} /> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
