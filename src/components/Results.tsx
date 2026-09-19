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
  examId: "A" | "B" | "C" | "D" | "E";
  questions: Question[];
  userAnswers: Record<number, { answers: string[], flagged: boolean }>;
  onRetake: () => void;
  onBackToHome: () => void;
  isReviewMode?: boolean;
}

export default function Results({ examId, questions, userAnswers, onRetake, onBackToHome, isReviewMode = false }: ResultsProps) {
  const [filter, setFilter] = useState<"all" | "incorrect" | "correct">("all");
  const [scoreSaved, setScoreSaved] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (!scoreSaved && !isReviewMode && questions.length > 0) {
      const savedScores = JSON.parse(localStorage.getItem("supermedpros_scores_" + examId) || "[]");
      savedScores.push({
        date: new Date().toISOString(),
        score,
        total: questions.length,
        percentage,
        answers: userAnswers
      });
      localStorage.setItem("supermedpros_scores_" + examId, JSON.stringify(savedScores));
      setScoreSaved(true);
    }
  }, [score, questions.length, percentage, scoreSaved, examId, isReviewMode, userAnswers]);

  const isQuestionCorrect = (q: Question) => {
    const uAns = userAnswers[q.id]?.answers || [];
    return uAns.length === q.correctAnswers.length && uAns.every((val: string) => q.correctAnswers.includes(val));
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === "incorrect") return !isQuestionCorrect(q);
    if (filter === "correct") return isQuestionCorrect(q);
    return true;
  });

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  const q = filteredQuestions[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 my-8 font-sans h-[90vh]">
      
      {/* Left Sidebar - Grid */}
      <div className="w-full md:w-1/4 flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 h-full">
        <div className="bg-gray-900 text-white p-6 text-center border-b-4 border-red-600 flex-shrink-0">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-300">Score</h2>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 my-2">
            {percentage}%
          </div>
          <p className="text-sm text-gray-400">
            {score} / {questions.length} Correct
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col gap-2 flex-shrink-0">
          <select 
            className="w-full p-2 border border-gray-300 rounded font-bold text-sm bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Review All Questions ({questions.length})</option>
            <option value="incorrect">Incorrect Only ({questions.length - score})</option>
            <option value="correct">Correct Only ({score})</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="grid grid-cols-5 gap-2">
            {filteredQuestions.map((fq, i) => {
              const correct = isQuestionCorrect(fq);
              const isActive = i === currentIndex;
              return (
                <button
                  key={fq.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`
                    h-10 rounded font-bold text-xs flex items-center justify-center transition-all border
                    ${isActive ? 'ring-2 ring-blue-500 transform scale-110 shadow-md' : 'hover:bg-gray-100 opacity-80'}
                    ${correct ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}
                  `}
                  title={correct ? "Correct" : "Incorrect"}
                >
                  {fq.id}
                </button>
              );
            })}
          </div>
          {filteredQuestions.length === 0 && (
            <p className="text-center text-gray-500 mt-10 text-sm">No questions match this filter.</p>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0 flex flex-col gap-2">
          {!isReviewMode && (
            <button 
              onClick={onRetake}
              className="w-full py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 text-sm"
            >
              Retake Exam
            </button>
          )}
          <button 
            onClick={onBackToHome}
            className="w-full py-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-900 text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Right Content - Question Viewer */}
      <div className="w-full md:w-3/4 flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 h-full">
        {q ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${isQuestionCorrect(q) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isQuestionCorrect(q) ? '✓ Correct' : '✗ Incorrect'}
                </span>
                <span className="text-gray-500 font-medium">Question {q.id}</span>
              </div>

              {q.caseContext && q.caseContext.trim() !== "" && (
                <div className="mb-8 p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <h4 className="text-blue-800 font-bold mb-3 uppercase text-sm tracking-wide">Clinical Case Context</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{q.caseContext}</p>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 leading-snug">{q.question}</h3>
              </div>

              <div className="space-y-3 mb-10">
                {Object.entries(q.options).map(([key, value]) => {
                  const uAns = userAnswers[q.id]?.answers || [];
                  const isUserSelected = uAns.includes(key);
                  const isCorrectOption = q.correctAnswers.includes(key);
                  
                  let borderClass = "border-gray-200 bg-white text-gray-700";
                  let icon = null;

                  if (isCorrectOption) {
                    borderClass = "border-green-500 bg-green-50 text-green-900 shadow-sm ring-1 ring-green-500";
                    icon = <span className="text-green-600 font-bold ml-auto flex items-center gap-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Correct</span>;
                  } else if (isUserSelected && !isCorrectOption) {
                    borderClass = "border-red-400 bg-red-50 text-red-900 shadow-sm";
                    icon = <span className="text-red-500 font-bold ml-auto flex items-center gap-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> You Picked</span>;
                  } else if (isUserSelected && isCorrectOption) {
                     icon = <span className="text-green-600 font-bold ml-auto flex items-center gap-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> You Picked (Correct)</span>;
                  }

                  return (
                    <div key={key} className={`flex p-4 rounded-xl border-2 transition-all ${borderClass}`}>
                      <span className="font-bold mr-4 w-6">{key}.</span>
                      <span className="flex-1 leading-relaxed">{value}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-xl mt-6">
                <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wide text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Explanation
                </h4>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                  {q.explanation}
                </div>
              </div>
            </div>
            
            {/* Bottom Navigation */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-6 py-2 bg-white border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Previous
              </button>
              <span className="text-gray-500 font-medium text-sm">
                {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <button 
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="px-6 py-2 bg-white border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-10">
            <p className="text-gray-500">No questions to display.</p>
          </div>
        )}
      </div>

    </div>
  );
}
