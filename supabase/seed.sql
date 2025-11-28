-- Quizzes
INSERT INTO public.quizzes (id, title, subject, description, target_grade, time_limit_minutes, passing_score)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Grade 3 Math Basics', 'Mathematics', 'Test your addition and subtraction skills.', 'Grade 3', 15, 70),
    ('11111111-1111-1111-1111-111111111112', 'Grade 1 Phonics', 'English', 'Simple sounds and letters.', 'Grade 1', 10, 60),
    ('11111111-1111-1111-1111-111111111113', 'Grade 5 Science', 'Science', 'Solar system and plants.', 'Grade 5', 20, 80)
ON CONFLICT (id) DO NOTHING;

-- Questions for Quiz 1 (Math)
INSERT INTO public.questions (quiz_id, question_text, options, correct_answer, points)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'What is 5 + 7?', '["10", "11", "12", "13"]'::jsonb, '12', 10),
    ('11111111-1111-1111-1111-111111111111', 'What is 20 - 5?', '["10", "15", "20", "25"]'::jsonb, '15', 10)
ON CONFLICT DO NOTHING;

-- Online Classes
INSERT INTO public.online_classes (id, title, description, instructor_name, start_time, duration_minutes, zoom_link, target_grade, status)
VALUES
    ('22222222-2222-2222-2222-222222222221', 'Fun with Fractions', 'Introduction to fractions.', 'Mr. Teacher', NOW() + INTERVAL '1 day', 60, 'https://zoom.us/j/123456789', 'Grade 3', 'scheduled'),
    ('22222222-2222-2222-2222-222222222222', 'Story Time', 'Reading classic tales.', 'Ms. Reader', NOW() + INTERVAL '2 hours', 45, 'https://zoom.us/j/987654321', 'Grade 1', 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Courses
INSERT INTO public.courses (id, title, description, target_grade, thumbnail_url)
VALUES
    ('33333333-3333-3333-3333-333333333331', 'Space Exploration', 'Journey through the stars.', 'Grade 3', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'),
    ('33333333-3333-3333-3333-333333333332', 'Basic Art', 'Learn to draw shapes.', 'Grade 1', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800')
ON CONFLICT (id) DO NOTHING;

-- Videos for Course 1 (Space Exploration)
INSERT INTO public.videos (course_id, title, description, video_url, duration, position)
VALUES
    ('33333333-3333-3333-3333-333333333331', 'Lesson 1: Introduction', 'First video lesson.', 'https://www.youtube.com/watch?v=rMNAfMEM320', '10:00', 1),
    ('33333333-3333-3333-3333-333333333331', 'Lesson 2: Core Concepts', 'Second video lesson.', 'https://www.youtube.com/watch?v=eLHINDvrbMM', '15:30', 2),
    ('33333333-3333-3333-3333-333333333331', 'Lesson 3: Advanced Topics', 'Third video lesson.', 'https://www.youtube.com/watch?v=bVO69AhQquc', '12:45', 3),
    ('33333333-3333-3333-3333-333333333331', 'Lesson 4: Summary', 'Fourth video lesson.', 'https://www.youtube.com/watch?v=uVeEAFy1z68', '08:20', 4)
ON CONFLICT DO NOTHING;

-- Videos for Course 2 (Basic Art)
INSERT INTO public.videos (course_id, title, description, video_url, duration, position)
VALUES
    ('33333333-3333-3333-3333-333333333332', 'Art Lesson 1', 'Learning the basics.', 'https://www.youtube.com/watch?v=xQThNOtJPNQ', '09:15', 1),
    ('33333333-3333-3333-3333-333333333332', 'Art Lesson 2', 'Colors and Shapes.', 'https://www.youtube.com/watch?v=Uw9GRDRa464', '11:00', 2),
    ('33333333-3333-3333-3333-333333333332', 'Art Lesson 3', 'Creative Drawing.', 'https://www.youtube.com/watch?v=aeVGwf9FmwU', '14:20', 3)
ON CONFLICT DO NOTHING;
