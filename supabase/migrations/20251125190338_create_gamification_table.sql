-- Create student_stats table
CREATE TABLE public.student_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_stars INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.student_stats ENABLE ROW LEVEL SECURITY;

-- Policies for student_stats
CREATE POLICY "Users can view their own stats." ON public.student_stats
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own stats." ON public.student_stats
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all stats" ON public.student_stats
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all stats" ON public.student_stats
  FOR UPDATE USING (public.is_admin());

-- Function to handle new user stats initialization
CREATE OR REPLACE FUNCTION public.handle_new_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.student_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_stats();

-- Trigger for updated_at
CREATE TRIGGER update_student_stats_updated_at
    BEFORE UPDATE ON public.student_stats
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- Indexes for performance (Leaderboards)
CREATE INDEX IF NOT EXISTS idx_student_stats_total_stars ON public.student_stats(total_stars DESC);
CREATE INDEX IF NOT EXISTS idx_student_stats_streak ON public.student_stats(current_streak DESC);
