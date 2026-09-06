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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {appState === "landing" && (
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl p-8 sm:p-12 text-center mt-12 border-t-8 border-red-600">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            <span className="text-red-600">Super Med Pros</span>
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">TDM Full Mock Exam</h2>
          
          <div className="bg-red-50 p-6 rounded-lg mb-8 text-left border border-red-100">
            <h3 className="text-xl font-bold text-red-800 mb-3">Exam Instructions</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>This mock exam contains <strong>{questionsData.length} questions</strong>.</li>
              <li>You have <strong>180 minutes</strong> to complete the exam.</li>
              <li>Some questions are <strong>MCQ</strong> (select one) and some are <strong>SMQ</strong> (select multiple).</li>
              <li>Feedback and correct answers will <strong>only be shown at the end</strong> of the exam.</li>
            </ul>
          </div>
          
          <button 
            onClick={handleStartExam}
            className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-12 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Exam Now
          </button>
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
