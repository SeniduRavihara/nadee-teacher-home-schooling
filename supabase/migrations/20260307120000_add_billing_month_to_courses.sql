-- Add optional billing_month to courses
-- When set, only students with an approved payment for that month can access this course.
-- When NULL, access falls back to the default current-month payment check.
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS billing_month DATE;
