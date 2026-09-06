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
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col min-h-[80vh]">
      {/* Header / Timer */}
      <div className="bg-red-600 text-white p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="font-bold text-lg">Super Med Pros TDM Mock</div>
        <div className="flex items-center space-x-2 bg-red-700 px-4 py-2 rounded-full font-mono text-xl shadow-inner">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div 
          className="bg-red-500 h-2 transition-all duration-300" 
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-grow p-6 sm:p-10">
        <div className="mb-6 flex justify-between items-end border-b pb-4">
          <span className="text-gray-500 font-semibold uppercase tracking-wider text-sm">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-bold">
            {currentQ.type}
          </span>
        </div>

        {/* Case Context */}
        {currentQ.caseContext && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-8 rounded-r-lg text-gray-800 leading-relaxed">
            {currentQ.caseContext}
          </div>
        )}

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {Object.entries(currentQ.options).map(([key, text]) => {
            const isSelected = (answers[currentQ.id] || []).includes(key);
            return (
              <label 
                key={key} 
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 
                  ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center h-5">
                  <input
                    type={isSMQ ? "checkbox" : "radio"}
                    name={`q-${currentQ.id}`}
                    value={key}
                    checked={isSelected}
                    onChange={() => handleOptionToggle(key)}
                    className={`w-5 h-5 text-red-600 focus:ring-red-500 ${isSMQ ? 'rounded' : 'border-gray-300'}`}
                  />
                </div>
                <div className="ml-4 flex flex-col">
                  <span className={`font-bold ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>{key}.</span>
                  <span className={`text-lg ${isSelected ? 'text-red-900 font-medium' : 'text-gray-800'}`}>{text}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-200">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-6 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
            className="px-8 py-3 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition transform hover:-translate-y-0.5"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={() => onSubmit(answers)}
            className="px-8 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-md transition transform hover:-translate-y-0.5"
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
}
