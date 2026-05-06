import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, RefreshCcw, Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { generateSentence } from '../services/geminiService';

interface Element {
  type: 'S' | 'P' | 'O' | 'Pel' | 'K';
  label: string;
  word: string;
  color: string;
}

interface Pattern {
  name: string;
  elements: Array<'S' | 'P' | 'O' | 'Pel' | 'K'>;
  example: string[];
}

const PATTERNS: Pattern[] = [
  { name: 'S-P', elements: ['S', 'P'], example: ['Adik', 'tidur'] },
  { name: 'S-P-O', elements: ['S', 'P', 'O'], example: ['Bapak', 'membaca', 'koran'] },
  { name: 'S-P-Pel', elements: ['S', 'P', 'Pel'], example: ['Kakak', 'belajar', 'mandiri'] },
  { name: 'S-P-K', elements: ['S', 'P', 'K'], example: ['Ibu', 'pergi', 'ke pasar'] },
  { name: 'S-P-O-Pel', elements: ['S', 'P', 'O', 'Pel'], example: ['Rina', 'membelikan', 'buku', 'untuk adik'] },
  { name: 'S-P-O-K', elements: ['S', 'P', 'O', 'K'], example: ['Toni', 'makan', 'rujak', 'di kantin'] },
  { name: 'S-P-Pel-K', elements: ['S', 'P', 'Pel', 'K'], example: ['Ani', 'bermain', 'boneka', 'di kamar'] },
  { name: 'S-P-O-Pel-K', elements: ['S', 'P', 'O', 'Pel', 'K'], example: ['Kakek', 'menanam', 'pohon', 'bibit unggul', 'di kebun'] },
];

const COLORS = {
  S: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
  P: 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  O: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  Pel: 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  K: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
};

const LABELS = {
  S: 'Subjek',
  P: 'Predikat',
  O: 'Objek',
  Pel: 'Pelengkap',
  K: 'Keterangan'
};

