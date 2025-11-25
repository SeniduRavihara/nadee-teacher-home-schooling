'use client';

import { ArrowRight, CheckCircle, ChevronLeft, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock Data - In a real app, fetch based on quizId
const quizData = {
  id: 1,
  title: 'Math Adventure: Grade 3',
  questions: [
    {
      id: 1,
      question: 'What is 5 + 7?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '12'
    },
    {
      id: 2,
      question: 'Which shape has 3 sides?',
      options: ['Square', 'Circle', 'Triangle', 'Rectangle'],
      correctAnswer: 'Triangle'
    },
    {
      id: 3,
      question: 'What is 3 x 4?',
      options: ['7', '12', '9', '15'],
      correctAnswer: '12'
    },
    {
      id: 4,
      question: 'If you have 10 apples and eat 3, how many are left?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '7'
    },
    {
      id: 5,
      question: 'What comes next: 2, 4, 6, __?',
      options: ['7', '8', '9', '10'],
      correctAnswer: '8'
    }
  ]
};

export default function QuizPlayerPage({ params }: { params: { quizId: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      setAnswers({ ...answers, [currentQuestion.id]: selectedOption });
      
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / totalQuestions) * 100;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-gray-500 mb-8">You did a great job on {quizData.title}</p>
          
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
            {quizData.questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                  <p className="font-bold text-gray-900 mb-2">{index + 1}. {q.question}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      Your answer: <strong>{userAnswer}</strong>
                    </span>
                    {!isCorrect && (
                      <span className="text-green-700">
                        Correct: <strong>{q.correctAnswer}</strong>
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
          <h1 className="text-xl font-bold text-gray-900">{quizData.title}</h1>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion.question}</h2>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option) => (
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
            disabled={!selectedOption}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              selectedOption
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
