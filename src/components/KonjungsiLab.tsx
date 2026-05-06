import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, CheckCircle2, XCircle, HelpCircle, Send } from 'lucide-react';
import { generateConjunctionQuestion, ConjunctionQuestion } from '../services/geminiService';

export default function KonjungsiLab({ onComplete }: { onComplete?: (pts: number) => void }) {
  const [question, setQuestion] = useState<ConjunctionQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setShowResult(false);
    try {
      const q = await generateConjunctionQuestion();
      setQuestion(q);
    } catch (error) {
      console.error("Failed to fetch conjunction question:", error);
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
      const pts = 10;
      setScore(s => s + pts);
      onComplete?.(pts);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Lab Konjungsi</h2>
          <p className="text-slate-400">Hubungkan gagasan dengan kata penghubung yang tepat.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Skor Kamu</p>
          <span className="text-3xl font-mono font-bold text-emerald-400 leading-none">{score}</span>
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
            <RefreshCcw className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Menyiapkan tantangan baru...</p>
          </motion.div>
        ) : question && (
          <motion.div 
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="lab-card p-10 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="flex items-center gap-3 mb-6 text-indigo-400">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Lengkapi Kalimat</span>
              </div>
              <p className="text-2xl text-white leading-relaxed font-medium text-center italic">
                "{question.sentence}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group ${
                    showResult
                      ? idx === question.correct
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : idx === selectedOption
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-white/5 border-white/10 text-slate-500'
                      : selectedOption === idx
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{opt}</span>
                    {showResult && idx === question.correct && <CheckCircle2 className="w-6 h-6" />}
                    {showResult && idx === selectedOption && idx !== question.correct && <XCircle className="w-6 h-6" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedOption === null}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  onClick={fetchQuestion}
                  className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-3"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Tantangan Berikutnya
                </button>
              )}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-6 rounded-2xl border ${selectedOption === question.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}
              >
                <h4 className="font-bold text-white mb-2">
                  {selectedOption === question.correct ? '🎉 Luar Biasa!' : '💡 Mari Belajar'}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
