import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  FlaskConical, 
  Languages, 
  Library, 
  Home, 
  Menu, 
  X, 
  Award,
  ChevronRight,
  Search,
  BookMarked,
  Microscope,
  Layers,
  Network,
  Box
} from 'lucide-react';
import SintaksisLab from './components/SintaksisLab';
import KosakataLab from './components/KosakataLab';
import SastraLab from './components/SastraLab';
import KonjungsiLab from './components/KonjungsiLab';
import FrasaLab from './components/FrasaLab';
import KlausaLab from './components/KlausaLab';

type View = 'dashboard' | 'tata-bahasa' | 'kosakata' | 'sastra' | 'konjungsi' | 'frasa' | 'klausa';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [points, setPoints] = useState({
    sintaksis: 0,
    kosakata: 0,
    frasa: 0,
    konjungsi: 0,
    klausa: 0,
    sastra: 0
  });

  const addPoints = (module: keyof typeof points, amount: number) => {
    setPoints(prev => ({ ...prev, [module]: prev[module] + amount }));
  };

  const totalPoints = Object.values(points).reduce((a, b) => (a as number) + (b as number), 0) as number;

  const renderView = () => {
    switch (currentView) {
      case 'tata-bahasa':
        return <SintaksisLab onComplete={() => addPoints('sintaksis', 50)} />;
      case 'kosakata':
        return <KosakataLab onComplete={() => addPoints('kosakata', 30)} />;
      case 'sastra':
        return <SastraLab onComplete={() => addPoints('sastra', 20)} />;
      case 'konjungsi':
        return <KonjungsiLab onComplete={(pts) => addPoints('konjungsi', pts)} />;
      case 'frasa':
        return <FrasaLab onComplete={(pts) => addPoints('frasa', pts)} />;
      case 'klausa':
        return <KlausaLab onComplete={(pts) => addPoints('klausa', pts)} />;
      default:
        return <Dashboard onSelectView={setCurrentView} points={points} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-indigo-950">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-blur-circle top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600"></div>
        <div className="bg-blur-circle bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600"></div>
        <div className="bg-blur-circle top-[30%] right-[10%] w-[30%] h-[30%] bg-pink-500 opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-50 m-4 p-4 flex items-center justify-between border-white/20 backdrop-blur-xl">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentView('dashboard')}>
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Microscope size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-white">Lab Virtual</h1>
            <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold opacity-80">Bahasa Indonesia</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          <NavLink active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<Home size={16} />} label="Beranda" />
          <NavLink active={currentView === 'tata-bahasa'} onClick={() => setCurrentView('tata-bahasa')} icon={<Languages size={16} />} label="Sintaksis" />
          <NavLink active={currentView === 'kosakata'} onClick={() => setCurrentView('kosakata')} icon={<FlaskConical size={16} />} label="Kosakata" />
          <NavLink active={currentView === 'frasa'} onClick={() => setCurrentView('frasa')} icon={<Layers size={16} />} label="Frasa" />
          <NavLink active={currentView === 'konjungsi'} onClick={() => setCurrentView('konjungsi')} icon={<Network size={16} />} label="Konjungsi" />
          <NavLink active={currentView === 'klausa'} onClick={() => setCurrentView('klausa')} icon={<Box size={16} />} label="Klausa" />
          <NavLink active={currentView === 'sastra'} onClick={() => setCurrentView('sastra')} icon={<Library size={16} />} label="Sastra" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <Award className="text-amber-400" size={16} />
            <span className="font-mono font-bold text-white">{totalPoints} XP</span>
          </div>
          <button 
            className="md:hidden p-2 hover:bg-white/10 rounded-lg text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-panel mx-4 mb-4 p-4 flex flex-col gap-2 z-40"
          >
            <MobileNavLink onClick={() => { setCurrentView('dashboard'); setIsMenuOpen(false); }} icon={<Home size={20} />} label="Beranda" />
            <MobileNavLink onClick={() => { setCurrentView('tata-bahasa'); setIsMenuOpen(false); }} icon={<Languages size={20} />} label="Sintaksis" />
            <MobileNavLink onClick={() => { setCurrentView('kosakata'); setIsMenuOpen(false); }} icon={<FlaskConical size={20} />} label="Kosakata" />
            <MobileNavLink onClick={() => { setCurrentView('frasa'); setIsMenuOpen(false); }} icon={<Layers size={20} />} label="Frasa" />
            <MobileNavLink onClick={() => { setCurrentView('konjungsi'); setIsMenuOpen(false); }} icon={<Network size={20} />} label="Konjungsi" />
            <MobileNavLink onClick={() => { setCurrentView('klausa'); setIsMenuOpen(false); }} icon={<Box size={20} />} label="Klausa" />
            <MobileNavLink onClick={() => { setCurrentView('sastra'); setIsMenuOpen(false); }} icon={<Library size={20} />} label="Sastra" />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 px-4 pb-12 max-w-7xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-8 px-4 text-center border-t border-white/10 bg-white/5 backdrop-blur-md z-10">
        <p className="text-sm text-slate-400 uppercase tracking-widest font-medium">
          Sistem Integrasi Digital v4.1.0 • © 2026 By Arman S.,S.Pd didukung oleh Yudistira
        </p>
      </footer>
    </div>
  );
}

function NavLink({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        active ? 'bg-white/15 text-cyan-400 border border-white/20 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="font-semibold text-xs uppercase tracking-wider">{label}</span>
    </button>
  );
}

