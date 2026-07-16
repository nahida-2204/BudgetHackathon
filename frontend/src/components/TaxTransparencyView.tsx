import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Landmark, Send, AlertCircle, Sparkles, Info, HelpCircle, BookOpen, ArrowRight, CheckCircle2, HeartHandshake, Briefcase, Zap, Store } from "lucide-react";
import { ChatMessage } from "../types";

export default function TaxTransparencyView() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      originalText: "The Special Allowance paid to workers under Section 18 of the Workers' Rights Act will be increased by Rs 1,000 to offset the inflationary impact on the Consumer Price Index, subject to a revised income threshold.",
      simplifiedText: "Workers will get an extra Rs 1,000 allowance to help with the rising cost of living. There are new rules on who earns enough to qualify.",
      kreolText: "Travayer pou gagn enn ekstra Rs 1,000 allowance pou ed zot ar lavi ki pe vinn ser. Ena nouvo regleman lor komie ou bizin gagne pou kalifie."
    }
  ]);

  const keyMeasures = [
    {
      id: "allowance",
      title: "Special Worker Allowance Act",
      category: "Labor & Welfare",
      icon: HeartHandshake,
      color: "text-rose-400 bg-rose-950/40 border-rose-900/30",
      short: "Rs 1,000 allowance for workers earning under Rs 20,000.",
      text: "Under Section 18 of the Workers' Rights Act, a revised Special Allowance of Rs 1,000 monthly shall be disbursed to all registered full-time employees whose aggregate monthly remuneration does not exceed the statutory threshold of Rs 20,000, to offset fluctuations in the Consumer Price Index."
    },
    {
      id: "pension",
      title: "Basic Retirement Pension Uplift",
      category: "Social Security",
      icon: Landmark,
      color: "text-blue-400 bg-blue-950/40 border-blue-900/30",
      short: "Basic pension adjusted to Rs 13,500 monthly for ages 60-74.",
      text: "The National Pensions (Amendment) Regulations dictate a comprehensive restructuring of the Basic Retirement Pension (BRP) to align base payouts with macroeconomic indices, establishing a statutory flat rate of Rs 13,500 monthly for eligible beneficiaries aged 60 to 74."
    },
    {
      id: "sme",
      title: "SME Digital Transformation Grant",
      category: "Enterprise & Tech",
      icon: Store,
      color: "text-amber-400 bg-amber-950/40 border-amber-900/30",
      short: "50% matching grant up to Rs 200,000 for software & tech upgrades.",
      text: "The Ministry of Finance shall establish a technology facilitation fund whereby eligible small and medium enterprises (SMEs) can claim a 50% non-refundable matching grant up to Rs 200,000 for acquiring qualified enterprise resource planning software, cloud database infrastructure, and e-commerce interfaces."
    },
    {
      id: "employment",
      title: "Youth Prime à l'Emploi",
      category: "Employment",
      icon: Briefcase,
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/30",
      short: "Government co-funds youth salary up to Rs 15,000/month for a year.",
      text: "To foster sustainable youth integration, the State will co-fund the salary of newly recruited registered job seekers aged 18 to 35 under the Prime à l'Emploi scheme, up to a maximum contribution of Rs 15,000 per month for a non-renewable period of 12 calendar months."
    },
    {
      id: "solar",
      title: "Solar Photovoltaic Rebate Scheme",
      category: "Clean Energy",
      icon: Zap,
      color: "text-purple-400 bg-purple-950/40 border-purple-900/30",
      short: "Zero VAT and 100% tax deduction on home solar installations.",
      text: "Pursuant to the National Clean Energy Transition Plan, domestic households installing grid-tied solar photovoltaic systems with certified inverters are entitled to a zero-rate VAT status on equipment purchase and an immediate 100% tax deduction on the net capital expenditure."
    }
  ];

  const handleMeasureClick = (measure: typeof keyMeasures[0]) => {
    setInputText(measure.text);
    setSelectedId(measure.id);
  };

  const handleSimplify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      originalText: userText
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedId(null);
    setLoading(true);

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText })
      });
      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          originalText: userText,
          simplifiedText: data.simplifiedText,
          kreolText: data.kreolText
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to simplify text.");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        originalText: userText,
        error: "Failed to connect to the AI model. Check your internet connection or secret key settings."
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Grid containing Key Measures Explorer and AI Budget Simplifier side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Side: Measure Explainer Library */}
        <section className="flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-2 border-b border-slate-850 pb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold block">
              Section 02 / National Policy &amp; Law
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-white">
              Key Measures Explorer
            </h1>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
              Understand the official legal statements behind the newest public budget measures. Select any card below to load its original text into the AI tool for plain English and Kreol translations.
            </p>
          </div>

          {/* Interactive Measures List */}
          <div className="flex flex-col gap-3 flex-grow max-h-[550px] overflow-y-auto pr-1">
            {keyMeasures.map((measure) => {
              const IconComp = measure.icon;
              const isSelected = selectedId === measure.id || inputText === measure.text;
              return (
                <div
                  key={measure.id}
                  onClick={() => handleMeasureClick(measure)}
                  className={`group cursor-pointer p-4 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? "bg-blue-950/20 border-blue-500/80 shadow-md shadow-blue-500/5" 
                      : "bg-slate-900 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`p-2 rounded-lg border ${measure.color} shrink-0 mt-0.5`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{measure.category}</span>
                        {isSelected && (
                          <span className="text-[8px] font-mono font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Loaded
                          </span>
                        )}
                      </div>
                      <h3 className={`text-xs font-bold leading-snug transition-colors ${
                        isSelected ? "text-blue-400" : "text-white group-hover:text-blue-400"
                      }`}>
                        {measure.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {measure.short}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Helper Tips Banner */}
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex gap-3 items-start">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              <strong>Tip:</strong> You aren't limited to this list! If you have any other complex policy document, tax form excerpt, or news release, simply copy and paste it directly into the AI Simplifier text box on the right.
            </p>
          </div>
        </section>

        {/* Right Side: AI Budget Simplifier */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-slate-850 pb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold block">
              Section 03 / AI Legal Interpretation
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-white flex items-center gap-2">
              AI Measure Explainer
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
            </h1>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
              Paste complex budget policies or legal clauses to translate them instantly into simple, plain English and Kreol. Powered by Gemini.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 flex flex-col h-[550px] overflow-hidden rounded-2xl shadow-xs">
            
            {/* Chat/Result Area */}
            <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-5 bg-slate-950/20">
              <AnimatePresence initial={false}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-3">
                    
                    {/* User Legalese Input block */}
                    {msg.type === "assistant" && msg.originalText && (
                      <div className="flex items-start">
                        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 max-w-[95%]">
                          <span className="font-bold text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 block">Legalese Input</span>
                          <p className="text-xs font-serif text-slate-300 italic leading-relaxed">
                            "{msg.originalText}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* User raw text check */}
                    {msg.type === "user" && (
                      <div className="flex justify-end">
                        <div className="border-r-4 border-blue-500 bg-blue-950/10 pr-4 pl-3 py-2 rounded-l-xl max-w-[85%]">
                          <span className="font-bold text-[9px] uppercase tracking-widest text-blue-450 mb-1 block">Your Query</span>
                          <p className="text-xs font-mono text-white">
                            {msg.originalText}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* AI Response Block */}
                    {msg.type === "assistant" && (msg.simplifiedText || msg.error) && (
                      <div className="flex items-start">
                        
                        {msg.error ? (
                          <div className="border border-rose-950 bg-rose-950/20 p-4 rounded-xl max-w-[95%] text-rose-400 text-xs flex gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{msg.error}</span>
                          </div>
                        ) : (
                          <div className="border border-blue-900/40 bg-blue-950/10 rounded-2xl p-5 max-w-[98%] flex flex-col gap-4 shadow-2xs">
                            {/* English block */}
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="font-bold text-[10px] uppercase tracking-widest text-blue-300">Simple Explanation</span>
                                <span className="text-[8px] font-mono font-bold bg-blue-900/40 text-blue-200 px-2 py-0.5 rounded-md uppercase">English</span>
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                                {msg.simplifiedText}
                              </p>
                            </div>

                            {/* Kreol Block */}
                            <div className="pt-4 border-t border-dashed border-slate-800">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="font-bold text-[10px] uppercase tracking-widest text-emerald-300">Tradiksion (Kreol)</span>
                                <span className="text-[8px] font-mono font-bold bg-emerald-900/40 text-emerald-200 px-2 py-0.5 rounded-md uppercase">Kreol</span>
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                                {msg.kreolText}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-xs text-blue-400 font-mono uppercase tracking-wider"
                  >
                    <div className="w-6 h-6 border border-blue-900 flex items-center justify-center animate-spin rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span>AI is reading policy &amp; simplifying...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex flex-col gap-3">
              <form onSubmit={handleSimplify} className="flex gap-3 items-center">
                <textarea 
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setSelectedId(null);
                  }}
                  placeholder="Paste complex budget measure or legal text..."
                  rows={1}
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-11 min-h-[44px]"
                />
                <button 
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white disabled:text-slate-500 h-11 px-5 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm shadow-blue-500/10"
                >
                  <span>Simplify</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              
              <div className="flex flex-wrap gap-2 items-center text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <span>Quick actions:</span>
                <button 
                  onClick={() => handleMeasureClick(keyMeasures[0])}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-full cursor-pointer font-bold transition-all"
                >
                  Worker Allowance Act
                </button>
                <button 
                  onClick={() => handleMeasureClick(keyMeasures[1])}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-full cursor-pointer font-bold transition-all"
                >
                  Pension Restructure
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
