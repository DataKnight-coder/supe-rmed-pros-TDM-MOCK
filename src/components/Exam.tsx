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

interface ExamProps {
  questions: Question[];
  timeRemaining: number;
  setTimeRemaining: (time: number | ((prev: number) => number)) => void;
  onSubmit: (answers: Record<number, string[]>) => void;
}

export default function Exam({ questions, timeRemaining, setTimeRemaining, onSubmit }: ExamProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmit(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onSubmit, answers, setTimeRemaining]);

  const currentQ = questions[currentIdx];
  const isSMQ = currentQ.type.includes("SMQ");

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionToggle = (optKey: string) => {
    const currentAnswers = answers[currentQ.id] || [];
    let newAnswers: string[];

    if (isSMQ) {
      if (currentAnswers.includes(optKey)) {
        newAnswers = currentAnswers.filter((k) => k !== optKey);
      } else {
        newAnswers = [...currentAnswers, optKey];
      }
    } else {
      newAnswers = [optKey]; // MCQ
    }

    setAnswers({ ...answers, [currentQ.id]: newAnswers });
  };

  const isLastQuestion = currentIdx === questions.length - 1;

  return (
    <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col min-h-[85vh] border border-gray-100 mt-4 sm:mt-8">
      {/* Header / Timer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 flex justify-between items-center sticky top-0 z-20 shadow-md border-b-4 border-red-600">
        <div className="font-extrabold text-xl tracking-wide flex items-center">
          <span className="text-red-500 mr-2">✦</span> Super Med Pros
        </div>
        <div className="flex items-center space-x-3 bg-gray-800 border border-gray-700 px-5 py-2 rounded-lg font-mono text-2xl shadow-inner">
          <svg className="w-6 h-6 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className={`${timeRemaining < 300 ? 'text-red-400 font-bold' : 'text-gray-100'}`}>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2.5 relative">
        <div 
          className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 transition-all duration-500 ease-out absolute left-0 top-0 rounded-r-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-grow p-6 sm:p-12 lg:px-16 bg-white relative">
        <div className="mb-8 flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-4">
            <span className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border border-red-100">
              Question {currentIdx + 1} <span className="text-red-400 mx-1">/</span> {questions.length}
            </span>
          </div>
          <span className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
            {currentQ.type}
          </span>
        </div>

        {/* Case Context */}
        {currentQ.caseContext && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 sm:p-8 mb-10 rounded-r-2xl shadow-sm">
            <h4 className="text-blue-800 font-bold mb-3 flex items-center text-sm uppercase tracking-wider">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Clinical Case
            </h4>
            <p className="text-gray-800 leading-relaxed text-lg">{currentQ.caseContext}</p>
          </div>
        )}

        {/* Question */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {Object.entries(currentQ.options).map(([key, text]) => {
            const isSelected = (answers[currentQ.id] || []).includes(key);
            return (
              <label 
                key={key} 
                className={`group flex items-start p-5 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 transform 
                  ${isSelected 
                    ? 'border-red-600 bg-red-50 shadow-md scale-[1.01]' 
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50 hover:shadow-sm'}`}
              >
                <div className="flex items-center h-6 mt-0.5">
                  <input
                    type={isSMQ ? "checkbox" : "radio"}
                    name={`q-${currentQ.id}`}
                    value={key}
                    checked={isSelected}
                    onChange={() => handleOptionToggle(key)}
                    className={`w-6 h-6 text-red-600 focus:ring-red-500 transition-colors ${isSMQ ? 'rounded cursor-pointer' : 'border-gray-300 cursor-pointer'}`}
                  />
                </div>
                <div className="ml-5 flex items-start">
                  <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm mr-4 transition-colors
                    ${isSelected ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600'}`}>
                    {key}
                  </span>
                  <span className={`text-lg sm:text-xl pt-0.5 ${isSelected ? 'text-red-900 font-bold' : 'text-gray-700 font-medium'}`}>
                    {text}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 p-6 sm:px-12 sm:py-8 flex justify-between items-center border-t border-gray-200">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
        >
          &larr; Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
            className="px-8 py-3 rounded-xl font-bold bg-gray-900 hover:bg-black text-white shadow-lg transition transform hover:-translate-y-0.5 flex items-center"
          >
            Next <span className="ml-2">&rarr;</span>
          </button>
        ) : (
          <button
            onClick={() => onSubmit(answers)}
            className="px-10 py-4 rounded-xl font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-xl transition transform hover:-translate-y-1 animate-bounce"
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
}
