import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, CheckCircle2, XCircle, Search, Layers } from 'lucide-react';
import { generatePhraseQuestion, PhraseQuestion } from '../services/geminiService';

export default function FrasaLab({ onComplete }: { onComplete?: (pts: number) => void }) {
  const [question, setQuestion] = useState<PhraseQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setShowResult(false);
    try {
      const q = await generatePhraseQuestion();
      setQuestion(q);
    } catch (error) {
      console.error("Failed to fetch phrase question:", error);
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
      const pts = 15;
      setScore(s => s + pts);
      onComplete?.(pts);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Lab Frasa</h2>
          <p className="text-slate-400">Bedah struktur kata menjadi unit makna yang lebih besar.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Poin Analisis</p>
          <span className="text-3xl font-mono font-bold text-amber-400 leading-none">{score}</span>
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
            <Layers className="w-10 h-10 text-amber-500 animate-bounce" />
            <p className="text-slate-400 font-medium animate-pulse">Menghasilkan konstruksi frasa...</p>
          </motion.div>
        ) : question && (
          <motion.div 
            key="question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="lab-card p-8 bg-white/5 border-white/10">
               <div className="flex items-center gap-3 mb-4 text-amber-400">
                <Search className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Analisis Kalimat</span>
              </div>
              <p className="text-xl text-slate-300 mb-8 italic">"{question.sentence}"</p>
              
              <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                 <p className="text-sm text-amber-500 font-bold uppercase tracking-widest mb-2">Apa jenis frasa ini?</p>
                 <p className="text-3xl font-bold text-white tracking-tight">{question.phrase}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
                    showResult
                      ? idx === question.correct
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : idx === selectedOption
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-white/5 border-white/10 text-slate-600'
                      : selectedOption === idx
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-white/5 border-white/10 text-white hover:border-white/20'
                  }`}
                >
                  <span className="font-bold text-lg">{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedOption === null}
                  className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-amber-500/25 flex items-center gap-3 disabled:opacity-50"
                >
                  Identifikasi
                </button>
              ) : (
                <button
                  onClick={fetchQuestion}
                  className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-3"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Kalimat Baru
                </button>
              )}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-3">
                   {selectedOption === question.correct ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
                   <h4 className="font-bold text-white">Penjelasan Linguistik</h4>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
