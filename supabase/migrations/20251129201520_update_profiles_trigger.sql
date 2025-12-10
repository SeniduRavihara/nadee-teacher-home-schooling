-- Add student_id column to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id TEXT;

-- Update the handle_new_user function to include new fields from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url,
    child_name,
    grade,
    student_id,
    is_profile_completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'child_name',
    NEW.raw_user_meta_data->>'grade',
    NEW.raw_user_meta_data->>'student_id',
    CASE 
      WHEN NEW.raw_user_meta_data->>'child_name' IS NOT NULL 
           AND NEW.raw_user_meta_data->>'grade' IS NOT NULL 
      THEN TRUE 
      ELSE FALSE 
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    child_name = EXCLUDED.child_name,
    grade = EXCLUDED.grade,
    student_id = EXCLUDED.student_id,
    is_profile_completed = EXCLUDED.is_profile_completed;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
