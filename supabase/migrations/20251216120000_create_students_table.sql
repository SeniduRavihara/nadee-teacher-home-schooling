-- Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES public.profiles(id) NOT NULL,
    full_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    student_id TEXT,
    gender TEXT DEFAULT 'boy',
    age INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Policy: Parents can view/manage their own children
CREATE POLICY "Parents can manage their own children" 
ON public.students
FOR ALL 
USING (auth.uid() = parent_id);

-- Policy: Admins can view/manage ALL students
-- Uses the public.is_admin() helper function from profiles migration
CREATE POLICY "Admins can manage all students" 
ON public.students 
FOR ALL 
USING (public.is_admin());

-- Create Index for performance
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON public.students(parent_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
