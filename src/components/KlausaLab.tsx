import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, CheckCircle2, XCircle, Box, Info } from 'lucide-react';
import { generateClauseQuestion, ClauseQuestion } from '../services/geminiService';

export default function KlausaLab({ onComplete }: { onComplete?: (pts: number) => void }) {
  const [question, setQuestion] = useState<ClauseQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setShowResult(false);
    try {
      const q = await generateClauseQuestion();
      setQuestion(q);
    } catch (error) {
      console.error("Failed to fetch clause question:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    setShowResult(true);
    if (selectedOption === question?.correct) {
      const pts = 20;
      setScore(s => s + pts);
      onComplete?.(pts);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Lab Klausa</h2>
          <p className="text-slate-400">Bedah kalimat majemuk menjadi klausa-klausa pembentuknya.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total Poin</p>
          <span className="text-3xl font-mono font-bold text-rose-400 leading-none">{score}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lab-card p-20 flex flex-col items-center justify-center space-y-4"
          >
            <Box className="w-10 h-10 text-rose-500 animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Memetakan struktur klausa...</p>
          </motion.div>
        ) : question && (
          <motion.div 
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="lab-card p-8 bg-black/40 border-white/5">
              <p className="text-2xl text-white font-medium mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                "{question.sentence}"
              </p>
              
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Box className="w-4 h-4" /> Komponen Klausa
                </p>
                <div className="flex flex-wrap gap-3">
                  {question.clauses.map((c, i) => (
                    <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm">
                      {c.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lab-card p-8 bg-indigo-900/20 border-indigo-500/30">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Info className="w-5 h-5 text-indigo-400" />
                 {question.question}
               </h3>
               
               <div className="grid grid-cols-1 gap-3">
                  {question.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={showResult}
                      className={`p-5 rounded-xl border transition-all text-left flex items-center gap-4 ${
                        showResult
                          ? idx === question.correct
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : idx === selectedOption
                            ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                            : 'bg-white/5 border-white/10 text-slate-600'
                          : selectedOption === idx
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold ${selectedOption === idx ? 'bg-white/20' : 'bg-white/5'}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1 font-medium">{opt}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex justify-center">
              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedOption === null}
                  className="px-12 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-rose-500/25 disabled:opacity-50"
                >
                  Kirim Jawaban
                </button>
              ) : (
                <button
                  onClick={fetchQuestion}
                  className="px-12 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-3"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Soal Baru
                </button>
              )}
            </div>

            {showResult && (
               <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-4"
             >
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedOption === question.correct ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                 {selectedOption === question.correct ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
               </div>
               <div>
                 <h4 className="font-bold text-white mb-1">Analisis Pengaya</h4>
                 <p className="text-slate-400 text-sm leading-relaxed">{question.explanation}</p>
               </div>
             </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
