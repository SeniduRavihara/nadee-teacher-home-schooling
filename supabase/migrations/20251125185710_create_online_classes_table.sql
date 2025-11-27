-- Create online_classes table
CREATE TABLE public.online_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  zoom_link TEXT,
  target_grade TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.online_classes ENABLE ROW LEVEL SECURITY;

-- Policies for online_classes
CREATE POLICY "Online classes are viewable by everyone." ON public.online_classes
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert online classes." ON public.online_classes
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update online classes." ON public.online_classes
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete online classes." ON public.online_classes
  FOR DELETE USING (public.is_admin());

-- Trigger for online_classes updated_at
CREATE TRIGGER update_online_classes_updated_at
    BEFORE UPDATE ON public.online_classes
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_online_classes_target_grade ON public.online_classes(target_grade);
CREATE INDEX IF NOT EXISTS idx_online_classes_start_time ON public.online_classes(start_time);
