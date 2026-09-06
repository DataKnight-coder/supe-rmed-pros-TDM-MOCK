"use client";

import { useState, useEffect } from "react";
import Exam from "@/components/Exam";
import Results from "@/components/Results";
import questionsData from "../../public/questions.json";

export default function Home() {
  const [appState, setAppState] = useState<"landing" | "exam" | "results">("landing");
  const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(180 * 60); // 180 minutes in seconds

  const handleStartExam = () => {
    setAppState("exam");
    setUserAnswers({});
    setTimeRemaining(180 * 60);
  };

  const handleSubmitExam = (answers: Record<number, string[]>) => {
    setUserAnswers(answers);
    setAppState("results");
  };

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
            <h2 className="text-3xl font-bold text-gray-800 mb-8">TDM Full Mock Exam Simulation</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <h3 className="font-bold text-gray-900">{questionsData.length} Questions</h3>
                <p className="text-sm text-gray-500 mt-2">Comprehensive mix of MCQs and SMQs.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="font-bold text-gray-900">180 Minutes</h3>
                <p className="text-sm text-gray-500 mt-2">Strictly timed to simulate real exam pressure.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="font-bold text-gray-900">Deep Feedback</h3>
                <p className="text-sm text-gray-500 mt-2">Detailed clinical pearls revealed upon completion.</p>
              </div>
            </div>
            
            <button 
              onClick={handleStartExam}
              className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white transition-all duration-200 bg-red-600 rounded-full hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center">
                Begin Simulation
                <svg className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </span>
            </button>
          </div>
        </div>
      )}

      {appState === "exam" && (
        <Exam 
          questions={questionsData as any} 
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          onSubmit={handleSubmitExam} 
        />
      )}

      {appState === "results" && (
        <Results 
          questions={questionsData as any} 
          userAnswers={userAnswers}
          onRetake={() => setAppState("landing")}
        />
      )}
    </main>
  );
}
