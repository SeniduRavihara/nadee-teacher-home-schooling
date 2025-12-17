ALTER TABLE public.students
DROP CONSTRAINT IF EXISTS students_parent_id_fkey;

ALTER TABLE public.students
ADD CONSTRAINT students_parent_id_fkey
FOREIGN KEY (parent_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;
