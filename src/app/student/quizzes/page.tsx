import { ArrowRight, BookOpen, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentQuizzesPage() {
  const quizzes = [
    {
      id: 1,
      title: 'Math Adventure: Grade 3',
      subject: 'Math',
      questions: 15,
      time: '20 mins',
      status: 'Not Started',
      score: null,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Reading Comprehension',
      subject: 'English',
      questions: 10,
      time: '15 mins',
      status: 'Completed',
      score: '9/10',
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'Science Basics',
      subject: 'Science',
      questions: 12,
      time: '15 mins',
      status: 'In Progress',
      score: null,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-500">Test your knowledge and earn stars!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 ${quiz.color}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${quiz.lightColor} ${quiz.textColor}`}>
                  {quiz.subject}
                </span>
                {quiz.status === 'Completed' && (
                  <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                    <CheckCircle size={16} />
                    <span>{quiz.score}</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen size={16} />
                  <span>{quiz.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{quiz.time}</span>
                </div>
              </div>

              <Link 
                href={`/student/quizzes/${quiz.id}`}
                className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                  quiz.status === 'Completed' 
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {quiz.status === 'Completed' ? 'Review Answers' : quiz.status === 'In Progress' ? 'Continue Quiz' : 'Start Quiz'}
                {quiz.status !== 'Completed' && <ArrowRight size={18} />}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
