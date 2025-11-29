'use client';

import { createClient } from '@/utils/supabase/client';
import { Check, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  billingMonth?: Date; // Optional: Pre-fill month if opened from a locked content
}

export default function PaymentModal({ isOpen, onClose, onSuccess, billingMonth }: PaymentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(
    billingMonth ? billingMonth.toISOString().slice(0, 7) : new Date().toISOString().slice(0, 7)
  );
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !amount || !month) return;

    setUploading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // 1. Upload File
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-slips')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-slips')
        .getPublicUrl(fileName);

      // 3. Create or Update Payment Record
      const { error: dbError } = await supabase
        .from('payments')
        .upsert({
          user_id: user.id,
          billing_month: `${month}-01`,
          amount: parseFloat(amount),
          slip_url: publicUrl,
          status: 'pending',
          admin_note: null // Clear any previous rejection notes
        }, {
          onConflict: 'user_id, billing_month'
        });

      if (dbError) throw dbError;

      onSuccess();
      onClose();
      alert('Payment slip uploaded successfully! Waiting for approval.');
    } catch (error: any) {
      console.error('Error uploading payment:', error);
      alert(error.message || 'Failed to upload payment');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Payment Slip</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (LKR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Slip (Image or PDF)
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center gap-2 text-gray-500">
                {file ? (
                  <>
                    <Check className="text-green-500" size={32} />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400" size={32} />
                    <span className="text-sm">Click to upload or drag and drop</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? 'Uploading...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}
