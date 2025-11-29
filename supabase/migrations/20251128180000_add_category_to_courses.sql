-- Add category column to courses table
ALTER TABLE public.courses 
ADD COLUMN category TEXT DEFAULT 'recording' CHECK (category IN ('recording', 'movie', 'yt_video'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
