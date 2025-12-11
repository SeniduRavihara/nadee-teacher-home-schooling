import { BarChart2, Download, PieChart, TrendingUp } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

type ProgressPoint = { date: string; attempts: number; avgScore: number };
type SubjectSlice = { subject: string; count: number; percent: number };
type GradePerformance = { grade: string; attempts: number; avgScore: number };

async function getReportData() {
  const supabase = await createClient();

  // Last 30 days quiz attempts
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('created_at, score, quiz_id')
    .gte('created_at', since.toISOString());

  // Quizzes metadata
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, subject, target_grade, passing_score');

  const quizById = new Map(quizzes?.map(q => [q.id, q]) || []);

  // Build progress points per day
  const progressMap = new Map<string, { total: number; sumScore: number; scored: number }>();
  attempts?.forEach(att => {
    const dateKey = new Date(att.created_at).toISOString().slice(0, 10);
    const entry = progressMap.get(dateKey) || { total: 0, sumScore: 0, scored: 0 };
    entry.total += 1;
    if (att.score !== null) {
      entry.sumScore += att.score as number;
      entry.scored += 1;
    }
    progressMap.set(dateKey, entry);
  });

  const progress: ProgressPoint[] = Array.from(progressMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, vals]) => ({
      date,
      attempts: vals.total,
      avgScore: vals.scored ? Math.round(vals.sumScore / vals.scored) : 0,
    }));

  // Subject distribution
  const subjectCounts = new Map<string, number>();
  quizzes?.forEach(q => {
    subjectCounts.set(q.subject, (subjectCounts.get(q.subject) || 0) + 1);
  });
  const totalSubjects = Array.from(subjectCounts.values()).reduce((a, b) => a + b, 0) || 1;
  const subjects: SubjectSlice[] = Array.from(subjectCounts.entries()).map(([subject, count]) => ({
    subject,
    count,
    percent: Math.round((count / totalSubjects) * 100),
  }));

  // Performance by grade (using attempts mapped to quiz target_grade)
  const gradeMap = new Map<string, { attempts: number; sumScore: number; scored: number }>();
  attempts?.forEach(att => {
    const quiz = quizById.get(att.quiz_id);
    if (!quiz) return;
    const gradeKey = quiz.target_grade || 'Unknown';
    const entry = gradeMap.get(gradeKey) || { attempts: 0, sumScore: 0, scored: 0 };
    entry.attempts += 1;
    if (att.score !== null) {
      entry.sumScore += att.score as number;
      entry.scored += 1;
    }
    gradeMap.set(gradeKey, entry);
  });

  const grades: GradePerformance[] = Array.from(gradeMap.entries())
    .map(([grade, vals]) => ({
      grade,
      attempts: vals.attempts,
      avgScore: vals.scored ? Math.round(vals.sumScore / vals.scored) : 0,
    }))
    .sort((a, b) => b.attempts - a.attempts);

  const totals = {
    attempts: attempts?.length || 0,
    avgScore:
      attempts && attempts.length
        ? Math.round(
            (attempts.reduce((sum, att) => sum + ((att.score as number) || 0), 0) /
              attempts.filter(att => att.score !== null).length || 1)
          )
        : 0,
  };

  return { progress, subjects, grades, totals };
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const width = max > 0 ? Math.max((value / max) * 100, 4) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-600">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}

function ProgressRow({ point }: { point: ProgressPoint }) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-700 border-b border-gray-50 py-1 last:border-0">
      <span className="text-gray-500">{point.date}</span>
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">{point.attempts} attempts</span>
        <span className="text-blue-600 font-semibold">{point.avgScore}% avg</span>
      </div>
    </div>
  );
}

export default async function ReportsPage() {
  const { progress, subjects, grades, totals } = await getReportData();

  const maxSubject = Math.max(...(subjects.map(s => s.count) || [0]));
  const maxGradeAttempts = Math.max(...(grades.map(g => g.attempts) || [0]));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Detailed insights into platform performance</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Student Progress (Last 30 Days)
            </h2>
            <div className="text-sm text-gray-500">
              {totals.attempts} attempts · Avg {totals.avgScore}%
            </div>
          </div>
          {progress.length === 0 ? (
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200 text-gray-400 font-medium">
              No attempts yet
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto pr-2 divide-y divide-gray-50">
              {progress.map(point => (
                <ProgressRow key={point.date} point={point} />
              ))}
            </div>
          )}
        </div>

        {/* Subject Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PieChart size={20} className="text-purple-500" />
              Subject Distribution
            </h2>
            <span className="text-sm text-gray-500">{subjects.length} subjects</span>
          </div>
          {subjects.length === 0 ? (
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200 text-gray-400 font-medium">
              No quizzes added yet
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.map(slice => (
                <BarRow
                  key={slice.subject}
                  label={`${slice.subject} (${slice.percent}%)`}
                  value={slice.count}
                  max={maxSubject}
                  color="bg-gradient-to-r from-purple-400 to-pink-400"
                />
              ))}
            </div>
          )}
        </div>

        {/* Quiz Performance by Grade */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 size={20} className="text-green-500" />
              Quiz Performance by Grade
            </h2>
            <span className="text-sm text-gray-500">Attempts per quiz grade</span>
          </div>
          {grades.length === 0 ? (
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200 text-gray-400 font-medium">
              No attempt data yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {grades.map(grade => (
                <div key={grade.grade} className="p-4 rounded-xl border border-gray-100 bg-gray-50/60">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-gray-900">{grade.grade}</span>
                    <span className="text-green-600 font-semibold">Avg {grade.avgScore}%</span>
                  </div>
                  <BarRow
                    label="Attempts"
                    value={grade.attempts}
                    max={maxGradeAttempts}
                    color="bg-gradient-to-r from-green-400 to-emerald-400"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
