import StatCard from '@/components/admin/StatCard';
import { BookOpen, Trophy, Users, Video } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

interface RecentStudent {
  id: string;
  child_name: string;
  created_at: string;
}

interface PopularQuiz {
  id: string;
  title: string;
  attempts: number;
  passed: number;
}

async function getDashboardData() {
  const supabase = await createClient();

  // Get total students count
  // METHOD: Counting from 'students' table (individual enrolled children)
  // This counts total enrolled children across all parents
  const { count: totalStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });

  // Get active quizzes count
  const { count: activeQuizzes } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true });

  // Get video classes count (courses)
  const { count: videoClasses } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });

  // Get completion rate (percentage of completed quiz attempts)
  const { data: allAttempts } = await supabase
    .from('quiz_attempts')
    .select('score, quiz_id');

  let completionRate = 0;
  if (allAttempts && allAttempts.length > 0) {
    // Get all quizzes with their passing scores
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('id, passing_score');

    const quizMap = new Map(quizzes?.map(q => [q.id, q.passing_score || 70]) || []);
    
    const passedAttempts = allAttempts.filter(attempt => 
      attempt.score !== null && attempt.score >= (quizMap.get(attempt.quiz_id) || 70)
    );
    
    completionRate = Math.round((passedAttempts.length / allAttempts.length) * 100);
  }

  // Get recent students (last 5)
  const { data: recentStudents } = await supabase
    .from('profiles')
    .select('id, child_name, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get popular quizzes (by attempt count)
  const { data: quizAttemptCounts } = await supabase
    .from('quiz_attempts')
    .select('quiz_id');

  // Count attempts per quiz
  const attemptMap = new Map<string, { total: number; passed: number }>();
  if (quizAttemptCounts) {
    for (const attempt of quizAttemptCounts) {
      const current = attemptMap.get(attempt.quiz_id) || { total: 0, passed: 0 };
      attemptMap.set(attempt.quiz_id, { ...current, total: current.total + 1 });
    }
  }

  // Get quiz details and pass rates
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, title, passing_score');

  const popularQuizzes: PopularQuiz[] = [];
  if (quizzes) {
    for (const quiz of quizzes) {
      const stats = attemptMap.get(quiz.id);
      if (stats && stats.total > 0) {
        // Get passed attempts for this quiz
        const { data: quizAttempts } = await supabase
          .from('quiz_attempts')
          .select('score')
          .eq('quiz_id', quiz.id);

        const passedCount = quizAttempts?.filter(a => 
          a.score !== null && a.score >= (quiz.passing_score || 70)
        ).length || 0;

        popularQuizzes.push({
          id: quiz.id,
          title: quiz.title,
          attempts: stats.total,
          passed: passedCount
        });
      }
    }
  }

  // Sort by attempts and take top 5
  popularQuizzes.sort((a, b) => b.attempts - a.attempts);
  const topQuizzes = popularQuizzes.slice(0, 5);

  return {
    totalStudents: totalStudents || 0,
    activeQuizzes: activeQuizzes || 0,
    videoClasses: videoClasses || 0,
    completionRate,
    recentStudents: (recentStudents || []) as RecentStudent[],
    popularQuizzes: topQuizzes
  };
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin!</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={data.totalStudents.toLocaleString()}
          change="+12%"
          isPositive={true}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Quizzes"
          value={data.activeQuizzes.toString()}
          change="+5%"
          isPositive={true}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Video Classes"
          value={data.videoClasses.toString()}
          change="+2"
          isPositive={true}
          icon={Video}
          color="bg-orange-500"
        />
        <StatCard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          change="+3%"
          isPositive={true}
          icon={Trophy}
          color="bg-green-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {data.recentStudents.length > 0 ? (
              data.recentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.child_name || 'New student'} registered
                    </p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(student.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Quizzes</h2>
          <div className="space-y-4">
            {data.popularQuizzes.length > 0 ? (
              data.popularQuizzes.map((quiz) => {
                const passRate = quiz.attempts > 0 
                  ? Math.round((quiz.passed / quiz.attempts) * 100) 
                  : 0;
                
                return (
                  <div key={quiz.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                        <p className="text-xs text-gray-500">
                          {quiz.attempts.toLocaleString()} attempt{quiz.attempts !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">{passRate}% Pass</span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No quiz data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
