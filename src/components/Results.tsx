"use client";

import { useState } from "react";

type Question = {
  id: number;
  caseContext: string;
  question: string;
  type: string;
  options: Record<string, string>;
  correctAnswers: string[];
  explanation: string;
};

interface ResultsProps {
  questions: Question[];
  userAnswers: Record<number, string[]>;
  onRetake: () => void;
}

export default function Results({ questions, userAnswers, onRetake }: ResultsProps) {
  const [filter, setFilter] = useState<"all" | "incorrect">("all");

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const uAns = userAnswers[q.id] || [];
      const isCorrect = 
        uAns.length === q.correctAnswers.length && 
        uAns.every(val => q.correctAnswers.includes(val));
      if (isCorrect) correctCount++;
    });
    return correctCount;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col my-8">
      {/* Header */}
      <div className="bg-gray-900 text-white p-8 text-center border-b-8 border-red-600">
        <h1 className="text-4xl font-extrabold mb-2">Exam Results</h1>
        <div className="text-6xl font-black text-red-500 my-4">{percentage}%</div>
        <p className="text-xl text-gray-300">
          You scored <strong className="text-white">{score}</strong> out of <strong className="text-white">{questions.length}</strong>
        </p>
      </div>

      <div className="p-6 bg-gray-50 flex justify-center space-x-4 border-b">
        <button 
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-full font-bold text-sm transition ${filter === 'all' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200 border'}`}
        >
          Review All Questions
        </button>
        <button 
          onClick={() => setFilter("incorrect")}
          className={`px-6 py-2 rounded-full font-bold text-sm transition ${filter === 'incorrect' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'}`}
        >
          Review Incorrect Only
        </button>
      </div>

      {/* Review Section */}
      <div className="p-6 sm:p-10 space-y-12">
        {questions.map((q, index) => {
          const uAns = userAnswers[q.id] || [];
          const isCorrect = 
            uAns.length === q.correctAnswers.length && 
            uAns.every(val => q.correctAnswers.includes(val));

          if (filter === "incorrect" && isCorrect) return null;

          return (
            <div key={q.id} className={`p-6 rounded-xl border-l-8 shadow-sm bg-white ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-500">Question {index + 1}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>
              
              <p className="text-xl font-bold text-gray-900 mb-6">{q.question}</p>
              
              <div className="space-y-2 mb-6">
                {Object.entries(q.options).map(([key, text]) => {
                  const isUserSelected = uAns.includes(key);
                  const isActuallyCorrect = q.correctAnswers.includes(key);
                  
                  let bgClass = "bg-gray-50 border-gray-200";
                  let textClass = "text-gray-700";
                  let icon = null;

                  if (isActuallyCorrect) {
                    bgClass = "bg-green-50 border-green-400";
                    textClass = "text-green-900 font-medium";
                    icon = <span className="ml-auto text-green-600 font-bold">✓ Correct Answer</span>;
                  } else if (isUserSelected && !isActuallyCorrect) {
                    bgClass = "bg-red-50 border-red-300";
                    textClass = "text-red-900 font-medium";
                    icon = <span className="ml-auto text-red-500 font-bold">✗ Your Selection</span>;
                  }

                  return (
                    <div key={key} className={`flex items-center p-3 border rounded-lg ${bgClass}`}>
                      <span className={`font-bold mr-3 ${textClass}`}>{key}.</span>
                      <span className={textClass}>{text}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-5">
                  <h4 className="flex items-center text-blue-800 font-bold mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Explanation & Feedback
                  </h4>
                  <p className="text-blue-900 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-100 p-8 text-center">
        <button 
          onClick={onRetake}
          className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
