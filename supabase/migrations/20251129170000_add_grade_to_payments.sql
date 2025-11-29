-- Add grade column to payments table
ALTER TABLE public.payments 
ADD COLUMN grade TEXT;

-- Create index for grade column
CREATE INDEX IF NOT EXISTS idx_payments_grade ON public.payments(grade);
