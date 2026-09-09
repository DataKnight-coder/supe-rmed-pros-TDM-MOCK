"use client";

import { useState, useEffect } from "react";
import Exam from "@/components/Exam";
import Results from "@/components/Results";
import questionsDataA from "../../public/questions.json";
import questionsDataB from "../../public/questions-b.json";

export default function Home() {
  const [appState, setAppState] = useState<"landing" | "exam" | "results">("landing");
  const [currentExamId, setCurrentExamId] = useState<"A" | "B">("A");
  const [userAnswers, setUserAnswers] = useState<Record<number, { answers: string[], flagged: boolean }>>({});
  const [timeRemaining, setTimeRemaining] = useState(180 * 60);

  const [historicalScoresA, setHistoricalScoresA] = useState<{date: string, score: number, total: number, percentage: number}[]>([]);
  const [historicalScoresB, setHistoricalScoresB] = useState<{date: string, score: number, total: number, percentage: number}[]>([]);
  const [hasSavedSessionA, setHasSavedSessionA] = useState(false);
  const [hasSavedSessionB, setHasSavedSessionB] = useState(false);

  useEffect(() => {
    const savedScoresA = localStorage.getItem("supermedpros_scores_A");
    if (savedScoresA) setHistoricalScoresA(JSON.parse(savedScoresA));
    
    const savedScoresB = localStorage.getItem("supermedpros_scores_B");
    if (savedScoresB) setHistoricalScoresB(JSON.parse(savedScoresB));
    
    const activeSessionA = localStorage.getItem("supermedpros_active_exam_A");
    if (activeSessionA) setHasSavedSessionA(true);
    
    const activeSessionB = localStorage.getItem("supermedpros_active_exam_B");
    if (activeSessionB) setHasSavedSessionB(true);
  }, [appState]);

  const handleStartExam = (examId: "A" | "B", resume: boolean = false) => {
    setCurrentExamId(examId);
    if (!resume) {
      localStorage.removeItem("supermedpros_active_exam_" + examId);
      setUserAnswers({});
      setTimeRemaining(180 * 60);
    }
    setAppState("exam");
  };

  const handleSubmitExam = (answers: Record<number, { answers: string[], flagged: boolean }>) => {
    setUserAnswers(answers);
    setAppState("results");
    localStorage.removeItem("supermedpros_active_exam_" + currentExamId);
    if (currentExamId === "A") setHasSavedSessionA(false);
    if (currentExamId === "B") setHasSavedSessionB(false);
  };

  const questions = currentExamId === "A" ? (questionsDataA as any) : (questionsDataB as any);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      {appState === "landing" && (
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg relative z-10">
              Super Med Pros
            </h1>
            <p className="text-red-100 text-xl font-medium tracking-wide relative z-10">
              Canada&apos;s Premier Medical Licensure Preparation
            </p>
          </div>

          <div className="p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">TDM Full Mock Exam Simulations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50">
                <h3 className="text-2xl font-bold text-red-700 mb-2">Mock Exam 1</h3>
                <p className="text-gray-600 mb-6">140 Questions (MCQ & SMQ) | 180 Minutes</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleStartExam("A", false)} className="w-full bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                    Start New Exam 1
                  </button>
                  {hasSavedSessionA && (
                    <button onClick={() => handleStartExam("A", true)} className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-8 rounded-full hover:bg-red-50 hover:shadow-md transition-all duration-200">
                      Resume Saved Exam 1
                    </button>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50">
                <h3 className="text-2xl font-bold text-red-700 mb-2">Mock Exam 2</h3>
                <p className="text-gray-600 mb-6">140 Questions (MCQ & SMQ) | 180 Minutes</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleStartExam("B", false)} className="w-full bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                    Start New Exam 2
                  </button>
                  {hasSavedSessionB && (
                    <button onClick={() => handleStartExam("B", true)} className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-8 rounded-full hover:bg-red-50 hover:shadow-md transition-all duration-200">
                      Resume Saved Exam 2
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 text-left bg-gray-50 p-8 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                Your Past Scores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-600 mb-3">Mock 1 History</h4>
                  {historicalScoresA.length > 0 ? (
                    <div className="space-y-3">
                      {historicalScoresA.slice().reverse().map((score, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <span className="text-gray-600 text-sm">{new Date(score.date).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">{score.score} / {score.total} <span className={`ml-2 px-2 py-0.5 rounded text-xs text-white ${score.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>{score.percentage}%</span></span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 italic text-sm">No scores yet.</p>}
                </div>
                <div>
                  <h4 className="font-bold text-gray-600 mb-3">Mock 2 History</h4>
                  {historicalScoresB.length > 0 ? (
                    <div className="space-y-3">
                      {historicalScoresB.slice().reverse().map((score, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <span className="text-gray-600 text-sm">{new Date(score.date).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">{score.score} / {score.total} <span className={`ml-2 px-2 py-0.5 rounded text-xs text-white ${score.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>{score.percentage}%</span></span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 italic text-sm">No scores yet.</p>}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {appState === "exam" && (
        <Exam 
          examId={currentExamId}
          questions={questions}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          onSubmit={handleSubmitExam}
        />
      )}

      {appState === "results" && (
        <Results 
          examId={currentExamId}
          questions={questions} 
          userAnswers={userAnswers} 
          onRetake={() => handleStartExam(currentExamId, false)} 
        />
      )}
    </main>
  );
}
