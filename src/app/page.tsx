"use client";

import { useState, useEffect } from "react";
import Exam from "@/components/Exam";
import Results from "@/components/Results";
import questionsDataA from "../../public/questions.json";
import questionsDataB from "../../public/questions-b.json";
import questionsDataC from "../../public/questions-c.json";
import questionsDataD from "../../public/questions-d.json";
import questionsDataE from "../../public/questions-e.json";

export default function Home() {
  const [appState, setAppState] = useState<"landing" | "exam" | "results">("landing");
  const [currentExamId, setCurrentExamId] = useState<"A" | "B" | "C" | "D" | "E">("A");
  const [userAnswers, setUserAnswers] = useState<Record<number, { answers: string[], flagged: boolean }>>({});
  const [timeRemaining, setTimeRemaining] = useState(180 * 60);

  const [historicalScoresA, setHistoricalScoresA] = useState<{date: string, score: number, total: number, percentage: number}[]>([]);
  const [historicalScoresB, setHistoricalScoresB] = useState<{date: string, score: number, total: number, percentage: number}[]>([]);
  const [historicalScoresC, setHistoricalScoresC] = useState<{date: string, score: number, total: number, percentage: number}[]>([]);
  const [historicalScoresD, setHistoricalScoresD] = useState<{date: string, score: number, total: number, percentage: number}[]>([]);
  const [historicalScoresE, setHistoricalScoresE] = useState<{date: string, score: number, total: number, percentage: number}[]>([]);
  
  const [hasSavedSessionA, setHasSavedSessionA] = useState(false);
  const [hasSavedSessionB, setHasSavedSessionB] = useState(false);
  const [hasSavedSessionC, setHasSavedSessionC] = useState(false);
  const [hasSavedSessionD, setHasSavedSessionD] = useState(false);
  const [hasSavedSessionE, setHasSavedSessionE] = useState(false);

  // Premium Unlock State
  const [unlockedMocks, setUnlockedMocks] = useState({ C: false, D: false, E: false });
  const [unlockModalExam, setUnlockModalExam] = useState<"C" | "D" | "E" | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [unlockError, setUnlockError] = useState(false);

  useEffect(() => {
    const sA = localStorage.getItem("supermedpros_scores_A");
    if (sA) setHistoricalScoresA(JSON.parse(sA));
    const sB = localStorage.getItem("supermedpros_scores_B");
    if (sB) setHistoricalScoresB(JSON.parse(sB));
    const sC = localStorage.getItem("supermedpros_scores_C");
    if (sC) setHistoricalScoresC(JSON.parse(sC));
    const sD = localStorage.getItem("supermedpros_scores_D");
    if (sD) setHistoricalScoresD(JSON.parse(sD));
    const sE = localStorage.getItem("supermedpros_scores_E");
    if (sE) setHistoricalScoresE(JSON.parse(sE));
    
    if (localStorage.getItem("supermedpros_active_exam_A")) setHasSavedSessionA(true);
    if (localStorage.getItem("supermedpros_active_exam_B")) setHasSavedSessionB(true);
    if (localStorage.getItem("supermedpros_active_exam_C")) setHasSavedSessionC(true);
    if (localStorage.getItem("supermedpros_active_exam_D")) setHasSavedSessionD(true);
    if (localStorage.getItem("supermedpros_active_exam_E")) setHasSavedSessionE(true);

    const uC = localStorage.getItem("supermedpros_unlocked_C");
    const uD = localStorage.getItem("supermedpros_unlocked_D");
    const uE = localStorage.getItem("supermedpros_unlocked_E");
    setUnlockedMocks({
      C: uC === "true",
      D: uD === "true",
      E: uE === "true",
    });
  }, [appState]);

  const handleStartExam = (examId: "A" | "B" | "C" | "D" | "E", resume: boolean = false) => {
    // Check Premium Access
    if (examId === "C" && !unlockedMocks.C) { setUnlockModalExam("C"); return; }
    if (examId === "D" && !unlockedMocks.D) { setUnlockModalExam("D"); return; }
    if (examId === "E" && !unlockedMocks.E) { setUnlockModalExam("E"); return; }

    setCurrentExamId(examId);
    if (!resume) {
      localStorage.removeItem("supermedpros_active_exam_" + examId);
      setUserAnswers({});
      setTimeRemaining(180 * 60);
    }
    setAppState("exam");
  };

  const handleUnlock = () => {
    const code = accessCodeInput.trim().toUpperCase();
    if (unlockModalExam === "C" && code === "SUPERMED3") {
      setUnlockedMocks(prev => ({...prev, C: true}));
      localStorage.setItem("supermedpros_unlocked_C", "true");
      setUnlockModalExam(null); setAccessCodeInput(""); setUnlockError(false);
    } else if (unlockModalExam === "D" && code === "SUPERMED4") {
      setUnlockedMocks(prev => ({...prev, D: true}));
      localStorage.setItem("supermedpros_unlocked_D", "true");
      setUnlockModalExam(null); setAccessCodeInput(""); setUnlockError(false);
    } else if (unlockModalExam === "E" && code === "SUPERMED5") {
      setUnlockedMocks(prev => ({...prev, E: true}));
      localStorage.setItem("supermedpros_unlocked_E", "true");
      setUnlockModalExam(null); setAccessCodeInput(""); setUnlockError(false);
    } else {
      setUnlockError(true);
    }
  };

  const handleSubmitExam = (answers: Record<number, { answers: string[], flagged: boolean }>) => {
    setUserAnswers(answers);
    setAppState("results");
    localStorage.removeItem("supermedpros_active_exam_" + currentExamId);
    if (currentExamId === "A") setHasSavedSessionA(false);
    if (currentExamId === "B") setHasSavedSessionB(false);
    if (currentExamId === "C") setHasSavedSessionC(false);
    if (currentExamId === "D") setHasSavedSessionD(false);
    if (currentExamId === "E") setHasSavedSessionE(false);
  };

  const getQuestions = () => {
    if (currentExamId === "A") return questionsDataA as any;
    if (currentExamId === "B") return questionsDataB as any;
    if (currentExamId === "C") return questionsDataC as any;
    if (currentExamId === "D") return questionsDataD as any;
    if (currentExamId === "E") return questionsDataE as any;
    return [];
  };

  const questions = getQuestions();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative">
      
      {/* Premium Unlock Modal */}
      {unlockModalExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => { setUnlockModalExam(null); setAccessCodeInput(""); setUnlockError(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Unlock Mock Exam {unlockModalExam === "C" ? "3" : unlockModalExam === "D" ? "4" : "5"}</h2>
              <p className="text-gray-600 mt-2">This is a premium exam.</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 text-sm text-gray-700">
              <p className="mb-3">To gain access, please send an <strong>Interac e-Transfer</strong> of <strong>$49.99 CAD</strong> to:</p>
              <div className="bg-white p-3 rounded border border-gray-300 font-mono text-center font-bold text-red-700 text-lg mb-3 shadow-sm select-all">
                supermedpros@gmail.com
              </div>
              <p className="text-xs text-gray-500 text-center">Once we receive your transfer, we will reply with your access code.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
                <input 
                  type="text"
                  value={accessCodeInput}
                  onChange={(e) => { setAccessCodeInput(e.target.value); setUnlockError(false); }}
                  placeholder="Enter your code here..."
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all ${unlockError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'}`}
                />
                {unlockError && <p className="text-red-500 text-xs mt-1">Invalid code. Please try again.</p>}
              </div>
              <button 
                onClick={handleUnlock}
                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                Unlock Now
              </button>
            </div>
          </div>
        </div>
      )}

      {appState === "landing" && (
        <div className="max-w-7xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all">
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {/* Exam A */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50 flex flex-col relative">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl shadow-sm">FREE</div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Mock Exam 1</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">140 Questions (MCQ & SMQ) | 180 Minutes</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleStartExam("A", false)} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-full hover:bg-red-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-sm">
                    Start New
                  </button>
                  {hasSavedSessionA && (
                    <button onClick={() => handleStartExam("A", true)} className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-4 rounded-full hover:bg-red-50 hover:shadow-md transition-all duration-200 text-sm">
                      Resume Saved
                    </button>
                  )}
                </div>
              </div>

              {/* Exam B */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50 flex flex-col relative">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl shadow-sm">FREE</div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Mock Exam 2</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">140 Questions (MCQ & SMQ) | 180 Minutes</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleStartExam("B", false)} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-full hover:bg-red-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-sm">
                    Start New
                  </button>
                  {hasSavedSessionB && (
                    <button onClick={() => handleStartExam("B", true)} className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-4 rounded-full hover:bg-red-50 hover:shadow-md transition-all duration-200 text-sm">
                      Resume Saved
                    </button>
                  )}
                </div>
              </div>
              
              {/* Exam C */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50 flex flex-col relative">
                {!unlockedMocks.C && <div className="absolute top-0 right-0 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1 shadow-sm"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg> PREMIUM</div>}
                {unlockedMocks.C && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl shadow-sm">UNLOCKED</div>}
                <h3 className="text-xl font-bold text-red-700 mb-2">Mock Exam 3</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">140 Questions (MCQ & SMQ) | 180 Minutes</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleStartExam("C", false)} className={`w-full text-white text-sm font-bold py-3 px-4 rounded-full hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${unlockedMocks.C ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-900 flex items-center justify-center gap-2'}`}>
                    {!unlockedMocks.C && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                    {unlockedMocks.C ? 'Start New' : 'Unlock Exam'}
                  </button>
                  {hasSavedSessionC && unlockedMocks.C && (
                    <button onClick={() => handleStartExam("C", true)} className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-4 rounded-full hover:bg-red-50 hover:shadow-md transition-all duration-200 text-sm">
                      Resume Saved
                    </button>
                  )}
                </div>
              </div>

              {/* Exam D */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50 flex flex-col relative">
                {!unlockedMocks.D && <div className="absolute top-0 right-0 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1 shadow-sm"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg> PREMIUM</div>}
                {unlockedMocks.D && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl shadow-sm">UNLOCKED</div>}
                <h3 className="text-xl font-bold text-red-700 mb-2">Mock Exam 4</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">Coming Soon</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleStartExam("D", false)} className={`w-full text-white text-sm font-bold py-3 px-4 rounded-full hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${unlockedMocks.D ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-900 flex items-center justify-center gap-2'}`}>
                    {!unlockedMocks.D && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                    {unlockedMocks.D ? 'Start New' : 'Unlock Exam'}
                  </button>
                  {hasSavedSessionD && unlockedMocks.D && (
                    <button onClick={() => handleStartExam("D", true)} className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-4 rounded-full hover:bg-red-50 hover:shadow-md transition-all duration-200 text-sm">
                      Resume Saved
                    </button>
                  )}
                </div>
              </div>

              {/* Exam E */}
              <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50 flex flex-col relative">
                {!unlockedMocks.E && <div className="absolute top-0 right-0 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1 shadow-sm"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg> PREMIUM</div>}
                {unlockedMocks.E && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl shadow-sm">UNLOCKED</div>}
                <h3 className="text-xl font-bold text-red-700 mb-2">Mock Exam 5</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">140 Questions (MCQ & SMQ) | 180 Minutes</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleStartExam("E", false)} className={`w-full text-white text-sm font-bold py-3 px-4 rounded-full hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${unlockedMocks.E ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-900 flex items-center justify-center gap-2'}`}>
                    {!unlockedMocks.E && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                    {unlockedMocks.E ? 'Start New' : 'Unlock Exam'}
                  </button>
                  {hasSavedSessionE && unlockedMocks.E && (
                    <button onClick={() => handleStartExam("E", true)} className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-4 rounded-full hover:bg-red-50 hover:shadow-md transition-all duration-200 text-sm">
                      Resume Saved
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 text-left bg-gray-50 p-8 rounded-xl border border-gray-100 overflow-x-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                Your Past Scores
              </h3>
              <div className="flex gap-6 min-w-max">
                <div className="w-48">
                  <h4 className="font-bold text-gray-600 mb-3">Mock 1</h4>
                  {historicalScoresA.length > 0 ? (
                    <div className="space-y-3">
                      {historicalScoresA.slice().reverse().map((score, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <span className="text-gray-600 text-sm">{new Date(score.date).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">{score.score}/{score.total} <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] text-white ${score.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>{score.percentage}%</span></span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 italic text-sm">No scores yet.</p>}
                </div>
                <div className="w-48">
                  <h4 className="font-bold text-gray-600 mb-3">Mock 2</h4>
                  {historicalScoresB.length > 0 ? (
                    <div className="space-y-3">
                      {historicalScoresB.slice().reverse().map((score, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <span className="text-gray-600 text-sm">{new Date(score.date).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">{score.score}/{score.total} <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] text-white ${score.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>{score.percentage}%</span></span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 italic text-sm">No scores yet.</p>}
                </div>
                <div className="w-48">
                  <h4 className="font-bold text-gray-600 mb-3">Mock 3</h4>
                  {historicalScoresC.length > 0 ? (
                    <div className="space-y-3">
                      {historicalScoresC.slice().reverse().map((score, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <span className="text-gray-600 text-sm">{new Date(score.date).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">{score.score}/{score.total} <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] text-white ${score.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>{score.percentage}%</span></span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 italic text-sm">No scores yet.</p>}
                </div>
                <div className="w-48">
                  <h4 className="font-bold text-gray-600 mb-3">Mock 4</h4>
                  {historicalScoresD.length > 0 ? (
                    <div className="space-y-3">
                      {historicalScoresD.slice().reverse().map((score, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <span className="text-gray-600 text-sm">{new Date(score.date).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">{score.score}/{score.total} <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] text-white ${score.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>{score.percentage}%</span></span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 italic text-sm">No scores yet.</p>}
                </div>
                <div className="w-48">
                  <h4 className="font-bold text-gray-600 mb-3">Mock 5</h4>
                  {historicalScoresE.length > 0 ? (
                    <div className="space-y-3">
                      {historicalScoresE.slice().reverse().map((score, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <span className="text-gray-600 text-sm">{new Date(score.date).toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">{score.score}/{score.total} <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] text-white ${score.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>{score.percentage}%</span></span>
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
