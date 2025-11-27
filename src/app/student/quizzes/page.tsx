import { createClient } from '@/utils/supabase/server';
import { Award, BookOpen, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default async function QuizzesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userGrade = 'Grade 1';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('grade')
      .eq('id', user.id)
      .single();
    if (profile?.grade) {
      userGrade = profile.grade;
    }
  }

  // Fetch quizzes for the user's grade
  const { data: quizzesData } = await supabase
    .from('quizzes')
    .select(`
      *,
      questions (count),
      quiz_attempts (
        score,
        completed_at
      )
    `)
    .eq('target_grade', userGrade)
    .order('created_at', { ascending: false });

  // Helper to determine colors based on subject
  const getSubjectColors = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return { color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' };
    if (s.includes('science')) return { color: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600' };
    if (s.includes('english')) return { color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' };
    if (s.includes('art')) return { color: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' };
    return { color: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600' };
  };

  const quizzes = (quizzesData || []).map(quiz => {
    const attempt = quiz.quiz_attempts?.[0];
    const status = attempt ? 'Completed' : 'Not Started';
    const colors = getSubjectColors(quiz.subject);
    
    return {
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      questions: quiz.questions?.[0]?.count || 0,
      time: `${quiz.time_limit_minutes} mins`,
      status,
      score: attempt?.score,
      color: colors.color,
      lightColor: colors.light,
      textColor: colors.text,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quizzes ({userGrade})</h1>
        <p className="text-gray-500 mt-2">Test your knowledge and earn stars!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${quiz.lightColor} ${quiz.textColor}`}>
                  {quiz.subject}
                </div>
                {quiz.status === 'Completed' && (
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Award size={16} fill="currentColor" />
                    <span>{quiz.score}%</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
              
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{quiz.questions} Questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{quiz.time}</span>
                </div>
              </div>

              <Link href={`/student/quizzes/${quiz.id}`} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-opacity ${quiz.color} hover:opacity-90`}>
                <PlayCircle size={20} />
                <span>{quiz.status === 'Not Started' ? 'Start Quiz' : quiz.status === 'Completed' ? 'Retake Quiz' : 'Continue'}</span>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No quizzes available for {userGrade}.
          </div>
        )}
      </div>
    </div>
  );
}
