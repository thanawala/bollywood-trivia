
import React, { useState } from 'react';
import { BollywoodCategory, EngineResult } from './types';
import { generateBollywoodName } from './services/gemini';
import HistoryCard from './components/HistoryCard';

type SearchMode = 'internet' | 'local';

const App: React.FC = () => {
  const [category, setCategory] = useState<BollywoodCategory>(BollywoodCategory.MOVIES);
  const [searchMode, setSearchMode] = useState<SearchMode>('internet');
  const [minWords, setMinWords] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<EngineResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showStudio, setShowStudio] = useState<boolean>(false);

  // Per-category local scripts (Vault)
  const [localScripts, setLocalScripts] = useState<Record<BollywoodCategory, string>>({
    [BollywoodCategory.MOVIES]: "",
    [BollywoodCategory.ACTORS]: "",
    [BollywoodCategory.SONGS]: "",
    [BollywoodCategory.MUSIC_DIRECTORS]: "",
    [BollywoodCategory.DIRECTORS]: ""
  });

  const activeScript = localScripts[category];
  const hasLocalData = activeScript.trim().length > 0;

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalScripts(prev => ({ ...prev, [category]: e.target.value }));
  };

  const loadSamples = () => {
    const samples: Record<BollywoodCategory, string> = {
      [BollywoodCategory.MOVIES]: "Dilwale Dulhania Le Jayenge\nZindagi Na Milegi Dobara\nLagaan\n3 Idiots\nSholay\nGangs of Wasseypur",
      [BollywoodCategory.ACTORS]: "Shah Rukh Khan\nAmitabh Bachchan\nDeepika Padukone\nNaseeruddin Shah",
      [BollywoodCategory.SONGS]: "Chaiyya Chaiyya\nTum Hi Ho\nKal Ho Naa Ho\nKesariya Tera Ishq Hai Piya",
      [BollywoodCategory.MUSIC_DIRECTORS]: "A. R. Rahman\nPritam Chakraborty\nVishal-Shekhar\nShankar-Ehsaan-Loy",
      [BollywoodCategory.DIRECTORS]: "Sanjay Leela Bhansali\nRajkumar Hirani\nZoya Akhtar\nAnurag Kashyap"
    };
    setLocalScripts(prev => ({ ...prev, [category]: samples[category] }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (searchMode === 'local') {
      const names = activeScript
        .split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0);

      if (names.length === 0) {
        setError(`Your ${category} vault is empty.`);
        setLoading(false);
        return;
      }

      const filtered = names.filter(name => {
        const words = name.split(/\s+/).filter(w => w.length > 0);
        return words.length >= minWords;
      });

      if (filtered.length === 0) {
        setError(`No ${category} in your list have ${minWords}+ words.`);
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 400));
      const picked = filtered[Math.floor(Math.random() * filtered.length)];
      setResult(picked);
      setHistory(prev => [{ name: picked, category, timestamp: Date.now() }, ...prev].slice(0, 5));
      setLoading(false);
    } else {
      try {
        const name = await generateBollywoodName(category, minWords);
        setResult(name);
        setHistory(prev => [{ name, category, timestamp: Date.now() }, ...prev].slice(0, 5));
      } catch (err) {
        setError("AI Engine error. Check your internet connection.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden bg-[#0a0f1e]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Header */}
      <header className="text-center mb-10 relative z-10 flex flex-col items-center">
        <h1 className="bollywood-font drop-shadow-2xl">
          <div className="text-4xl md:text-6xl uppercase gradient-text leading-tight tracking-tight">
            Bollywood
          </div>
          <div className="text-xl md:text-3xl uppercase gradient-text tracking-[0.15em] mt-1">
            Trivia Game
          </div>
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-[1px] w-6 md:w-16 bg-gradient-to-r from-transparent to-slate-700"></div>
          <p className="text-slate-500 font-light tracking-[0.4em] uppercase text-[9px] md:text-xs">
            {searchMode === 'internet' ? 'Live AI Stream' : 'Offline Vault Mode'}
          </p>
          <div className="h-[1px] w-6 md:w-16 bg-gradient-to-l from-transparent to-slate-700"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl relative z-10">
        <div className="glass-panel p-6 md:p-10 rounded-[3rem] shadow-2xl space-y-8 border-white/5">
          
          {/* Engine Selection Toggle */}
          <div className="grid grid-cols-2 bg-slate-950/80 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setSearchMode('internet')}
              className={`py-3.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 ${
                searchMode === 'internet' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className="fas fa-globe"></i> Internet
            </button>
            <button 
              onClick={() => setSearchMode('local')}
              className={`py-3.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 ${
                searchMode === 'local' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className="fas fa-box-open"></i> Local Vault
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Select */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold block px-1 opacity-70">
                Data Category
              </label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BollywoodCategory)}
                  className="w-full bg-slate-900/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer text-sm shadow-inner"
                >
                  {Object.values(BollywoodCategory).map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs"></i>
              </div>
            </div>

            {/* Word Count Select */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold block px-1 flex justify-between opacity-70">
                <span>Min Words</span>
                <span className="text-white font-mono">{minWords}</span>
              </label>
              <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/10">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setMinWords(num)}
                    className={`flex-1 py-3 rounded-xl text-xs font-mono transition-all ${
                      minWords === num 
                      ? 'bg-white/10 text-amber-400 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-5 rounded-[1.5rem] text-lg font-bold tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl group relative overflow-hidden active:scale-[0.98] ${
              loading 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-slate-950'
            }`}
          >
            {loading ? (
              <i className="fas fa-sync fa-spin"></i>
            ) : (
              <>
                <i className={`fas ${searchMode === 'internet' ? 'fa-bolt' : 'fa-play'} text-sm group-hover:scale-125 transition-transform`}></i>
                {searchMode === 'internet' ? 'Fetch AI Result' : 'Run Local Query'}
              </>
            )}
          </button>

          {/* Results & Error Area */}
          {(result || error) && (
            <div className={`p-10 rounded-[2.5rem] border-2 ${error ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/10 bg-white/5'} text-center animate-in zoom-in duration-500 relative group`}>
              {error ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-red-400 text-sm font-medium tracking-wide uppercase">{error}</p>
                  {searchMode === 'local' && !hasLocalData && (
                    <button 
                      onClick={() => setShowStudio(true)}
                      className="px-6 py-2 rounded-full border border-red-500/30 text-red-400 text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all animate-pulse"
                    >
                      Open Vault Manager
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-[9px] uppercase tracking-[0.6em] text-amber-500/40 mb-4">ENGINE RESPONSE</p>
                  <h2 className="text-4xl md:text-6xl font-bold bollywood-font text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight break-words">
                    {result}
                  </h2>
                </>
              )}
            </div>
          )}

          {/* Vault Manager Toggle */}
          <div className="pt-4 flex justify-center">
            <button 
              onClick={() => setShowStudio(!showStudio)}
              className={`group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500 ${
                showStudio 
                ? 'bg-amber-500 border-amber-500 text-slate-950' 
                : 'border-white/10 text-slate-500 hover:text-amber-500 hover:border-amber-500/50'
              }`}
            >
              <i className={`fas ${showStudio ? 'fa-times' : 'fa-terminal'} text-[10px]`}></i>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                {showStudio ? 'Close Manager' : 'Manage Local Vault'}
              </span>
            </button>
          </div>

          {/* Vault Manager Console */}
          {showStudio && (
            <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-700 p-8 bg-slate-950/90 rounded-[2rem] border border-amber-500/20 shadow-inner ring-1 ring-white/5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${hasLocalData ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Editing: <span className="text-amber-500">{category}</span></span>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={loadSamples}
                    className="text-[9px] uppercase tracking-tighter text-amber-500/60 hover:text-amber-500 px-3 py-1 rounded border border-white/5 bg-white/5"
                  >
                    Load Samples
                  </button>
                  <button 
                    onClick={() => setLocalScripts(prev => ({ ...prev, [category]: "" }))}
                    className="text-[9px] uppercase tracking-tighter text-red-500/60 hover:text-red-500 px-3 py-1 rounded border border-white/5 bg-white/5"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="relative">
                <textarea 
                  value={activeScript}
                  onChange={handleScriptChange}
                  placeholder={`Type or paste your list of ${category.toLowerCase()} here. Use one name per line...`}
                  className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-amber-500/30 transition-all font-mono text-xs leading-relaxed custom-scrollbar resize-none placeholder:text-slate-800"
                />
                <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-700 pointer-events-none">
                  L: {activeScript.split('\n').length} | C: {activeScript.length}
                </div>
              </div>
              <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest opacity-50">
                <i className="fas fa-info-circle mr-1"></i> Data is stored locally in your current session.
              </p>
            </div>
          )}
        </div>

        <HistoryCard results={history} />
      </main>

      <footer className="mt-auto py-10 text-slate-700 text-[10px] tracking-[0.5em] uppercase flex flex-col items-center gap-4 z-10">
        <div className="flex gap-8 items-center opacity-30 hover:opacity-100 transition-opacity">
          <i className="fab fa-instagram cursor-pointer hover:text-amber-500"></i>
          <i className="fab fa-twitter cursor-pointer hover:text-amber-500"></i>
          <i className="fab fa-github cursor-pointer hover:text-amber-500"></i>
        </div>
        <p>Bollywood Engine &copy; MMXXIV • Hybrid Series</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </div>
  );
};

export default App;
