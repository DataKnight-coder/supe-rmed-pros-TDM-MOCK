"use client";

import { useState, useEffect } from "react";

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
  userAnswers: Record<number, { answers: string[], flagged: boolean }>;
  onRetake: () => void;
}

export default function Results({ questions, userAnswers, onRetake }: ResultsProps) {
  const [filter, setFilter] = useState<"all" | "incorrect" | "flagged">("all");
  const [scoreSaved, setScoreSaved] = useState(false);

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const uAns = userAnswers[q.id]?.answers || [];
      const isCorrect = 
        uAns.length === q.correctAnswers.length && 
        uAns.every((val: string) => q.correctAnswers.includes(val));
      if (isCorrect) correctCount++;
    });
    return correctCount;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    if (!scoreSaved) {
      const savedScores = JSON.parse(localStorage.getItem("supermedpros_scores") || "[]");
      savedScores.push({
        date: new Date().toISOString(),
        score,
        total: questions.length,
        percentage
      });
      localStorage.setItem("supermedpros_scores", JSON.stringify(savedScores));
      setScoreSaved(true);
    }
  }, [score, questions.length, percentage, scoreSaved]);

  return (
    <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col my-8 sm:my-12 font-sans border border-gray-100">
      {/* Header */}
      <div className="bg-gray-900 text-white p-10 sm:p-16 text-center border-b-8 border-red-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-300 uppercase tracking-widest relative z-10">Simulation Results</h1>
        <div className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 my-6 drop-shadow-lg relative z-10">
          {percentage}%
        </div>
        <p className="text-2xl text-gray-300 relative z-10">
          You scored <strong className="text-white">{score}</strong> out of <strong className="text-white">{questions.length}</strong>
        </p>
      </div>

      <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-center items-center gap-4 border-b border-gray-200">
        <button 
          onClick={() => setFilter("all")}
          className={`px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 w-full sm:w-auto ${filter === 'all' ? 'bg-gray-900 text-white shadow-lg transform -translate-y-0.5' : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-300 shadow-sm'}`}
        >
          Review All
        </button>
        <button 
          onClick={() => setFilter("incorrect")}
          className={`px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 w-full sm:w-auto flex items-center justify-center ${filter === 'incorrect' ? 'bg-red-600 text-white shadow-lg transform -translate-y-0.5' : 'bg-white text-red-600 hover:bg-red-50 border border-red-200 shadow-sm'}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Incorrect Only
        </button>
        <button 
          onClick={() => setFilter("flagged")}
          className={`px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 w-full sm:w-auto flex items-center justify-center ${filter === 'flagged' ? 'bg-yellow-500 text-white shadow-lg transform -translate-y-0.5' : 'bg-white text-yellow-600 hover:bg-yellow-50 border border-yellow-300 shadow-sm'}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
          Flagged Only
        </button>
      </div>

      {/* Review Section */}
      <div className="p-6 sm:p-12 space-y-12 bg-gray-50">
        {questions.map((q, index) => {
          const uState = userAnswers[q.id] || { answers: [], flagged: false };
          const uAns = uState.answers;
          const isFlagged = uState.flagged;
          const isCorrect = 
            uAns.length === q.correctAnswers.length && 
            uAns.every(val => q.correctAnswers.includes(val));

          if (filter === "incorrect" && isCorrect) return null;
          if (filter === "flagged" && !isFlagged) return null;

          return (
            <div key={q.id} className={`p-8 rounded-2xl border border-gray-200 shadow-lg bg-white relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-2 h-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
              
              <div className="flex justify-between items-center mb-6 pl-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-extrabold text-xl text-gray-400 tracking-wider">QUESTION {index + 1}</h3>
                  {isFlagged && (
                    <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                      Flagged
                    </span>
                  )}
                </div>
                <span className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest shadow-sm ${isCorrect ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>
              
              <p className="text-2xl font-bold text-gray-900 mb-8 pl-4 leading-relaxed">{q.question}</p>
              
              <div className="space-y-3 mb-8 pl-4">
                {Object.entries(q.options).map(([key, text]) => {
                  const isUserSelected = uAns.includes(key);
                  const isActuallyCorrect = q.correctAnswers.includes(key);
                  
                  let bgClass = "bg-gray-50 border-gray-100 opacity-60";
                  let textClass = "text-gray-600";
                  let badge = null;

                  if (isActuallyCorrect) {
                    bgClass = "bg-green-50 border-green-400 shadow-sm ring-1 ring-green-400 opacity-100";
                    textClass = "text-green-900 font-bold";
                    badge = <span className="ml-auto bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> Correct</span>;
                  } else if (isUserSelected && !isActuallyCorrect) {
                    bgClass = "bg-red-50 border-red-300 ring-1 ring-red-300 opacity-100";
                    textClass = "text-red-900 font-bold";
                    badge = <span className="ml-auto bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg> You Picked</span>;
                  }

                  return (
                    <div key={key} className={`flex items-center p-4 border-2 rounded-xl transition-all ${bgClass}`}>
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 text-sm ${isActuallyCorrect ? 'bg-green-200 text-green-800' : isUserSelected ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-500'}`}>
                        {key}
                      </span>
                      <span className={`text-lg ${textClass}`}>{text}</span>
                      {badge}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="mt-8 ml-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 sm:p-8 shadow-inner">
                  <h4 className="flex items-center text-indigo-900 font-extrabold mb-4 uppercase tracking-widest text-sm">
                    <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Clinical Pearl & Feedback
                  </h4>
                  <p className="text-indigo-900/90 leading-relaxed text-lg font-medium">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white p-10 text-center border-t border-gray-200">
        <button 
          onClick={onRetake}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg py-4 px-12 rounded-full shadow-xl transition transform hover:-translate-y-1 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
