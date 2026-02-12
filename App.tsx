
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const INITIAL_DATA: Record<string, string> = {
  'Movies': `Sholay
Dilwale Dulhania Le Jayenge
Lagaan: Once Upon a Time in India
Mother India
Mughal-e-Azam
Zindagi Na Milegi Dobara
Gangs of Wasseypur
3 Idiots
Bajrangi Bhaijaan
Dil Chahta Hai
Kal Ho Naa Ho
Kuch Kuch Hota Hai
Pathaan
Jawan
Rocky Aur Rani Kii Prem Kahaani`,
  'Actors': `Amitabh Bachchan
Shah Rukh Khan
Salman Khan
Aamir Khan
Deepika Padukone
Priyanka Chopra Jonas
Ranbir Kapoor
Ranveer Singh
Alia Bhatt
Naseeruddin Shah`,
  'Songs': `Chaiyya Chaiyya
Tum Hi Ho
Kal Ho Naa Ho (Title Track)
Kesariya Tera Ishq Hai Piya
Tujhe Dekha To Yeh Jaana Sanam
Gerua
Kabira`,
  'Music Directors': `A. R. Rahman
Pritam Chakraborty
Vishal-Shekhar
Shankar-Ehsaan-Loy
Amit Trivedi
R. D. Burman`,
  'Directors': `Sanjay Leela Bhansali
Rajkumar Hirani
Zoya Akhtar
Anurag Kashyap
Karan Johar
Imtiaz Ali`
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
      const filtered = names.filter(name => name.split(/\s+/).filter(Boolean).length >= minWords);
      
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
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
          throw new Error("API Key is missing. If you are on Vercel, set the 'API_KEY' environment variable. GitHub Pages does not support environment variables.");
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name itself.`,
        });
        
        const name = response.text?.trim() || "Engine error";
        setResult(name);
        setHistory(prev => [{ name, category, mode: 'Internet' }, ...prev].slice(0, 5));
      } catch (err: any) {
        console.error("Gemini Error:", err);
        setError(err.message || "Internet connection failed. Check your API key and quota.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 relative bg-[#0a0f1e]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="text-center mb-10 z-10 animate-fade">
        <h1 className="bollywood-font">
          <span className="text-4xl md:text-6xl uppercase gradient-text leading-tight drop-shadow-xl">Bollywood</span><br/>
          <span className="text-xl md:text-3xl uppercase gradient-text tracking-[0.2em] opacity-80">Data Engine</span>
        </h1>
      </header>

      <main className="w-full max-w-2xl z-10 space-y-6">
        <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8 border border-white/10">
          <div className="grid grid-cols-2 bg-slate-950/80 p-1 rounded-2xl border border-white/5">
            {['internet', 'local'].map(m => (
              <button 
                key={m} 
                onClick={() => setSearchMode(m as any)} 
                className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${searchMode === m ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <i className={`fas ${m === 'internet' ? 'fa-globe' : 'fa-database'} mr-2 opacity-50`}></i>
                {m}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold opacity-70">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:border-amber-500/50 outline-none"
              >
                {Object.keys(INITIAL_DATA).map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold opacity-70">Min Words: {minWords}</label>
              <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/10">
                {[1, 2, 3, 4].map(n => (
                  <button 
                    key={n} 
                    onClick={() => setMinWords(n)} 
                    className={`flex-1 py-2 rounded-lg text-xs font-mono transition-all ${minWords === n ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
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
            className={`w-full py-5 rounded-2xl text-lg font-bold tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950'}`}
          >
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-bolt mr-2 text-sm opacity-50"></i>}
            {loading ? 'Processing...' : 'Run Engine'}
          </button>

          {(result || error) && (
            <div className={`p-8 rounded-3xl border-2 text-center animate-fade ${error ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-amber-500/20 bg-amber-500/5'}`}>
              {error ? (
                <div className="space-y-2">
                  <i className="fas fa-exclamation-triangle opacity-50 text-xl"></i>
                  <p className="text-[10px] uppercase tracking-widest leading-relaxed font-semibold">{error}</p>
                </div>
              ) : (
                <>
                  <p className="text-[8px] uppercase tracking-[0.5em] text-amber-500/40 mb-3">RESULT ACQUIRED</p>
                  <h2 className="text-3xl md:text-5xl font-bold bollywood-font text-white leading-tight drop-shadow-lg">{result}</h2>
                </>
              )}
            </div>
          )}

          <div className="text-center pt-4">
            <button onClick={() => setShowVault(!showVault)} className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors inline-flex items-center gap-2">
              <i className={`fas ${showVault ? 'fa-times' : 'fa-pen-to-square'}`}></i>
              {showVault ? 'Close Vault Editor' : 'Manage Local Vault'}
            </button>
          </div>

          {showVault && (
            <div className="space-y-4 animate-fade border-t border-white/5 pt-6">
              <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-400">
                <span>Editing: {category}</span>
                <button onClick={() => setLocalScripts(p => ({...p, [category]: ""}))} className="text-rose-500 hover:text-rose-400">Clear List</button>
              </div>
              <textarea 
                value={localScripts[category]} 
                onChange={e => setLocalScripts(p => ({...p, [category]: e.target.value}))}
                className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-mono text-amber-100/70 focus:border-amber-500/30 outline-none resize-none custom-scrollbar"
                placeholder="Enter names, one per line..."
              />
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="animate-fade space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-500/30 flex items-center gap-2 px-2">
              <i className="fas fa-history"></i> Recent Discoveries
            </h3>
            {history.map((item, i) => (
              <div key={i} className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/5 transition-all hover:bg-white/5">
                <div>
                  <p className="text-white text-sm font-semibold">{item.name}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">{item.category} • {item.mode}</p>
                </div>
                <i className="fas fa-star text-[10px] text-amber-500/10"></i>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto py-10 text-slate-700 text-[9px] tracking-[0.5em] uppercase opacity-40">
        Bollywood Data Engine &copy; MMXXIV
      </footer>
    </div>
  );
};

export default App;
