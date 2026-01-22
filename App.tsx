
import React, { useState, useRef, useEffect } from 'react';
import { Rocket, Download, RefreshCw, Trash2, History, UploadCloud, Copy, Check, Target, Calendar, MessageSquare, ShieldCheck, Sparkles, Hash, Quote } from 'lucide-react';
import { generateBrandGraphics, fileToGenerativePart } from './services/geminiService';
import { GeneratedImage, GenerationStatus, CampaignSet } from './types';
import { Button } from './components/Button';
import { BRAND_PALETTES, CAMPAIGN_ANGLES, STRATEGY_DAYS, StrategyDay } from './constants';
import { saveImagesToDB, getImagesFromDB, clearDB } from './services/db';

const App: React.FC = () => {
  const [view, setView] = useState<'studio' | 'gallery'>('studio');
  const [studioMode, setStudioMode] = useState<'simple' | 'professional'>('professional');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [copiedAI, setCopiedAI] = useState(false);

  // Brand Reference
  const [brandRef, setBrandRef] = useState<string | null>(null);
  const [brandRefUrl, setBrandRefUrl] = useState<string | null>(null);
  const brandInputRef = useRef<HTMLInputElement>(null);

  // Strategy & Inputs
  const [selectedDay, setSelectedDay] = useState<StrategyDay>('MONDAY');
  const [selectedAngle, setSelectedAngle] = useState(CAMPAIGN_ANGLES[0]);
  const [selectedPalette, setSelectedPalette] = useState(BRAND_PALETTES[0].id);
  const [customText, setCustomText] = useState("");
  const [eventbriteLink, setEventbriteLink] = useState("https://eventbrite.com/future-forward");

  useEffect(() => {
    getImagesFromDB().then(setHistory).catch(console.error);
  }, []);

  const handleBrandUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToGenerativePart(file);
      setBrandRef(base64);
      setBrandRefUrl(URL.createObjectURL(file));
      setResults([]);
    }
  };

  const handleDownload = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `future-forward-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    setStatus(GenerationStatus.GENERATING);
    setResults([]);
    setGeneratedCaption("");
    setGeneratedHashtags([]);
    
    try {
      const graphicText = customText.trim() || selectedAngle.graphic;
      const campaign = await generateBrandGraphics(brandRef, selectedPalette, graphicText, studioMode, selectedDay);
      
      setResults(campaign.images);
      setGeneratedCaption(campaign.caption);
      setGeneratedHashtags(campaign.hashtags);
      
      await saveImagesToDB(campaign.images);
      setHistory(await getImagesFromDB());
      setStatus(GenerationStatus.COMPLETE);
    } catch (error) {
      setStatus(GenerationStatus.ERROR);
    }
  };

  const copyAICaption = () => {
    const fullText = `${generatedCaption}\n\n${generatedHashtags.join(" ")}\n\nLink: ${eventbriteLink}`;
    navigator.clipboard.writeText(fullText);
    setCopiedAI(true);
    setTimeout(() => setCopiedAI(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A202C] rounded-xl flex items-center justify-center text-white">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase leading-none italic">Future Forward</h1>
            <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase">Command Center</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
           <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setView('studio')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${view === 'studio' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>STUDIO</button>
            <button onClick={() => setView('gallery')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${view === 'gallery' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>VAULT ({history.length})</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {view === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Strategy</h3>
                  </div>
                  {brandRef ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[8px] font-black uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Custom
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> System
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(STRATEGY_DAYS) as StrategyDay[]).map(day => (
                    <button 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${selectedDay === day ? 'bg-[#1A202C] text-white border-transparent' : 'bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
                <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{STRATEGY_DAYS[selectedDay].goal}</p>
                  <p className="text-[9px] text-blue-500 mt-1 leading-tight italic">{STRATEGY_DAYS[selectedDay].focus}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">1. Angle</label>
                  <div className="space-y-2">
                    {CAMPAIGN_ANGLES.map(angle => (
                      <button 
                        key={angle.id}
                        onClick={() => { setSelectedAngle(angle); setCustomText(""); }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedAngle.id === angle.id ? 'bg-[#1A202C] text-white border-transparent' : 'bg-gray-50 text-gray-600 hover:border-gray-300'}`}
                      >
                        <p className="text-xs font-bold">{angle.label}</p>
                        <p className={`text-[10px] mt-1 opacity-60 line-clamp-1`}>{angle.graphic}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">2. Brand Baseline</label>
                  <div 
                    onClick={() => brandInputRef.current?.click()}
                    className="h-32 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group relative overflow-hidden"
                  >
                    <input type="file" ref={brandInputRef} onChange={handleBrandUpload} className="hidden" accept="image/*" />
                    {brandRefUrl ? (
                      <img src={brandRefUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                        <UploadCloud className="mx-auto mb-2" />
                        <p className="text-[9px] font-black uppercase tracking-widest">Drop Brand Image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">3. Mode & Palette</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setStudioMode('simple')} className={`py-2 px-3 rounded-xl border text-[9px] font-black uppercase tracking-widest ${studioMode === 'simple' ? 'bg-[#1A202C] text-white border-transparent' : 'bg-gray-50 text-gray-500'}`}>Simple</button>
                    <button onClick={() => setStudioMode('professional')} className={`py-2 px-3 rounded-xl border text-[9px] font-black uppercase tracking-widest ${studioMode === 'professional' ? 'bg-[#1A202C] text-white border-transparent' : 'bg-gray-50 text-gray-500'}`}>Poster</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {BRAND_PALETTES.map(p => (
                      <button key={p.id} onClick={() => setSelectedPalette(p.id)} className={`h-8 rounded-lg border ${p.gradient} ${selectedPalette === p.id ? 'ring-2 ring-[#1A202C] ring-offset-2' : 'border-gray-100'}`} />
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Main Stage */}
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Graphic Content</h2>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Type-Safe Brand Delivery</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <textarea 
                    value={customText || selectedAngle.graphic}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-xl h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600/10 font-black italic tracking-tight"
                    placeholder="Enter graphic text..."
                  />
                  
                  <div className="pt-4 border-t border-gray-50">
                     {status === GenerationStatus.GENERATING ? (
                      <div className="flex flex-col items-center gap-3 py-6">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Synthesizing {selectedDay} Strategy Set...</p>
                      </div>
                     ) : (
                      <Button 
                        onClick={handleGenerate} 
                        className="w-full py-5 text-xs font-black uppercase tracking-[0.3em] bg-[#1A202C] text-white hover:bg-black rounded-3xl"
                      >
                        Launch {selectedDay} Campaign
                      </Button>
                     )}
                  </div>
                </div>
              </section>

              {results.length > 0 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
                  {/* Visual Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.map(img => (
                      <div key={img.id} className="group relative bg-white p-2 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-xl">
                        <div className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                          <img src={img.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => handleDownload(img.url, img.id)} className="bg-white p-3 rounded-full hover:scale-110 transition-transform">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Copy Toolkit */}
                  {generatedCaption && (
                    <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Quote className="w-4 h-4 text-blue-600" />
                          <h3 className="text-xs font-black uppercase tracking-widest">AI Strategic Copy</h3>
                        </div>
                        <button 
                          onClick={copyAICaption}
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                          {copiedAI ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          {copiedAI ? 'Copied Set' : 'Copy Kit'}
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-600 font-medium italic">
                          {generatedCaption}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {generatedHashtags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'gallery' && (
          <div className="space-y-12 animate-in fade-in">
             <div className="flex justify-between items-end border-b border-gray-200 pb-6">
              <div>
                <h3 className="text-3xl font-black tracking-tight uppercase italic">Strategy Vault</h3>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">Asset Repository</p>
              </div>
              <button onClick={async () => { if(window.confirm("Purge vault?")) { await clearDB(); setHistory([]); } }} className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1 hover:underline tracking-widest"><Trash2 className="w-3 h-3" /> CLEAR ALL</button>
            </div>
            
            {history.length === 0 ? (
               <div className="py-40 text-center opacity-20 flex flex-col items-center gap-4">
                 <Rocket className="w-16 h-16" />
                 <p className="text-xs font-black uppercase tracking-widest italic">No Mission Data Found</p>
               </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {history.map(img => (
                  <div key={img.id} className="group relative bg-white p-2 rounded-2xl shadow-sm border border-gray-100 cursor-pointer" onClick={() => handleDownload(img.url, img.id)}>
                    <div className="aspect-square rounded-xl overflow-hidden">
                      <img src={img.url} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
