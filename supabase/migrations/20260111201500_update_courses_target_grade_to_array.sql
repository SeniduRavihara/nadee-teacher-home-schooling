-- Migration to change target_grade from TEXT to TEXT[]

-- 1. Alter the column type, converting existing single values to single-element arrays
ALTER TABLE public.courses
  ALTER COLUMN target_grade TYPE TEXT[] USING ARRAY[target_grade];

-- 2. Drop the old index as it was for TEXT
DROP INDEX IF EXISTS idx_courses_target_grade;

-- 3. Create a new GIN index for efficient array operations (contains @>)
CREATE INDEX idx_courses_target_grade ON public.courses USING GIN (target_grade);
