
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// --- Configuration & Data ---
const INITIAL_DATA: Record<string, string> = {
  'Movies': `Sholay
Dilwale Dulhania Le Jayenge
Lagaan
Mother India
Mughal-e-Azam
Pakeezah
Anand
Zanjeer
Deewaar
Amar Akbar Anthony
Don
Qayamat Se Qayamat Tak
Maine Pyar Kiya
Hum Aapke Hain Koun
Dil To Pagal Hai
Kuch Kuch Hota Hai
Kaho Naa Pyaar Hai
Lage Raho Munna Bhai
Rang De Basanti
Chak De India
Jab We Met
Taare Zameen Par
Ghajini
3 Idiots
My Name Is Khan
Dabangg
Zindagi Na Milegi Dobara
Barfi
Yeh Jawaani Hai Deewani
Chennai Express
Queen
Haider
Bajrangi Bhaijaan
Dangal
Gully Boy
Andhadhun
Article 15
Drishyam
Tumbbad
Baahubali
Pushpa
KGF
Pathaan
Jawan
Animal
Rocky Aur Rani Kii Prem Kahaani
Brahmastra
Gangubai Kathiawadi
Sardar Udham
Mimi
Dil Chahta Hai
Swades
Kal Ho Naa Ho
Devdas
Black
Om Shanti Om
Rockstar
Vicky Donor
Piku
Neerja
Udta Punjab
Pink
Raazi
Badhaai Ho
Super 30
Chhichhore
Thappad
The Kashmir Files
Vikram Vedha
Bhool Bhulaiyaa
Drishyam 2
Kantara
Sita Ramam
Ponniyin Selvan
Major
Rocketry The Nambi Effect
777 Charlie
Kantara
Karthikeya 2
Bimbisara
Sita Ramam
Vikrant Rona
Charlie 777
Love Today
Varisu
Thunivu
Dasara
Virupaksha
Ponniyin Selvan 2
2018
Carry on Jatta 3
RDX
Kannur Squad
Leo
Jigarthanda Double X
Hi Nanna
Kaathal The Core
Salaar
Dunki
12th Fail`,
  'Actors': `Amitabh Bachchan
Shah Rukh Khan
Salman Khan
Aamir Khan
Akshay Kumar
Ajay Devgn
Hrithik Roshan
Ranbir Kapoor
Ranveer Singh
Ayushmann Khurrana
Vicky Kaushal
Rajkummar Rao
Pankaj Tripathi
Nawazuddin Siddiqui
Dilip Kumar
Raj Kapoor
Dev Anand
Rajesh Khanna
Dharmendra
Sanjeev Kumar
Mithun Chakraborty
Govinda
Sanjay Dutt
Anil Kapoor
Sunny Deol
Jackie Shroff
Saif Ali Khan
Shahid Kapoor
Varun Dhawan
Siddharth Malhotra
Kartik Aaryan
Tiger Shroff
John Abraham
Emraan Hashmi
Abhishek Bachchan
Farhan Akhtar
Arjun Kapoor
Aditya Roy Kapur
Rajinikanth
Kamal Haasan
Prabhas
Allu Arjun
Yash
Ram Charan
Jr NTR
Dulquer Salmaan
Fahadh Faasil
Vijay Sethupathi
Suriya
Dhanush
Deepika Padukone
Priyanka Chopra
Alia Bhatt
Kareena Kapoor
Katrina Kaif
Anushka Sharma
Vidya Balan
Kangana Ranaut
Shraddha Kapoor
Kriti Sanon
Kiara Advani
Taapsee Pannu
Bhumi Pednekar
Sanya Malhotra
Radhika Apte
Yami Gautam
Sara Ali Khan
Janhvi Kapoor
Ananya Panday
Rashmika Mandanna
Nayanthara
Samantha Ruth Prabhu
Madhuri Dixit
Sridevi
Rekha
Hema Malini
Jaya Bachchan
Shabana Azmi
Smita Patil
Kajol
Rani Mukerji
Preity Zinta
Aishwarya Rai
Tabu
Karisma Kapoor
Juhi Chawla
Manisha Koirala
Urmila Matondkar
Raveena Tandon
Shilpa Shetty
Sushmita Sen
Lara Dutta
Bipasha Basu
Parineeti Chopra
Ileana D'Cruz
Jacqueline Fernandez
Nora Fatehi
Tamannaah Bhatia
Aditi Rao Hydari
Sobhita Dhulipala`,
  'Songs': `Chaiyya Chaiyya
Dil Se Re
Tum Hi Ho
Kesariya
Zaalima
Gali Mein Aaj Chand Nikla
Pehla Nasha
Tujhe Dekha To
Chappa Chappa
Dola Re Dola
Kal Ho Naa Ho
Mitwa
Maula Mere Maula
Kun Faya Kun
Phir Se Ud Chala
Agar Tum Saath Ho
Channa Mereya
Bekhayali
Raataan Lambiyan
Pasoori
Natu Natu
Srivalli
Manike
Besharam Rang
Tere Vaaste
Phir Aur Kya Chahiye
Lutt Putt Gaya
Satranga
Arjan Vailly
Pehle Bhi Main
Hua Main
Kashmir Main Tu Kanyakumari
Lungi Dance
Gerua
Zingaat
Malhari
Deewani Mastani
Ghoomar
Khalibali
Param Sundari
Raataan Lambiyan
Tum Kya Mile
What Jhumka
Ve Kamleya
Dil Jhoom
O Maahi
Vidaamuyarchi
Fear Song
Tauba Tauba
Soni Soni
Aaj Ke Baad
Naseeb Se
Sun Sajni
Le Aaunga
Tere Pyaar Mein
Pyaar Hota Kayi Baar Hai
Show Me The Thumka
Character Dheela 2.0
Munda Sona Hoon Main
Chedkhaniyan
Apna Bana Le
Thumkeshwari
Rasiya
Dance Ka Bhoot
Deva Deva
Kaise Hua
Tujhe Kitna Chahne Lage
Ghungroo
Jai Jai Shivshankar
Shaitan Ka Saala
O Saki Saki
Dilbar
Bom Diggy Diggy
Dil Chori
Chote Chote Peg
Bom Diggy
High Rated Gabru
Ban Ja Rani
Hawa Hawa
Mere Rashke Qamar
Nashe Si Chadh Gayi
The Humma Song
Enna Sona
Zaalima
Laila Main Laila
The Breakup Song
Channa Mereya
Ae Dil Hai Mushkil
Bulleya
Baby Ko Bass Pasand Hai
Jag Ghoomeya
Kar Gayi Chull
Bolna
Soch Na Sake
Sanam Re
Gerua
Janam Janam
Matargashti
Heer Toh Badi Sad Hai
Agar Tum Saath Ho`,
  'Music Directors': `A.R. Rahman
Pritam
Amit Trivedi
Vishal-Shekhar
Shankar-Ehsaan-Loy
Mithoon
Anirudh Ravichander
Santhosh Narayanan
Thaman S
Devi Sri Prasad
M.M. Keeravani
Sneha Khanwalkar
Ram Sampath
Sachin-Jigar
Ajay-Atul
Sajid-Wajid
Himesh Reshammiya
Anu Malik
Jatin-Lalit
Nadeem-Shravan
Laxmikant-Pyarelal
R.D. Burman
S.D. Burman
Kalyanji-Anandji
Naushad
O.P. Nayyar
Madan Mohan
Shankar-Jaikishan
Salil Chowdhury
Khayyam
Ilaiyaraaja
Harris Jayaraj
Yuvan Shankar Raja
G.V. Prakash Kumar
D. Imman
Ghibran
Sam C.S.
Sushin Shyam
Jakes Bejoy
Vishnu Vijay
Bijibal
Shaan Rahman
M. Jayachandran
Ravi Basrur
Ajaneesh Loknath
Charan Raj
Arjun Janya
B. Ajaneesh Loknath
S. Thaman
Mani Sharma`,
  'Directors': `Yash Chopra
Karan Johar
Sanjay Leela Bhansali
Rajkumar Hirani
Aditya Chopra
SS Rajamouli
Zoya Akhtar
Farhan Akhtar
Anurag Kashyap
Vishal Bhardwaj
Imtiaz Ali
Rohit Shetty
Kabir Khan
Shoojit Sircar
Nitesh Tiwari
Ayan Mukerji
Sriram Raghavan
Anubhav Sinha
Vikramaditya Motwane
Neeraj Pandey
Hansal Mehta
Meghna Gulzar
Ashutosh Gowariker
Rakeysh Omprakash Mehra
Mani Ratnam
Gautham Vasudev Menon
Pa. Ranjith
Lokesh Kanagaraj
Atlee
Prashanth Neel
Sandeep Reddy Vanga
Nag Ashwin
Sukumar
Trivikram Srinivas
Koratala Siva
Nelson Dilipkumar
Karthik Subbaraj
Vetrimaaran
Mari Selvaraj
Jeethu Joseph
Lijo Jose Pellissery
Anjali Menon
Basil Joseph
Dileesh Pothan
Mahesh Narayanan
Amal Neerad
Anwar Rasheed
Aashiq Abu
Raj B Shetty
Rishab Shetty`
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
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, minWords }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Engine error");
        }
        
        setResult(data.name);
        setHistory(prev => [{ name: data.name, category, mode: 'Internet' }, ...prev].slice(0, 5));
      } catch (err: any) {
        setError(err.message || "Failed to connect to the Bollywood Data Engine.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 relative bg-[#0a0f1e] selection:bg-amber-500/30">
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
