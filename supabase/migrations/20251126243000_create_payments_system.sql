-- 1) Create storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-slips', 'payment-slips', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Create payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  billing_month DATE NOT NULL,
  amount DECIMAL(10, 2),
  slip_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(user_id, billing_month)
);

-- 3) Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4) Policies for payments table

-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Users can insert their own payments
CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (public.is_admin());

-- Admins can update payments (to approve/reject)
CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE USING (public.is_admin());

-- 5) Storage Policies (MATCHING SAMPLE)

-- Allow authenticated users to upload to payment-slips bucket
CREATE POLICY "Users can upload payment slips" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'payment-slips');

-- Users can view own slips (and Admins to view all)
-- Enforces folder structure: user_id/filename
CREATE POLICY "Users can view own payment slips" 
  ON storage.objects 
  FOR SELECT 
  TO authenticated 
  USING (
    bucket_id = 'payment-slips'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      public.is_admin()
    )
  );

-- Users can update their own slips
CREATE POLICY "Users can update own payment slips" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (
    bucket_id = 'payment-slips'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own slips
CREATE POLICY "Users can delete own payment slips" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (
    bucket_id = 'payment-slips'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can manage all slips
CREATE POLICY "Admins can manage all payment slips" 
  ON storage.objects 
  FOR ALL
  TO authenticated 
  USING (
    bucket_id = 'payment-slips'
    AND public.is_admin()
  );

-- 6) Triggers and Indexes

-- Trigger for updated_at
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_billing_month ON public.payments(billing_month);
