-- 1. Backfill existing payments with a default grade (e.g., 'Grade 1') if null
UPDATE payments SET grade = 'Grade 1' WHERE grade IS NULL;

-- 2. Make grade column NOT NULL (if not already)
ALTER TABLE payments ALTER COLUMN grade SET NOT NULL;
ALTER TABLE payments ALTER COLUMN grade SET DEFAULT 'Grade 1';

-- 3. Update Unique Constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_user_id_billing_month_key;
ALTER TABLE payments ADD CONSTRAINT payments_user_id_billing_month_grade_key UNIQUE (user_id, billing_month, grade);
