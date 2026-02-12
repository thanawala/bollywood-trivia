
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BollywoodCategory, EngineResult } from './types.ts';

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
Dil Chahta Hai`,
  'Actors': `Amitabh Bachchan
Shah Rukh Khan
Salman Khan
Aamir Khan
Deepika Padukone
Priyanka Chopra Jonas`,
  'Songs': `Chaiyya Chaiyya
Tum Hi Ho
Kal Ho Naa Ho (Title Track)
Kesariya Tera Ishq Hai Piya`,
  'Music Directors': `A. R. Rahman
Pritam Chakraborty
Vishal-Shekhar
Shankar-Ehsaan-Loy`,
  'Directors': `Sanjay Leela Bhansali
Rajkumar Hirani
Zoya Akhtar
Anurag Kashyap`
};

const App: React.FC = () => {
  const [category, setCategory] = useState<string>('Movies');
  const [searchMode, setSearchMode] = useState<'internet' | 'local'>('local');
  const [minWords, setMinWords] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [localScripts, setLocalScripts] = useState(INITIAL_DATA);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (searchMode === 'local') {
      const names = (localScripts[category] || "").split('\n').map(n => n.trim()).filter(n => n.length > 0);
      const filtered = names.filter(name => name.split(/\s+/).length >= minWords);
      
      if (filtered.length === 0) {
        setError(`No ${category} in vault match ${minWords}+ words.`);
        setLoading(false);
        return;
      }

      await new Promise(r => setTimeout(r, 500));
      setResult(filtered[Math.floor(Math.random() * filtered.length)]);
      setLoading(false);
    } else {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Pick a random Bollywood ${category} name with at least ${minWords} words. ONLY return the name.`
        });
        setResult(response.text?.trim() || "Engine error");
      } catch (err) {
        setError("AI Engine Error: Check API Key in Vercel settings.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-amber-500">BOLLYWOOD ENGINE</h1>
      <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-xl border border-white/10 shadow-2xl">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setSearchMode('internet')} className={`flex-1 p-3 rounded-xl ${searchMode === 'internet' ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>Internet</button>
          <button onClick={() => setSearchMode('local')} className={`flex-1 p-3 rounded-xl ${searchMode === 'local' ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>Local</button>
        </div>
        
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-slate-800 rounded-xl mb-6 outline-none">
          {Object.keys(INITIAL_DATA).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setMinWords(n)} className={`w-12 h-12 rounded-full ${minWords === n ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>{n}+</button>
          ))}
        </div>

        <button onClick={handleGenerate} className="w-full bg-amber-500 text-black py-4 rounded-2xl font-bold text-xl">RUN ENGINE</button>

        {result && (
          <div className="mt-10 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
            <h2 className="text-3xl font-bold">{result}</h2>
          </div>
        )}
        
        {error && <p className="text-rose-500 mt-4 text-center text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default App;
