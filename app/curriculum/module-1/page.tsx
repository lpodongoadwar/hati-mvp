"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function Module1Page() {
  const supabase = createClient();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const quizQuestions = [
    {
      question: "What percentage of Ugandans borrow informally (from friends, family, or unregulated lenders)?",
      options: ["20%", "50%", "77%"],
      correct: 2, // Index of "77%"
    },
    {
      question: "Why do traditional banks usually reject informal sector borrowers?",
      options: ["They don't like youth", "They lack traditional collateral and formal credit history", "They have too much money"],
      correct: 1,
    },
    {
      question: "What is the main danger of borrowing from predatory money lenders?",
      options: ["High interest rates trap you in a cycle of debt", "They report you to the Bank of Uganda", "They give you free money"],
      correct: 0,
    }
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const saveProgressAndReturn = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 1. Fetch current completed modules
      const { data } = await supabase
        .from("profiles")
        .select("completed_modules")
        .eq("id", user.id)
        .single();
      
      const currentModules = data?.completed_modules || [];
      
      // 2. Add module-1 to the array if it's not already there
      if (!currentModules.includes("module-1")) {
        await supabase
          .from("profiles")
          .update({ completed_modules: [...currentModules, "module-1"] })
          .eq("id", user.id);
      }
    }
    setIsSaving(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/curriculum" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Curriculum
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <p className="text-sm font-semibold text-[#1b4a3a] uppercase tracking-wider mb-2">Module 1</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">The Status Quo</h1>
          <p className="mt-2 text-lg text-gray-600">Understanding the credit gap in Uganda.</p>
        </div>

        {/* Lesson Content */}
        <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm prose prose-sm max-w-none text-gray-700">
          <p>
            East Africa has one of the fastest-growing populations in the world. Every year, millions of young people graduate from universities and technical schools, eager to start businesses and build their futures.
          </p>
          <p>
            But the financial system is not built for them. 
          </p>
          <p>
            In Uganda, <strong>over 77% of people borrow money informally</strong>. This means they rely on friends, family, or unregulated money lenders when they need capital. Why? Because traditional banks require collateral—like land, a car, or a formal payslip—that most young people and informal workers simply do not have.
          </p>
          <p>
            When you cannot access formal credit, you are forced into the informal market. And while informal lenders can be helpful in an emergency, they often charge exorbitant interest rates. A small loan can quickly turn into a debt trap that consumes your entire income, leaving you worse off than when you started.
          </p>
          <p className="font-semibold text-foreground">
            The core problem isn't that young Ugandans are bad with money. The problem is that they have no way to prove their financial discipline to formal lenders. They are invisible to the system.
          </p>
        </section>

        {/* Quiz Section */}
        {!showQuiz ? (
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setShowQuiz(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-8 py-3 text-lg font-semibold text-white hover:bg-[#153a2e] transition-colors"
            >
              <HelpCircle className="size-5" /> Take the Module Quiz
            </button>
          </div>
        ) : (
          <section className="bg-[#fcfaf6] p-8 rounded-2xl border border-[#e5e1d8] shadow-sm space-y-6">
            {!quizFinished ? (
              <>
                <div className="flex items-center justify-between border-b border-[#e5e1d8] pb-4 mb-4">
                  <h3 className="text-xl font-bold text-[#1b4a3a]">Knowledge Check</h3>
                  <span className="text-sm font-medium text-gray-500">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                </div>
                
                <p className="text-lg font-medium text-foreground mb-4">{quizQuestions[currentQuestion].question}</p>
                
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${
                        selectedAnswer === index 
                          ? index === quizQuestions[currentQuestion].correct 
                            ? 'bg-green-100 border-green-500 text-green-900' 
                            : 'bg-red-100 border-red-500 text-red-900'
                          : 'bg-white border-gray-200 hover:border-[#1b4a3a]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={nextQuestion}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-6 py-2 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors"
                    >
                      {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"} <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* THE FIXED SUCCESS SCREEN */
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="size-16 text-[#1b4a3a] mx-auto" />
                <h3 className="text-2xl font-bold text-foreground">Quiz Complete!</h3>
                <p className="text-gray-600">
                  You scored <strong>{score} out of {quizQuestions.length}</strong>.
                </p>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Great job! You have successfully completed Module 1. You can now unlock the next module.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                  <Link 
                    href="/curriculum" 
                    onClick={saveProgressAndReturn}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-8 py-3 text-lg font-semibold text-white hover:bg-[#153a2e] transition-colors"
                  >
                    {isSaving ? "Saving..." : "Go to Next Module"} <ChevronRight className="size-5" />
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}