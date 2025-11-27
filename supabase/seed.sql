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
    ('33333333-3333-3333-3333-333333333331', 'The Sun: Our Star', 'Learn about the sun and its importance.', 'https://www.youtube.com/embed/VkW54j82e9U', '04:15', 1),
    ('33333333-3333-3333-3333-333333333331', 'The Moon: Earth''s Satellite', 'Discover the phases of the moon.', 'https://www.youtube.com/embed/B-b4XVUQ4ld', '05:30', 2),
    ('33333333-3333-3333-3333-333333333331', 'The Solar System', 'Tour the planets of our solar system.', 'https://www.youtube.com/embed/libKVRa01L8', '12:00', 3)
ON CONFLICT DO NOTHING;

-- Videos for Course 2 (Basic Art)
INSERT INTO public.videos (course_id, title, description, video_url, duration, position)
VALUES
    ('33333333-3333-3333-3333-333333333332', 'Drawing Shapes', 'How to draw circles, squares, and triangles.', 'https://www.youtube.com/embed/T8j35u1V2vM', '08:45', 1),
    ('33333333-3333-3333-3333-333333333332', 'Primary Colors', 'Learning about Red, Blue, and Yellow.', 'https://www.youtube.com/embed/yu44JRTIxSQ', '06:20', 2)
ON CONFLICT DO NOTHING;