function MobileNavLink({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 w-full p-4 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10"
    >
      <div className="text-cyan-400">{icon}</div>
      <span className="font-semibold text-slate-200">{label}</span>
      <ChevronRight size={16} className="ml-auto text-slate-500" />
    </button>
  );
}

interface LabPoints {
  sintaksis: number;
  kosakata: number;
  frasa: number;
  konjungsi: number;
  klausa: number;
  sastra: number;
}

function Dashboard({ onSelectView, points }: { onSelectView: (v: View) => void, points: LabPoints }) {
  const totalPoints = Object.values(points).reduce((a, b) => (a as number) + (b as number), 0) as number;
  
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          Inovasi Digital Terbaru
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Eksplorasi <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 italic font-serif">Linguistik Tanpa Batas</span>
        </h2>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-medium">
          Ditenagai oleh AI tercanggih untuk menghasilkan ribuan variasi kalimat, kata, dan struktur bahasa secara dinamis.
          Kuasai Bahasa Indonesia melalui laboratorium virtual masa depan.
        </p>
        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <button 
            onClick={() => onSelectView('tata-bahasa')}
            className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/20"
          >
            Mulai Belajar Sekarang <ChevronRight size={22} />
          </button>
        </div>
      </section>

      {/* Lab Modules */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard 
          icon={<Languages size={36} className="text-cyan-400" />}
          title="Lab Sintaksis"
          description="Konstruksi visual pola kalimat S-P-O-K dengan ribuan variasi kalimat dinamis."
          tag="Sentential"
          onClick={() => onSelectView('tata-bahasa')}
          xp={points.sintaksis}
          maxXp={500}
        />
        <ModuleCard 
          icon={<FlaskConical size={36} className="text-emerald-400" />}
          title="Lab Kosakata"
          description="Eksplorasi makna kata, sinonim, dan antonim melalui sistem pengayaan AI."
          tag="Lexical"
          onClick={() => onSelectView('kosakata')}
          xp={points.kosakata}
          maxXp={300}
        />
        <ModuleCard 
          icon={<Layers size={36} className="text-amber-400" />}
          title="Lab Frasa"
          description="Bedah struktur frasa nominal hingga preposisional dalam konteks kalimat kompleks."
          tag="Phrasal"
          onClick={() => onSelectView('frasa')}
          xp={points.frasa}
          maxXp={150}
        />
        <ModuleCard 
          icon={<Network size={36} className="text-purple-400" />}
          title="Lab Konjungsi"
          description="Kuasai logika penghubung antar klausa untuk membangun kalimat yang kohesif."
          tag="Connective"
          onClick={() => onSelectView('konjungsi')}
          xp={points.konjungsi}
          maxXp={100}
        />
        <ModuleCard 
          icon={<Box size={36} className="text-rose-400" />}
          title="Lab Klausa"
          description="Identifikasi klausa induk dan anak melalui pemodelan struktur hierarkis."
          tag="Clausal"
          onClick={() => onSelectView('klausa')}
          xp={points.klausa}
          maxXp={200}
        />
        <ModuleCard 
          icon={<Library size={36} className="text-pink-400" />}
          title="Lab Sastra"
          description="Eksplorasi virtual jejak pujangga dan karya sastra monumental Nusantara."
          tag="Literary"
          onClick={() => onSelectView('sastra')}
          xp={points.sastra}
          maxXp={200}
        />
      </section>

      {/* Progress & Info */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 text-white">
        <div className="lab-card p-10 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 text-white flex flex-col justify-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Award size={180} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-tight">Pencapaian Eksplorasi</h3>
            <p className="text-slate-300 max-w-sm text-lg">Anda telah mengumpulkan {totalPoints} XP. Terus kumpulkan poin untuk membuka modul lab tingkat lanjut.</p>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-cyan-400">
               <span>Progres Sertifikasi</span>
               <span>{Math.min(Math.floor((totalPoints / 1450) * 100), 100)}%</span>
             </div>
             <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((totalPoints / 1450) * 100, 100)}%` }}
                   className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
                />
             </div>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Target: 1450 XP untuk Sertifikat Literasi Digital Platinum</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="lab-card p-8 flex flex-col gap-6 text-white border-white/20">
            <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10 backdrop-blur-lg">
               <BookMarked size={28} />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Literasi Struktural</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Memahami arsitektur dasar kalimat dalam Bahasa Indonesia.</p>
            </div>
          </div>
          <div className="lab-card p-8 flex flex-col gap-6 text-white border-white/20">
            <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-400 border border-white/10 backdrop-blur-lg">
               <Search size={28} />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Analisis Semantik</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Menganalisis lapisan makna di balik metafora karya sastra.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({ icon, title, description, tag, onClick, xp, maxXp }: { icon: React.ReactNode, title: string, description: string, tag: string, onClick: () => void, xp: number, maxXp: number }) {
  const percentage = Math.min((xp / maxXp) * 100, 100);
  
  return (
    <div 
      onClick={onClick}
      className="lab-card p-10 flex flex-col gap-8 cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start">
        <div className="p-5 bg-white/5 rounded-2xl w-fit group-hover:bg-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/5 transition-all duration-300">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">{xp} / {maxXp} XP</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-bold uppercase tracking-wider border border-white/5">{tag}</span>
        </div>
        <p className="text-slate-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-full bg-gradient-to-r ${percentage === 100 ? 'from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.2)]'}`}
          />
        </div>
      </div>

      <button className="mt-auto flex items-center gap-2 text-sm font-bold text-cyan-400 group-hover:gap-4 transition-all">
        Masuk Laboratorium <ChevronRight size={20} />
      </button>
    </div>
  );
}
