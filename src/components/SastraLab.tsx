import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Feather, Scroll, Search, Quote, ChevronRight, User, Sparkles, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { generateAuthorInfo, LiteraryWork } from '../services/geminiService';

interface Author {
  name: string;
  period: string;
  bio: string;
  works: LiteraryWork[];
  quote: string;
}

const AUTHORS: Author[] = [
  {
    name: "Chairil Anwar",
    period: "Angkatan '45",
    bio: "Penyair terkemuka Indonesia yang dijuluki 'Si Binatang Jalang'. Pembawa pembaharuan dalam sastra modern Indonesia.",
    works: [
      { title: "Aku", summary: "Puisi monumental yang melambangkan semangat kebebasan dan individualisme yang membara." },
      { title: "Deru Campur Debu", summary: "Kumpulan puisi yang mencerminkan gejolak batin dan semangat perjuangan kemerdekaan." },
      { title: "Kerikil Tajam", summary: "Karya puitis yang mengeksplorasi rasa sakit, eksistensi, dan perlawanan terhadap kemapanan." }
    ] as LiteraryWork[],
    quote: "Mampus kau dikoyak-koyak sepi."
  },
  {
    name: "Pramoedya Ananta Toer",
    period: "Sastra Realisme",
    bio: "Penulis prolifik yang pernah dipenjara tanpa pengadilan. Terkenal dengan Tetralogi Buru.",
    works: [
      { title: "Bumi Manusia", summary: "Kisah Minke di akhir masa kolonial yang mengeksplorasi benturan budaya dan kesadaran nasional." },
      { title: "Anak Semua Bangsa", summary: "Kelanjutan perjalanan Minke yang mulai memahami realitas penderitaan rakyat di bawah kolonialisme." },
      { title: "Jejak Langkah", summary: "Perjuangan Minke dalam mengorganisir perlawanan melalui pers dan organisasi modern pertama." }
    ] as LiteraryWork[],
    quote: "Seorang terpelajar harus sudah berbuat adil sejak dalam pikiran."
  },
  {
    name: "Sapardi Djoko Damono",
    period: "Angkatan 70-an",
    bio: "Penyair yang dikenal dengan kata-kata sederhana namun sangat puitis dan mendalam.",
    works: [
      { title: "Aku Ingin", summary: "Puisi cinta yang sangat ikonik, mengungkapkan ketulusan melalui metafora alam yang bersahaja." },
      { title: "Hujan Bulan Juni", summary: "Kumpulan puisi yang puitis tentang ketabahan, kerinduan, dan hal-hal yang tak tersampaikan." },
      { title: "Melipat Jarak", summary: "Eksplorasi puitis tentang waktu, ingatan, dan bagaimana manusia memaknai ruang dan jarak." }
    ] as LiteraryWork[],
    quote: "Aku ingin mencintaimu dengan sederhana."
  }
];

