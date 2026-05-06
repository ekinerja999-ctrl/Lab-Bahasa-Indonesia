import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Zap, Brain, CheckCircle2, ChevronRight, Award, Loader2, Sparkles } from 'lucide-react';
import { generateVocabularyQuestion } from '../services/geminiService';

interface Question {
  word: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    word: "Inovasi",
    options: ["Hal yang tetap", "Pembaruan kontemporer", "Penelitian lama", "Sejarah baru"],
    correct: 1,
    explanation: "Inovasi adalah pemasukan atau pengenalan hal-hal yang baru; pembaharuan."
  },
  {
    word: "Literasi",
    options: ["Kemampuan berhitung", "Hobi membaca saja", "Melek aksara & teknologi", "Pencarian data"],
    correct: 2,
    explanation: "Literasi mencakup kemampuan menulis, membaca, serta mengolah informasi secara kritis di era digital."
  },
  {
    word: "Digital",
    options: ["Berhubungan dengan angka/elektronik", "Alat cetak manual", "Tulisan tangan", "Sistem saraf"],
    correct: 0,
    explanation: "Digital adalah teknologi yang berhubungan dengan penggunaan angka biner atau sistem elektronik modern."
  },
  {
    word: "Sintaksis",
    options: ["Ilmu tentang bunyi", "Ilmu tentang makna kata", "Ilmu tentang pembentukan kalimat", "Ilmu tentang gaya bahasa"],
    correct: 2,
    explanation: "Sintaksis adalah bagian dari tata bahasa yang mempelajari hubungan antarkata dalam kalimat."
  },
  {
    word: "Analogi",
    options: ["Persamaan dua hal yang berbeda", "Perbedaan satu hal saja", "Gaya bahasa sindiran", "Kata serapan asing"],
    correct: 0,
    explanation: "Analogi adalah persesuaian antara dua benda atau hal yang berlainan; kiasan."
  }
];

export default function KosakataLab({ onComplete }: { onComplete?: (pts: number) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customQuestion, setCustomQuestion] = useState<Question | null>(null);

  const question = customQuestion || QUESTIONS[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === question.correct) {
      setScore(prev => prev + 1);
      onComplete?.(30);
    }
  };

  const nextQuestion = () => {
    if (customQuestion) {
      setCustomQuestion(null);
      setSelectedOption(null);
      setShowResult(false);
    } else if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // Completed pool
      setCurrentIdx(0);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const generateAIChallenge = async () => {
    setIsGenerating(true);
    try {
      const newQuestion = await generateVocabularyQuestion();
      setCustomQuestion(newQuestion);
      setSelectedOption(null);
      setShowResult(false);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10 text-white">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight">Lab Kosakata</h2>
          <p className="text-slate-400 font-medium">Dekripsi makna kata dalam simulasi kognitif digital.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            disabled={isGenerating}
            onClick={generateAIChallenge}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all border border-cyan-400/30 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
            Dynamic AI
          </button>
          <div className="flex items-center gap-3 bg-white/5 text-cyan-400 px-6 py-3 rounded-2xl border border-white/10 font-black uppercase text-xs tracking-widest backdrop-blur-md">
             <Zap size={18} className="animate-pulse" /> Skor Akurasi: {score}
          </div>
        </div>
      </div>

      <div className="lab-card p-1 bg-white/5 border-white/10 shadow-2xl">
        <div className="bg-black/20 border-b border-white/10 p-12 flex items-center justify-center relative overflow-hidden rounded-t-[calc(1.5rem-1px)]">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none blur-sm">
            <Beaker size={240} className="ml-auto transform rotate-12" />
          </div>
          <motion.div 
            key={question.word}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 relative z-10"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
              {customQuestion ? 'Sintesis AI Aktif' : 'Pemindaian Semantik'}
            </span>
            <h3 className="text-6xl font-black tracking-tighter text-white glow-text">{question.word}</h3>
            <p className="text-slate-400 font-serif italic text-lg opacity-80">"Tentukan spektrum makna yang paling akurat di bawah ini"</p>
          </motion.div>
        </div>

        <div className="p-10 space-y-6 bg-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correct;
              
              let variant = "bg-white/5 border-white/10 hover:border-cyan-400 hover:bg-white/10 text-slate-300";
              if (selectedOption !== null) {
                if (isCorrect) variant = "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]";
                else if (isSelected) variant = "bg-rose-500 border-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.4)]";
                else variant = "opacity-20 bg-transparent border-white/5 cursor-default grayscale text-slate-500";
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null || isGenerating}
                  onClick={() => handleOptionClick(idx)}
                  className={`p-6 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-5 group ${variant}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border ${
                    isSelected || (selectedOption !== null && isCorrect) ? 'bg-white/20 border-white/40 shadow-inner' : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-400/50'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-lg tracking-tight">{option}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="pt-8 border-t border-white/10 space-y-6"
              >
                <div className={`p-6 rounded-2xl flex gap-4 border ${selectedOption === question.correct ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'}`}>
                  <Brain className="shrink-0 text-white" size={24} />
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">{selectedOption === question.correct ? 'Verifikasi Berhasil' : 'Anomali Terdeteksi'}</p>
                    <p className="text-sm leading-relaxed opacity-80">
                      {question.explanation}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
                  >
                    {customQuestion || currentIdx === QUESTIONS.length - 1 ? 'Mulai Ulang Lab' : 'Data Berikutnya'} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatusPanel icon={<Award size={20} />} label="Streak Aktif" value="3 Kata" color="text-blue-400" />
        <StatusPanel icon={<CheckCircle2 size={20} />} label="Akurasi Data" value={`${Math.round((score / (customQuestion ? 1 : currentIdx + 1)) * 100)}%`} color="text-emerald-400" />
        <StatusPanel icon={<Zap size={20} />} label="Level Lab" value="Inovator I" color="text-amber-400" />
      </div>
    </div>
  );
}

function StatusPanel({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="lab-card p-6 flex gap-4 items-center bg-white/5 border-white/10 backdrop-blur-md">
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-0.5">{label}</div>
        <div className="font-black text-lg text-white">{value}</div>
      </div>
    </div>
  );
}
