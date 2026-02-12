
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Configuration & Data ---
const INITIAL_DATA: Record<string, string> = {
  'Movies': `Sholay\nDilwale Dulhania Le Jayenge\nLagaan: Once Upon a Time in India\nMother India\nMughal-e-Azam\nZindagi Na Milegi Dobara\nGangs of Wasseypur\n3 Idiots\nBajrangi Bhaijaan\nDil Chahta Hai\nKal Ho Naa Ho\nKuch Kuch Hota Hai\nPathaan\nJawan\nRocky Aur Rani Kii Prem Kahaani`,
  'Actors': `Amitabh Bachchan\nShah Rukh Khan\nSalman Khan\nAamir Khan\nDeepika Padukone\nPriyanka Chopra Jonas\nRanbir Kapoor\nRanveer Singh\nAlia Bhatt\nNaseeruddin Shah`,
  'Songs': `Chaiyya Chaiyya\nTum Hi Ho\nKal Ho Naa Ho\nKesariya Tera Ishq Hai Piya\nTujhe Dekha To Yeh Jaana Sanam\nGerua\nKabira`,
  'Music Directors': `A. R. Rahman\nPritam Chakraborty\nVishal-Shekhar\nShankar-Ehsaan-Loy\nAmit Trivedi\nR. D. Burman`,
  'Directors': `Sanjay Leela Bhansali\nRajkumar Hirani\nZoya Akhtar\nAnurag Kashyap\nKaran Johar\nImtiaz Ali`
};

const App: React.FC = () => {
  const [category, setCategory] = useState<string>('Movies');
  const [searchMode, setSearchMode] = useState<'internet' | 'local'>('local');
  const [minWords, setMinWords] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [localScripts, setLocalScripts] = useState(INITIAL_DATA);
  const [showVault, setShowVault] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (searchMode === 'local') {
      const names = (localScripts[category] || "").split('\n').map(n => n.trim()).filter(n => n.length > 0);
      const filtered = names.filter(name => {
        const wordCount = name.split(/\s+/).filter(Boolean).length;
        return wordCount >= minWords;
      });
      
      if (filtered.length === 0) {
        setError(`No ${category} found in local vault with ${minWords}+ words.`);
        setLoading(false);
        return;
      }

      await new Promise(r => setTimeout(r, 600)); 
      const picked = filtered[Math.floor(Math.random() * filtered.length)];
      setResult(picked);
      setHistory(prev => [{ name: picked, category, mode: 'Local' }, ...prev].slice(0, 5));
      setLoading(false);
    } else {
      try {
        // Initialize Gemini with the API key from the environment.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself. No markdown, no quotes.`,
        });
        
        const name = response.text?.trim() || "Engine error";
        setResult(name);
        setHistory(prev => [{ name, category, mode: 'Internet' }, ...prev].slice(0, 5));
      } catch (err: any) {
        console.error("Engine Error Detail:", err);
        // Display the specific error message to help the user identify the issue (e.g., "process is not defined" or a 401 response).
        const errorMsg = err.message || String(err);
        setError(`Engine Failure: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 relative bg-[#0a0f1e] selection:bg-amber-500/30">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="text-center mb-10 z-10 animate-fade">
        <h1 className="bollywood-font">
          <span className="text-4xl md:text-6xl uppercase gradient-text leading-tight drop-shadow-2xl">Bollywood</span><br/>
          <span className="text-xl md:text-3xl uppercase gradient-text tracking-[0.25em] opacity-80">Data Engine</span>
        </h1>
      </header>

      <main className="w-full max-w-2xl z-10 space-y-6">
        <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8 border border-white/10">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 bg-slate-950/80 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {(['internet', 'local'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => setSearchMode(m)} 
                className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${searchMode === m ? 'bg-amber-500 text-slate-950 shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <i className={`fas ${m === 'internet' ? 'fa-globe-asia' : 'fa-database'} mr-2 opacity-70`}></i>
                {m}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold opacity-70 ml-2">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none cursor-pointer focus:border-amber-500/50 outline-none transition-all shadow-sm"
              >
                {Object.keys(INITIAL_DATA).map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold opacity-70 ml-2">Min Words: {minWords}</label>
              <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-white/10">
                {[1, 2, 3, 4].map(n => (
                  <button 
                    key={n} 
                    onClick={() => setMinWords(n)} 
                    className={`flex-1 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${minWords === n ? 'bg-amber-500/20 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {n}+
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={loading} 
            className={`w-full py-6 rounded-2xl text-lg font-bold tracking-[0.3em] uppercase transition-all duration-300 shadow-2xl active:scale-[0.98] ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-slate-950 hover:brightness-110'}`}
          >
            {loading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-bolt mr-3 text-sm opacity-60"></i>}
            {loading ? 'Crunching...' : 'Initiate Engine'}
          </button>

          {(result || error) && (
            <div className={`p-8 md:p-12 rounded-[2rem] border-2 text-center animate-fade ${error ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-amber-500/20 bg-amber-500/5'}`}>
              {error ? (
                <div className="space-y-3">
                  <i className="fas fa-circle-exclamation text-2xl opacity-40"></i>
                  <p className="text-[11px] uppercase tracking-widest leading-relaxed font-semibold max-w-xs mx-auto break-words">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[9px] uppercase tracking-[0.6em] text-amber-500/40 font-bold">DATA RECOVERED</p>
                  <h2 className="text-3xl md:text-5xl font-bold bollywood-font text-white leading-tight drop-shadow-xl">{result}</h2>
                </div>
              )}
            </div>
          )}

          <div className="text-center pt-2">
            <button 
              onClick={() => setShowVault(!showVault)} 
              className="text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-amber-500 transition-colors inline-flex items-center gap-2 font-bold"
            >
              <i className={`fas ${showVault ? 'fa-times-circle' : 'fa-sliders'}`}></i>
              {showVault ? 'Collapse Vault' : 'Open Local Vault'}
            </button>
          </div>

          {showVault && (
            <div className="space-y-4 animate-fade border-t border-white/5 pt-8">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400 px-2 font-bold">
                <span className="flex items-center gap-2"><i className="fas fa-database text-amber-500/50"></i> {category} Manifest</span>
                <button onClick={() => setLocalScripts(p => ({...p, [category]: ""}))} className="text-rose-500 hover:text-rose-400 transition-colors">Wipe Data</button>
              </div>
              <textarea 
                value={localScripts[category]} 
                onChange={e => setLocalScripts(p => ({...p, [category]: e.target.value}))}
                className="w-full h-44 bg-black/40 border border-white/5 rounded-2xl p-5 text-xs font-mono text-amber-100/60 focus:border-amber-500/30 outline-none resize-none custom-scrollbar shadow-inner"
                placeholder={`Type names for ${category} here...`}
              />
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="animate-fade space-y-4 pb-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-500/30 flex items-center gap-3 px-4">
              <i className="fas fa-scroll"></i> Engine Logs
            </h3>
            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={i} className="glass-panel p-5 rounded-2xl flex justify-between items-center border border-white/5 transition-all hover:bg-white/5">
                  <div className="space-y-1">
                    <p className="text-white text-base font-semibold">{item.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{item.category} <span className="mx-2 opacity-30">•</span> {item.mode}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-12 text-slate-800 text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold">
        Engine Protocol &copy; MMXXIV
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
