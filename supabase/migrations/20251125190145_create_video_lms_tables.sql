-- Create courses table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  target_grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT, -- e.g. "12:45"
  position INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create video_progress table
CREATE TABLE public.video_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- Policies for courses
CREATE POLICY "Courses are viewable by everyone." ON public.courses
  FOR SELECT USING (TRUE);

-- Policies for videos
CREATE POLICY "Videos are viewable by everyone." ON public.videos
  FOR SELECT USING (TRUE);

-- Policies for video_progress
CREATE POLICY "Users can insert their own progress." ON public.video_progress
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view their own progress." ON public.video_progress
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own progress." ON public.video_progress
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Add INSERT, UPDATE, DELETE policies for courses (Admin)
CREATE POLICY "Admins can insert courses" ON public.courses
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update courses" ON public.courses
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete courses" ON public.courses
  FOR DELETE USING (public.is_admin());

-- Add INSERT, UPDATE, DELETE policies for videos (Admin)
CREATE POLICY "Admins can insert videos" ON public.videos
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update videos" ON public.videos
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete videos" ON public.videos
  FOR DELETE USING (public.is_admin());

-- Triggers for updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_target_grade ON public.courses(target_grade);
CREATE INDEX IF NOT EXISTS idx_videos_course_id ON public.videos(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_position ON public.videos(position);
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON public.video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_id ON public.video_progress(video_id);
