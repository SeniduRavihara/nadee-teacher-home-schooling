-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER,
  target_grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings e.g. ["Option A", "Option B", ...]
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER,
  answers JSONB, -- User's selected answers e.g. { "question_id": "selected_option" }
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for quizzes
CREATE POLICY "Quizzes are viewable by everyone." ON public.quizzes
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL USING (public.is_admin());

-- Policies for questions
CREATE POLICY "Questions are viewable by everyone." ON public.questions
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage questions" ON public.questions
  FOR ALL USING (public.is_admin());

-- Policies for quiz_attempts
CREATE POLICY "Users can insert their own attempts." ON public.quiz_attempts
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view their own attempts." ON public.quiz_attempts
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own attempts." ON public.quiz_attempts
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Trigger for quizzes updated_at
CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON public.quizzes
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_target_grade ON public.quizzes(target_grade);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
