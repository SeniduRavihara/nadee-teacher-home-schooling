-- Migration to drop the check constraint on profiles.grade to allow custom courses/grades
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_grade_check;
