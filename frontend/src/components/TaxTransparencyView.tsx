import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Landmark, Send, AlertCircle, Sparkles, Info, CheckCircle2,
  HeartHandshake, Briefcase, Zap, Store, Leaf, HeartPulse,
  GraduationCap, Tractor, MessageSquare, FileText
} from "lucide-react";
import { ChatMessage, KeyMeasureCard } from "../types";

// Static sector → style mapping so cards look good regardless of DB content
const SECTOR_STYLES: Record<string, { icon: React.ElementType; color: string }> = {
  "Technology & AI":      { icon: Zap,            color: "text-purple-700 bg-purple-50 border-purple-200" },
  "Agriculture & Food":   { icon: Tractor,         color: "text-green-700 bg-green-50 border-green-200" },
  "Healthcare":           { icon: HeartPulse,      color: "text-rose-700 bg-rose-50 border-rose-200" },
  "Education":            { icon: GraduationCap,   color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Infrastructure":       { icon: Briefcase,       color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Social Support":       { icon: HeartHandshake,  color: "text-pink-700 bg-pink-50 border-pink-200" },
  "SME & Business":       { icon: Store,           color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Environment & Energy": { icon: Leaf,            color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
};

const DEFAULT_STYLE = { icon: Landmark, color: "text-slate-600 bg-slate-100 border-slate-300" };

// Hardcoded fallback if the API is unavailable
const FALLBACK_MEASURES: KeyMeasureCard[] = [
  {
    id: "social-support",
    sector: "Social Support",
    measures: [
      { title: "Special Worker Allowance", description: "Workers will receive an extra Rs 1,000 allowance monthly to offset rising consumer prices, subject to an income threshold." },
      { title: "Basic Retirement Pension Uplift", description: "Basic pension adjusted to Rs 13,500 monthly for citizens aged 60–74." }
    ]
  },
  {
    id: "sme",
    sector: "SME & Business",
    measures: [
      { title: "SME Digital Transformation Grant", description: "50% matching grant up to Rs 200,000 for qualifying software and e-commerce infrastructure upgrades." }
    ]
  },
  {
    id: "environment",
    sector: "Environment & Energy",
    measures: [
      { title: "Solar Photovoltaic Rebate", description: "Zero VAT and 100% tax deduction for domestic grid-tied solar installations." }
    ]
  }
];

const CURRENT_YEAR = "2026-2027";

export default function TaxTransparencyView() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"simplify" | "chat">("simplify");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [measures, setMeasures] = useState<KeyMeasureCard[]>(FALLBACK_MEASURES);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      originalText: "The Special Allowance paid to workers under Section 18 of the Workers' Rights Act will be increased by Rs 1,000 to offset the inflationary impact on the Consumer Price Index, subject to a revised income threshold.",
      simplifiedText: "Workers will get an extra Rs 1,000 allowance to help with the rising cost of living. There are new rules on who earns enough to qualify.",
      kreolText: "Travayer pou gagn enn ekstra Rs 1,000 allowance pou ed zot ar lavi ki pe vinn ser. Ena nouvo regleman lor komie ou bizin gagne pou kalifie."
    }
  ]);

  useEffect(() => {
    fetch("/api/measures")
      .then((r) => r.json())
      .then((data) => {
        if (data.status !== "success" || !data.data?.length) return;
        const parsed: KeyMeasureCard[] = data.data
          .map((record: { sector: string; measures_list: string }) => {
            try {
              // Strip markdown code fences if present (```json ... ```)
              const raw = record.measures_list.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
              const parsed = JSON.parse(raw);
              // measures_list has shape { sectors: [{ sector, measures: [{title, description}] }] }
              const firstSector = parsed.sectors?.[0];
              return {
                id: record.sector.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                sector: record.sector,
                measures: firstSector?.measures ?? []
              } as KeyMeasureCard;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as KeyMeasureCard[];

        if (parsed.length > 0) setMeasures(parsed);
      })
      .catch(() => {
        // silent fallback — FALLBACK_MEASURES already set as initial state
      });
  }, []);

  const handleMeasureClick = (card: KeyMeasureCard, measure: { title: string; description: string }) => {
    setInputText(measure.description);
    setSelectedId(`${card.id}-${measure.title}`);
    setMode("simplify");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const userMessage: ChatMessage = { id: Date.now().toString(), type: "user", originalText: userText };
    setChatMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedId(null);
    setLoading(true);

    try {
      if (mode === "simplify") {
        const response = await fetch("/api/simplify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error || "Failed to simplify text.");
        setChatMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          originalText: userText,
          simplifiedText: data.simplifiedText,
          kreolText: data.kreolText
        }]);
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userText, year: CURRENT_YEAR })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Chat request failed.");
        setChatMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          originalText: userText,
          simplifiedText: data.answer
        }]);
      }
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        originalText: userText,
        error: mode === "simplify"
          ? "Failed to connect to the AI model. Check your internet connection or secret key settings."
          : "Failed to reach the Budget AI. Make sure the backend server is running."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

        {/* Left: Measure Explorer */}
        <section className="flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold block">
              Section 02 / National Policy &amp; Law
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
              Key Measures Explorer
            </h1>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              Policy measures from the Mauritian National Budget. Select any card to load its text into the AI tool for plain English and Kreol translations.
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-grow max-h-[550px] overflow-y-auto pr-1">
            {measures.map((card) => {
              const style = SECTOR_STYLES[card.sector] ?? DEFAULT_STYLE;
              const IconComp = style.icon;
              return (
                <div key={card.id} className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1">{card.sector}</span>
                  {card.measures.map((m) => {
                    const itemId = `${card.id}-${m.title}`;
                    const isSelected = selectedId === itemId;
                    return (
                      <div
                        key={itemId}
                        onClick={() => handleMeasureClick(card, m)}
                        className={`group cursor-pointer p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-blue-50 border-blue-400 shadow-sm"
                            : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex gap-4 items-start">
                          <div className={`p-2 rounded-lg border ${style.color} shrink-0 mt-0.5`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center gap-2 mb-1">
                              {isSelected && (
                                <span className="text-[8px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Loaded
                                </span>
                              )}
                            </div>
                            <h3 className={`text-xs font-bold leading-snug transition-colors ${
                              isSelected ? "text-blue-700" : "text-slate-900 group-hover:text-blue-700"
                            }`}>
                              {m.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                              {m.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3 items-start">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
              <strong>Tip:</strong> You can also switch to <strong>Budget Chat</strong> on the right to ask any free-form question about the Mauritius budget.
            </p>
          </div>
        </section>

        {/* Right: AI Panel */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold block">
              Section 03 / AI Legal Interpretation
            </span>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-900 flex items-center gap-2">
                {mode === "simplify" ? "AI Measure Explainer" : "Budget AI Chat"}
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
              </h1>
              {/* Mode toggle */}
              <div className="flex gap-1 bg-slate-100 border border-slate-200 rounded-full p-1 shrink-0">
                <button
                  onClick={() => setMode("simplify")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === "simplify" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  Simplify
                </button>
                <button
                  onClick={() => setMode("chat")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === "chat" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  Chat
                </button>
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              {mode === "simplify"
                ? "Paste complex budget policies or legal clauses to translate them into simple English and Kreol."
                : "Ask any question about the Mauritian National Budget. Powered by RAG over official budget documents."}
            </p>
          </div>

          <div className="bg-white border border-slate-200 flex flex-col h-[550px] overflow-hidden rounded-2xl shadow-xs">
            {/* Chat area */}
            <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-5 bg-slate-50">
              <AnimatePresence initial={false}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-3">
                    {msg.type === "assistant" && msg.originalText && (
                      <div className="flex items-start">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-[95%]">
                          <span className="font-bold text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 block">Input</span>
                          <p className="text-xs font-serif text-slate-600 italic leading-relaxed">
                            "{msg.originalText}"
                          </p>
                        </div>
                      </div>
                    )}

                    {msg.type === "user" && (
                      <div className="flex justify-end">
                        <div className="border-r-4 border-blue-500 bg-blue-50 pr-4 pl-3 py-2 rounded-l-xl max-w-[85%]">
                          <span className="font-bold text-[9px] uppercase tracking-widest text-blue-600 mb-1 block">Your Query</span>
                          <p className="text-xs font-mono text-slate-900">{msg.originalText}</p>
                        </div>
                      </div>
                    )}

                    {msg.type === "assistant" && (msg.simplifiedText || msg.error) && (
                      <div className="flex items-start">
                        {msg.error ? (
                          <div className="border border-rose-200 bg-rose-50 p-4 rounded-xl max-w-[95%] text-rose-600 text-xs flex gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{msg.error}</span>
                          </div>
                        ) : msg.kreolText ? (
                          // Simplify mode response (English + Kreol)
                          <div className="border border-blue-200 bg-blue-50 rounded-2xl p-5 max-w-[98%] flex flex-col gap-4 shadow-2xs">
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="font-bold text-[10px] uppercase tracking-widest text-blue-700">Simple Explanation</span>
                                <span className="text-[8px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase">English</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">{msg.simplifiedText}</p>
                            </div>
                            <div className="pt-4 border-t border-dashed border-slate-300">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="font-bold text-[10px] uppercase tracking-widest text-emerald-700">Tradiksion (Kreol)</span>
                                <span className="text-[8px] font-mono font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase">Kreol</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">{msg.kreolText}</p>
                            </div>
                          </div>
                        ) : (
                          // Chat mode response (plain answer)
                          <div className="border border-blue-200 bg-blue-50 rounded-2xl p-5 max-w-[98%] shadow-2xs">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-[10px] uppercase tracking-widest text-blue-700">Budget AI</span>
                              <span className="text-[8px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase">RAG</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{msg.simplifiedText}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-xs text-blue-600 font-mono uppercase tracking-wider"
                  >
                    <div className="w-6 h-6 border border-blue-200 flex items-center justify-center animate-spin rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span>{mode === "simplify" ? "AI is reading policy & simplifying..." : "Searching budget documents..."}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-3">
              <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                <textarea
                  value={inputText}
                  onChange={(e) => { setInputText(e.target.value); setSelectedId(null); }}
                  placeholder={mode === "simplify" ? "Paste complex budget measure or legal text..." : "Ask a question about the Mauritian budget..."}
                  rows={1}
                  className="flex-grow bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none h-11 min-h-[44px] placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 h-11 px-5 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm shadow-blue-500/10"
                >
                  <span>{mode === "simplify" ? "Simplify" : "Ask"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {mode === "chat" && (
                <div className="flex flex-wrap gap-2 items-center text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <span>Quick questions:</span>
                  {["What are the pension changes?", "Key SME incentives?", "Education budget highlights?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInputText(q)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full cursor-pointer font-bold transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
