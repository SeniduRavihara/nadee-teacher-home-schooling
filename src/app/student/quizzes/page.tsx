"use client";

import { useData } from "@/context/DataContext";
import { createClient } from "@/utils/supabase/client";
import {
    BookOpen,
    Brain,
    Clock,
    PlayCircle,
    Sparkles,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuizzesPage() {
  const { activeStudent } = useData();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (activeStudent) {
      fetchQuizzes(activeStudent.grade);
    } else {
      setLoading(false);
    }
  }, [activeStudent]);

  const fetchQuizzes = async (grade: string) => {
    try {
      setLoading(true);
      const { data: quizzesData, error } = await supabase
        .from("quizzes")
        .select(
          `
          *,
          questions (count),
          quiz_attempts (
            score,
            completed_at
          )
        `
        )
        .eq("target_grade", grade)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedQuizzes = (quizzesData || []).map((quiz) => {
        // Sort attempts by completed_at desc to get the latest one
        const sortedAttempts = (quiz.quiz_attempts || []).sort(
          (a: any, b: any) =>
            new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        );
        const attempt = sortedAttempts[0];

        const status = attempt ? "Completed" : "Not Started";
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
          borderColor: colors.border,
          emoji: colors.emoji,
        };
      });

      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine colors based on subject - Enhanced with gradients
  const getSubjectColors = (subject: string) => {
    const s = (subject || "").toLowerCase();
    if (s.includes("math"))
      return {
        color: "bg-gradient-to-br from-blue-500 to-cyan-400",
        light: "bg-gradient-to-br from-blue-100 to-cyan-50",
        text: "text-blue-700",
        border: "border-blue-300",
        emoji: "🔢",
      };
    if (s.includes("science"))
      return {
        color: "bg-gradient-to-br from-green-500 to-emerald-400",
        light: "bg-gradient-to-br from-green-100 to-emerald-50",
        text: "text-green-700",
        border: "border-green-300",
        emoji: "🔬",
      };
    if (s.includes("english"))
      return {
        color: "bg-gradient-to-br from-purple-500 to-pink-400",
        light: "bg-gradient-to-br from-purple-100 to-pink-50",
        text: "text-purple-700",
        border: "border-purple-300",
        emoji: "📚",
      };
    if (s.includes("art"))
      return {
        color: "bg-gradient-to-br from-orange-500 to-yellow-400",
        light: "bg-gradient-to-br from-orange-100 to-yellow-50",
        text: "text-orange-700",
        border: "border-orange-300",
        emoji: "🎨",
      };
    return {
      color: "bg-gradient-to-br from-indigo-500 to-purple-400",
      light: "bg-gradient-to-br from-indigo-100 to-purple-50",
      text: "text-indigo-700",
      border: "border-indigo-300",
      emoji: "🧠",
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
            <Sparkles className="text-white" size={32} />
          </div>
          <p className="text-purple-600 font-bold text-lg">
            Loading your quizzes... 🎯
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border-4 border-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="animate-pulse" size={36} />
              <h1 className="text-4xl font-black">Fun Quizzes! 🎯</h1>
            </div>
            <p className="text-white/95 text-lg font-bold">
              Test your knowledge and earn awesome stars! ⭐
            </p>
            <p className="text-white/90 text-sm font-medium mt-1">
              {activeStudent?.grade || 'Grade 1'} • {quizzes.length} Quizzes Available
            </p>
          </div>
          <Trophy className="text-yellow-300 animate-bounce" size={64} />
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-yellow-300/20 rounded-full -mb-8"></div>
        <Sparkles
          className="absolute top-8 right-32 text-yellow-300 animate-pulse"
          size={24}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`bg-white rounded-3xl p-6 shadow-lg border-4 ${quiz.borderColor} hover:shadow-2xl hover:scale-105 transition-all`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-black ${quiz.lightColor} ${quiz.textColor} border-2 ${quiz.borderColor} flex items-center gap-2`}
                >
                  <span>{quiz.emoji}</span>
                  <span>{quiz.subject}</span>
                </div>
                {quiz.status === "Completed" && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-300 to-amber-400 text-yellow-900 font-black px-3 py-2 rounded-full border-2 border-yellow-500 shadow-md">
                    <Trophy size={18} fill="currentColor" />
                    <span>{quiz.score}%</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4 line-clamp-2">
                {quiz.title}
              </h3>

              <div className="flex items-center gap-4 text-gray-700 text-sm mb-6 font-bold">
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full border-2 border-purple-200">
                  <BookOpen size={18} className="text-purple-600" />
                  <span>{quiz.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border-2 border-blue-200">
                  <Clock size={18} className="text-blue-600" />
                  <span>{quiz.time}</span>
                </div>
              </div>

              <Link
                href={`/student/quizzes/${quiz.id}`}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white text-lg transition-all ${quiz.color} hover:scale-105 shadow-md hover:shadow-xl border-2 border-white`}
              >
                <PlayCircle size={24} />
                <span>
                  {quiz.status === "Not Started"
                    ? "Start Quiz! 🚀"
                    : quiz.status === "Completed"
                    ? "Try Again! 🔄"
                    : "Continue! ▶️"}
                </span>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gradient-to-br from-purple-100 to-pink-100 p-12 rounded-3xl text-center border-4 border-purple-200">
            <div className="text-7xl mb-4">🎯</div>
            <h3 className="text-2xl font-black text-purple-700 mb-2">
              No Quizzes Yet!
            </h3>
            <p className="text-purple-600 font-bold">
              Exciting quizzes are coming soon for {activeStudent?.grade}! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