export default function SintaksisLab({ onComplete }: { onComplete?: (pts: number) => void }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPatternInfo, setShowPatternInfo] = useState(false);
  const [wordPool, setWordPool] = useState<string[]>([]);
  const [currentExample, setCurrentExample] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const pattern = PATTERNS[currentLevel];
  
  useEffect(() => {
    // Initial setup with static content
    setCurrentExample(pattern.example);
    setWordPool([...pattern.example].sort(() => Math.random() - 0.5));
  }, [currentLevel]);

  const handleWordClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setIsCorrect(null);
    } else if (selectedWords.length < currentExample.length) {
      setSelectedWords(prev => [...prev, word]);
      setIsCorrect(null);
    }
  };

  const checkAnswer = () => {
    const isMatched = JSON.stringify(selectedWords) === JSON.stringify(currentExample);
    setIsCorrect(isMatched);
    if (isMatched) {
      onComplete?.(50);
    }
  };

  const nextLevel = () => {
    if (currentLevel < PATTERNS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setSelectedWords([]);
      setIsCorrect(null);
    }
  };

  const resetLevel = () => {
    setSelectedWords([]);
    setIsCorrect(null);
    setWordPool([...currentExample].sort(() => Math.random() - 0.5));
  };

  const generateNewChallenge = async () => {
    setIsGenerating(true);
    try {
      const data = await generateSentence(pattern.name);
      setCurrentExample(data.words);
      setWordPool([...data.words].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setIsCorrect(null);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white">Lab Tata Bahasa</h2>
          <p className="text-slate-400 font-medium">Eksperimen menyusun 8 pola kalimat dasar Bahasa Indonesia.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            disabled={isGenerating}
            onClick={generateNewChallenge}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />} 
            Generate AI
          </button>
          <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-4 py-2 rounded-xl shadow-lg border border-white/10 backdrop-blur-md">
            <span className="text-slate-500 uppercase tracking-widest font-bold">Level Eksperimen</span>
            <span className="text-cyan-400 font-bold">{currentLevel + 1} / {PATTERNS.length}</span>
          </div>
        </div>
      </div>

      {/* Target Pattern Display */}
      <div className="lab-card p-10 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-cyan-400 uppercase tracking-[0.3em] font-black text-[10px]">Target Konstruksi</h3>
            <p className="text-2xl font-bold text-white">Susunlah elemen-elemen berikut:</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {pattern.elements.map((el, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl"
              >
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">{LABELS[el]}</div>
                <div className="text-2xl font-black text-cyan-400">{el}</div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => setShowPatternInfo(!showPatternInfo)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-all"
          >
            <Info size={14} className="text-cyan-400" /> Bedah Pola {pattern.name}
          </button>
          
          <AnimatePresence>
            {showPatternInfo && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-slate-300 max-w-xl bg-black/20 p-4 rounded-xl border border-white/5">
                  Pola <span className="text-cyan-400 font-bold">{pattern.name}</span> terdiri dari 
                  {pattern.elements.map((e, idx) => (
                    <span key={idx}> {LABELS[e]}{idx < pattern.elements.length - 1 ? ',' : '.'}</span>
                  ))}
                  Ini adalah struktur {pattern.elements.length > 3 ? 'kompleks' : 'dasar'} yang esensial dalam komunikasi formal.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Work Area */}
      <div className="space-y-8">
        <div className="min-h-[180px] bg-black/20 backdrop-blur-md rounded-3xl border border-white/5 p-10 flex flex-wrap items-center justify-center gap-5 relative">
          {selectedWords.length === 0 && (
            <div className="text-slate-500 italic flex flex-col items-center gap-3">
              <Sparkles size={32} className="opacity-20 animate-pulse" />
              <p className="text-sm font-medium uppercase tracking-[0.2em]">Papan Konstruksi Aktif</p>
            </div>
          )}
          <AnimatePresence>
            {selectedWords.map((word, i) => {
              const elType = pattern.elements[i];
              return (
                <motion.div
                  key={word}
                  layout
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`px-8 py-5 rounded-2xl border flex flex-col items-center gap-1 min-w-[120px] backdrop-blur-xl ${COLORS[elType]}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-1">{LABELS[elType]}</span>
                  <span className="text-2xl font-bold tracking-tight">{word}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isCorrect === true && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute -bottom-5 bg-emerald-500 text-white px-6 py-2.5 rounded-full border-4 border-indigo-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 font-black text-xs uppercase tracking-widest"
            >
              <CheckCircle2 size={18} /> Konstruksi Valid
            </motion.div>
          )}

          {isCorrect === false && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute -bottom-5 bg-rose-500 text-white px-6 py-2.5 rounded-full border-4 border-indigo-950 shadow-[0_0_30px_rgba(244,63,94,0.5)] flex items-center gap-2 font-black text-xs uppercase tracking-widest"
            >
              <AlertCircle size={18} /> Malfungsi Pola
            </motion.div>
          )}
        </div>

        {/* Word Pool */}
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-dashed border-white/20">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Bank Elemen Kalimat</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wordPool.map((word) => (
              <button
                key={word}
                disabled={isCorrect === true || isGenerating}
                onClick={() => handleWordClick(word)}
                className={`p-5 rounded-2xl font-bold text-lg transition-all border-2 ${
                  selectedWords.includes(word) 
                    ? 'bg-transparent border-white/5 text-slate-700 cursor-default line-through opacity-20' 
                    : 'bg-white/5 border-white/10 text-white hover:border-cyan-400 hover:bg-white/10 shadow-lg hover:shadow-cyan-400/20'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6 pt-4">
          <button 
            disabled={isGenerating}
            onClick={resetLevel}
            className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center gap-2 uppercase text-xs tracking-widest disabled:opacity-50"
          >
            <RefreshCcw size={18} /> Reset Lab
          </button>
          {isCorrect !== true ? (
            <button 
              disabled={selectedWords.length !== currentExample.length || isGenerating}
              onClick={checkAnswer}
              className={`px-16 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white transition-all shadow-2xl ${
                selectedWords.length === currentExample.length 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 shadow-blue-500/20 border border-white/20' 
                : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              Validasi Konstruksi
            </button>
          ) : (
            <button 
              onClick={nextLevel}
              className="px-16 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20 border border-white/20"
            >
              Lanjutkan Level {currentLevel + 2}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
