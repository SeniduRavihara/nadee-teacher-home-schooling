'use client';

import { BalloonSVG } from '@/components/student/decorations/BalloonSVG';
import { BirdSVG, ButterflySVG } from '@/components/student/decorations/ButterflyBirdSVG';
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

    // Calculate earned points (stars)
    let earnedPoints = 0;
    quiz?.questions.forEach(q => {
      if (finalAnswers[q.id] === q.correct_answer) {
        earnedPoints += (q.points || 10);
      }
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Save Quiz Attempt
        await supabase.from('quiz_attempts').insert({
          quiz_id: quiz!.id,
          user_id: user.id,
          score: percentage,
          answers: finalAnswers,
          completed_at: new Date().toISOString()
        });

        // 2. Update Student Stats (Stars)
        const { data: stats } = await supabase
          .from('student_stats')
          .select('total_stars')
          .eq('user_id', user.id)
          .single();
        
        const currentStars = stats?.total_stars || 0;
        const newTotal = currentStars + earnedPoints;

        await supabase
          .from('student_stats')
          .update({ 
            total_stars: newTotal,
            last_activity_date: new Date().toISOString()
          })
          .eq('user_id', user.id);
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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center shadow-xl">
            <span className="text-4xl">📝</span>
          </div>
          <p className="text-purple-600 font-black text-xl">Loading quiz... ✨</p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-8xl mb-6">🤔</div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">Quiz not found</h2>
        <p className="text-purple-600 font-bold mb-8">This quiz might have been deleted or has no questions.</p>
        <Link href="/student/quizzes" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-black hover:scale-110 transition-all shadow-xl">
          Back to Quizzes 🏠
        </Link>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore(answers);
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-3xl shadow-2xl border-4 border-purple-300 p-8 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <BalloonSVG className="absolute top-4 right-8 w-16 h-20 opacity-40 animate-bounce" color="#FF6B9D" />
          <BalloonSVG className="absolute top-8 right-24 w-12 h-16 opacity-30 animate-bounce" color="#C084FC" style={{ animationDelay: '0.5s' }} />
          <ButterflySVG className="absolute top-12 left-8 w-12 h-12 opacity-50" />
          
          <div className="relative z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white animate-bounce">
              <span className="text-6xl">🎉</span>
            </div>
            
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">Quiz Completed!</h1>
            <p className="text-purple-600 font-bold text-lg mb-8">You did an amazing job on {quiz.title}! ⭐</p>
          
            <div className="flex justify-center gap-6 mb-10">
              <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-300 min-w-[140px]">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-2">{score}/{totalQuestions}</div>
                <div className="text-sm text-purple-600 font-black uppercase">Score 🎯</div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-green-300 min-w-[140px]">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 mb-2">{percentage}%</div>
                <div className="text-sm text-green-600 font-black uppercase">Accuracy ✨</div>
              </div>
            </div>

            <div className="space-y-4 text-left mb-8 max-h-[500px] overflow-y-auto pr-2">
              {quiz.questions.map((q, index) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correct_answer;
                
                return (
                  <div key={q.id} className={`p-5 rounded-2xl border-4 shadow-lg ${isCorrect ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50'}`}>
                    <p className="font-black text-gray-900 mb-3 text-lg">{index + 1}. {q.question_text}</p>
                    <div className="flex justify-between items-center text-sm gap-4">
                      <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        Your answer: <strong className="text-base">{userAnswer}</strong>
                      </span>
                      {!isCorrect && (
                        <span className="text-green-700 font-bold">
                          Correct: <strong className="text-base">{q.correct_answer}</strong>
                        </span>
                      )}
                      {isCorrect ? <CheckCircle size={24} className="text-green-600 flex-shrink-0" /> : <XCircle size={24} className="text-red-600 flex-shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={resetQuiz}
                className="px-8 py-4 rounded-full font-black text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-110 transition-all shadow-xl flex items-center gap-2 border-2 border-white"
              >
                <RefreshCw size={22} />
                Try Again 🔄
              </button>
              <Link 
                href="/student/quizzes"
                className="px-8 py-4 rounded-full font-black text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-110 transition-all shadow-xl border-2 border-white"
              >
                Back to Quizzes 🏠
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 min-h-screen pb-20">
      {/* Colorful Header */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl p-6 mb-8 shadow-lg border-4 border-purple-200 relative overflow-hidden">
        <BalloonSVG className="absolute top-2 right-8 w-12 h-16 opacity-30" color="#FFD93D" />
        <BirdSVG className="absolute top-4 right-24 w-10 h-10 opacity-40" />
        
        <div className="flex items-center justify-between relative z-10">
          <Link href="/student/quizzes" className="p-3 hover:bg-white/60 rounded-full transition-all hover:scale-110 border-2 border-purple-300 bg-white/40">
            <ChevronLeft size={24} className="text-purple-600" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{quiz.title} 📝</h1>
            <p className="text-base text-purple-600 font-bold mt-1">Question {currentQuestionIndex + 1} of {totalQuestions} ✨</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-purple-100 h-4 rounded-full overflow-hidden mb-8 border-2 border-purple-200 shadow-inner">
        <div 
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl border-4 border-purple-200 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <BalloonSVG className="absolute bottom-8 right-8 w-16 h-20 opacity-20" color="#A78BFA" />
        <ButterflySVG className="absolute bottom-12 left-8 w-14 h-14 opacity-20" />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10">{currentQuestion?.question_text}</h2>

          <div className="space-y-4 mb-10">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-5 rounded-2xl border-4 text-left font-bold text-lg transition-all hover:scale-105 shadow-lg ${
                  selectedOption === option
                    ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-purple-200'
                    : 'border-purple-200 hover:border-purple-300 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700'
                }`}
              >
                <span className="font-black text-purple-500 mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!selectedOption || saving}
              className={`px-10 py-4 rounded-full font-black text-xl flex items-center gap-3 transition-all border-4 ${
                selectedOption && !saving
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-110 shadow-2xl border-white hover:shadow-green-300'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
              }`}
            >
              {saving ? '💾 Saving...' : currentQuestionIndex === totalQuestions - 1 ? '🏁 Finish Quiz' : 'Next Question ➡️'}
              {!saving && <ArrowRight size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
