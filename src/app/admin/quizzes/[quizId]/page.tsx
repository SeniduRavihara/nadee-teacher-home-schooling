'use client';

import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Edit, Plus, Save, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  target_grade: string;
  time_limit_minutes: number;
  passing_score: number;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
}

export default function QuizEditorPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const supabase = createClient();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Quiz Settings State
  const [settingsForm, setSettingsForm] = useState({
    title: '',
    subject: '',
    description: '',
    targetGrade: '',
    timeLimit: '',
    passingScore: ''
  });

  // Question Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    points: '10',
    options: ['', '', '', ''],
    correctAnswer: '' // This will store the actual answer text
  });

  useEffect(() => {
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      // Fetch Quiz Details
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;
      setQuiz(quizData);
      setSettingsForm({
        title: quizData.title,
        subject: quizData.subject,
        description: quizData.description || '',
        targetGrade: quizData.target_grade,
        timeLimit: quizData.time_limit_minutes.toString(),
        passingScore: quizData.passing_score.toString()
      });

      // Fetch Questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      // router.push('/admin/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({
          title: settingsForm.title,
          subject: settingsForm.subject,
          description: settingsForm.description,
          target_grade: settingsForm.targetGrade,
          time_limit_minutes: parseInt(settingsForm.timeLimit),
          passing_score: parseInt(settingsForm.passingScore)
        })
        .eq('id', quizId);

      if (error) throw error;
      alert('Quiz settings updated successfully!');
      fetchQuizData(); // Refresh to ensure sync
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update quiz settings');
    }
  };

  const handleOpenQuestionModal = (question?: Question) => {
    if (question) {
      setEditingQuestionId(question.id);
      setQuestionForm({
        text: question.question_text,
        points: question.points.toString(),
        options: [...question.options], // Clone array
        correctAnswer: question.correct_answer
      });
    } else {
      setEditingQuestionId(null);
      setQuestionForm({
        text: '',
        points: '10',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    }
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!questionForm.correctAnswer) {
      alert('Please select a correct answer');
      return;
    }
    if (questionForm.options.some(opt => !opt.trim())) {
      alert('Please fill in all 4 options');
      return;
    }

    try {
      const questionData = {
        quiz_id: quizId,
        question_text: questionForm.text,
        points: parseInt(questionForm.points),
        options: questionForm.options,
        correct_answer: questionForm.correctAnswer
      };

      if (editingQuestionId) {
        const { error } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', editingQuestionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('questions')
          .insert([questionData]);
        if (error) throw error;
      }

      setIsQuestionModalOpen(false);
      fetchQuizData(); // Refresh questions list

    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchQuizData();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading editor...</div>;
  if (!quiz) return <div className="p-8 text-center text-gray-500">Quiz not found</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/quizzes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit">
          <ArrowLeft size={20} />
          <span>Back to Quizzes</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Quiz: {quiz.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quiz Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Settings</h2>
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settingsForm.title}
                  onChange={(e) => setSettingsForm({...settingsForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settingsForm.subject}
                  onChange={(e) => setSettingsForm({...settingsForm, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm({...settingsForm, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Grade</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settingsForm.targetGrade}
                  onChange={(e) => setSettingsForm({...settingsForm, targetGrade: e.target.value})}
                >
                  <option value="Preschool">Preschool</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time (min)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={settingsForm.timeLimit}
                    onChange={(e) => setSettingsForm({...settingsForm, timeLimit: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pass Score</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={settingsForm.passingScore}
                    onChange={(e) => setSettingsForm({...settingsForm, passingScore: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium mt-2"
              >
                <Save size={18} />
                Update Settings
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Questions Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Questions ({questions.length})</h2>
              <button 
                onClick={() => handleOpenQuestionModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No questions added yet. Click "Add Question" to start.
                </div>
              ) : (
                questions.map((q, index) => (
                  <div key={q.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-gray-900">{q.question_text}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {q.points} pts
                        </span>
                        <button 
                          onClick={() => handleOpenQuestionModal(q)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-11">
                      {q.options.map((opt, i) => (
                        <div 
                          key={i} 
                          className={`text-sm px-3 py-2 rounded-lg border ${
                            opt === q.correct_answer 
                              ? 'bg-green-50 border-green-200 text-green-700 font-medium' 
                              : 'bg-gray-50 border-gray-100 text-gray-600'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingQuestionId ? 'Edit Question' : 'Add New Question'}</h2>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveQuestion} className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={questionForm.text}
                    onChange={(e) => setQuestionForm({...questionForm, text: e.target.value})}
                    placeholder="e.g., What is 2 + 2?"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({...questionForm, points: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options (Select the correct one)</label>
                <div className="space-y-3">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input 
                        type="radio"
                        name="correctAnswer"
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={questionForm.correctAnswer === option && option !== ''}
                        onChange={() => setQuestionForm({...questionForm, correctAnswer: option})}
                        disabled={option === ''}
                      />
                      <input 
                        type="text"
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          // If this was the selected answer, update the selection too
                          let newCorrect = questionForm.correctAnswer;
                          if (questionForm.correctAnswer === option) {
                            newCorrect = e.target.value;
                          }
                          setQuestionForm({
                            ...questionForm, 
                            options: newOptions,
                            correctAnswer: newCorrect
                          });
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-8">
                  * Fill in the option text first, then select the radio button for the correct answer.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingQuestionId ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
