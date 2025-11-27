'use client';

import { createClient } from '@/utils/supabase/client';
import { ArrowRight, CheckCircle, ChevronLeft, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function QuizPlayerPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      // Fetch quiz details
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: true });

      if (questionsError) throw questionsError;

      if (quizData) {
        setQuiz({
          ...quizData,
          questions: questionsData || []
        });
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const totalQuestions = quiz?.questions.length || 0;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (selectedOption && currentQuestion) {
      const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
      setAnswers(newAnswers);
      
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        await finishQuiz(newAnswers);
      }
    }
  };

  const calculateScore = (finalAnswers: Record<string, string>) => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach(q => {
      if (finalAnswers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const finishQuiz = async (finalAnswers: Record<string, string>) => {
    setSaving(true);
    const score = calculateScore(finalAnswers);
    const percentage = Math.round((score / totalQuestions) * 100);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('quiz_attempts').insert({
          quiz_id: quiz!.id,
          user_id: user.id,
          score: percentage,
          answers: finalAnswers,
          completed_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving attempt:', error);
    } finally {
      setSaving(false);
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setShowResults(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading quiz...</div>;
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz not found</h2>
        <p className="text-gray-500 mb-6">This quiz might have been deleted or has no questions.</p>
        <Link href="/student/quizzes" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore(answers);
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-gray-500 mb-8">You did a great job on {quiz.title}</p>
          
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">{score}/{totalQuestions}</div>
              <div className="text-sm text-gray-500 font-medium">Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-1">{percentage}%</div>
              <div className="text-sm text-gray-500 font-medium">Accuracy</div>
            </div>
          </div>

          <div className="space-y-4 text-left mb-8 max-h-96 overflow-y-auto pr-2">
            {quiz.questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                  <p className="font-bold text-gray-900 mb-2">{index + 1}. {q.question_text}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      Your answer: <strong>{userAnswer}</strong>
                    </span>
                    {!isCorrect && (
                      <span className="text-green-700">
                        Correct: <strong>{q.correct_answer}</strong>
                      </span>
                    )}
                    {isCorrect ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={resetQuiz}
              className="px-6 py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            <Link 
              href="/student/quizzes"
              className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/student/quizzes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-8">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion?.question_text}</h2>

        <div className="space-y-4 mb-8">
          {currentQuestion?.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                selectedOption === option
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-auto flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedOption || saving}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              selectedOption && !saving
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving...' : currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
