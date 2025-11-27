-- Add points column to questions table
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10;

-- Add comment
COMMENT ON COLUMN public.questions.points IS 'Points awarded for answering this question correctly';