export default function SastraLab({ onComplete }: { onComplete?: (pts: number) => void }) {
  const [activeAuthor, setActiveAuthor] = useState<Author>(AUTHORS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customAuthors, setCustomAuthors] = useState<Author[]>([]);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const data = await generateAuthorInfo(searchQuery);
      setCustomAuthors(prev => [data as Author, ...prev].slice(0, 5));
      setActiveAuthor(data as Author);
      setSearchQuery('');
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const allAuthors = [...customAuthors, ...AUTHORS];

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12 pb-24">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-black tracking-tight text-white glow-text">Lab Sastra Indonesia</h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg font-medium">Menelusuri jejak peradaban melalui untaian kata para maestro sastra Nusantara dalam simulator sejarah digital.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Author Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
             <div className="flex items-center gap-2 px-2 pb-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
               <User size={16} /> Direktori Tokoh
             </div>

             <form onSubmit={handleAISearch} className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tokoh via AI..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                </div>
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-400 p-2 rounded-xl text-black shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Sparkles size={16} />
                </button>
             </form>

             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {allAuthors.map((author) => (
                 <button
                   key={author.name}
                   onClick={() => setActiveAuthor(author)}
                   className={`w-full text-left p-5 rounded-2xl transition-all flex items-center justify-between group border ${
                     activeAuthor.name === author.name 
                     ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-blue-500/20 border-white/20' 
                     : 'hover:bg-white/5 text-slate-400 border-transparent hover:border-white/5'
                   }`}
                 >
                   <div>
                     <div className="font-black tracking-tight text-lg flex items-center gap-2">
                       {author.name}
                       {customAuthors.some(ca => ca.name === author.name) && <Sparkles size={12} className="text-cyan-400" />}
                     </div>
                     <div className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${activeAuthor.name === author.name ? 'text-blue-100 opacity-80' : 'text-slate-500'}`}>
                       {author.period}
                     </div>
                   </div>
                   <ChevronRight size={18} className={`${activeAuthor.name === author.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-x-2'}`} />
                 </button>
               ))}
             </div>
          </div>

          <div className="lab-card p-8 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-white/20 text-white space-y-6">
            <h4 className="font-black flex items-center gap-3 text-sm uppercase tracking-widest text-amber-400">
              <Scroll size={20} /> Transmisi Pengetahuan
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed italic font-serif opacity-80">
              "Bahasa Indonesia dikukuhkan dalam Sumpah Pemuda pada 28 Oktober 1928, 
              namun perkembangan sastranya telah melampaui batas waktu melalui artefak 
              dan naskah kuno yang kini tersimpan secara digital."
            </p>
            <button 
              onClick={() => onComplete?.(20)}
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 shadow-lg"
            >
              Uji Pengetahuan Sastra +20 XP
            </button>
          </div>
        </div>

        {/* Display Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <motion.div 
            key={activeAuthor.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lab-card flex flex-col md:flex-row min-h-[500px] border-white/20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 filter blur-[60px] pointer-events-none"></div>
            
            <div className="md:w-1/3 bg-black/20 p-10 flex flex-col items-center justify-center text-center gap-6 border-r border-white/5 backdrop-blur-2xl">
               <div className="w-40 h-40 rounded-3xl bg-white/5 border-2 border-white/10 flex items-center justify-center text-slate-500 shadow-inner relative group">
                 <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl"></div>
                 <User size={80} strokeWidth={0.5} className="text-cyan-400/50" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black tracking-tight text-white">{activeAuthor.name}</h3>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">{activeAuthor.period}</span>
               </div>
            </div>
            
            <div className="md:w-2/3 p-10 md:p-14 space-y-10 relative z-10">
               <div className="space-y-4">
                 <div className="flex items-center gap-3 text-cyan-400">
                    <Feather size={22} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Arsip Biografis</span>
                 </div>
                 <p className="text-xl leading-relaxed text-slate-200 font-serif italic font-medium">
                    "{activeAuthor.bio}"
                 </p>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Karya Utama</h4>
                  <div className="flex flex-wrap gap-3">
                    {activeAuthor.works.map(work => (
                      <div key={work.title} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-3 hover:bg-white/10 transition-colors">
                        <Book size={16} className="text-cyan-400" /> {work.title}
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 relative shadow-2xl backdrop-blur-3xl group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>
                  <Quote className="absolute -top-6 -left-6 text-cyan-400/20 group-hover:text-cyan-400/40 transition-colors" size={64} />
                  <p className="text-3xl font-serif text-white leading-tight glow-text opacity-90">
                    {activeAuthor.quote}
                  </p>
               </div>
            </div>
          </motion.div>

          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-400/20 rounded-lg text-amber-400">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Galeri Mahakarya</h3>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Artifacts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {activeAuthor.works.map((work, index) => (
                  <motion.div
                    key={`${activeAuthor.name}-${work.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group lab-card p-0 overflow-hidden bg-black/40 border-white/10 hover:border-cyan-400/50 transition-all flex flex-col"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-white/5">
                      <img 
                        src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&h=500&auto=format&fit=crop&sig=${work.title.length}`} 
                        alt={work.title}
                        className="w-full h-full object-crop opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 grayscale hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Book size={14} className="text-cyan-400" />
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 space-y-2">
                        <h5 className="text-lg font-black text-white leading-tight">{work.title}</h5>
                        <div className="h-1 w-8 bg-cyan-400 rounded-full group-hover:w-16 transition-all duration-500"></div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3 italic">
                        "{work.summary}"
                      </p>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 group-hover:text-white transition-colors mt-4 self-start">
                        Buka Arsip <ExternalLink size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoTile icon={<Search size={28} />} title="Repositori Digital" desc="Sinkronisasi data dengan ribuan mahakarya sastra Nusantara." color="text-blue-400" />
            <InfoTile icon={<Feather size={28} />} title="Workshop Kreatif" desc="Algoritma panduan menulis kreatif bagi eksplorator muda." color="text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="lab-card p-8 bg-white/5 flex items-start gap-5 border-white/10 hover:border-white/20">
       <div className={`p-4 bg-white/5 rounded-2xl border border-white/10 shadow-lg ${color}`}>
         {icon}
       </div>
       <div>
          <h5 className="font-bold text-white text-lg mb-1 tracking-tight">{title}</h5>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">{desc}</p>
       </div>
    </div>
  );
}
