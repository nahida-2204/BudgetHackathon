import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Landmark, ArrowRight, Info, Calendar, Sparkles, Users, PieChart, ShieldAlert } from "lucide-react";

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const historicalData = [
    { year: 2024, revenue: 150, spending: 162, deficit: -12, gdp: "2.5%" },
    { year: 2023, revenue: 135, spending: 144, deficit: -9, gdp: "2.1%" },
    { year: 2022, revenue: 118, spending: 132, deficit: -14, gdp: "3.2%" },
    { year: 2021, revenue: 102, spending: 125, deficit: -23, gdp: "5.8%" },
    { year: 2020, revenue: 94, spending: 118, deficit: -24, gdp: "6.2%" },
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Friendly Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/20 via-indigo-950/10 to-amber-950/10 border border-slate-800/80 p-8 md:p-16 text-center shadow-xs">
        
        {/* Colorful National Accents */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
          <div className="flex-1 bg-[#EA4335]" />
          <div className="flex-1 bg-[#4285F4]" />
          <div className="flex-1 bg-[#FBBC05]" />
          <div className="flex-1 bg-[#34A853]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-950/50 border border-blue-900/40 px-3.5 py-1.5 rounded-full text-blue-300 font-bold text-[10px] uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Budget Transparency Portal</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-serif font-black tracking-tight text-white mb-6 leading-tight"
          >
            Empowering Every Citizen to Understand Public Spending
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-sm md:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed font-medium"
          >
            Explore how national revenues are gathered, simplified by artificial intelligence, and redistributed to fund community-focused services in Mauritius.
          </motion.p>
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => onNavigate("spending")}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              <span>Explore 2024 Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-slate-450" />
              <span>View History Trends</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Budget at a Glance Section */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-850 pb-4 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold block mb-1">
              Fiscal Metrics Summary
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-black text-white">Budget at a Glance (2024)</h2>
          </div>
          <button 
            onClick={() => onNavigate("spending")}
            className="text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 hover:underline transition-all flex items-center gap-1 cursor-pointer w-fit"
          >
            <span>Interactive charts</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Revenue Card */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-slate-900 border border-slate-800/80 p-6 md:p-8 flex flex-col justify-between transition-all rounded-2xl shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2 text-blue-400 mb-4 font-bold text-[11px] tracking-wider uppercase font-sans">
                <div className="p-2 bg-blue-950/40 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span>National Revenues</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white">Rs 150B</div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/50">
              <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "92%" }}></div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">VAT, Corporate &amp; Income tax contributions</p>
            </div>
          </motion.div>

          {/* Total Spending Card */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-slate-900 border border-slate-800/80 p-6 md:p-8 flex flex-col justify-between transition-all rounded-2xl shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-4 font-bold text-[11px] tracking-wider uppercase font-sans">
                <div className="p-2 bg-emerald-950/40 rounded-xl">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <span>Public Spending</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white">Rs 162B</div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/50">
              <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }}></div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Healthcare, infrastructure &amp; civil pensions</p>
            </div>
          </motion.div>

          {/* Fiscal Deficit Card */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-6 md:p-8 flex flex-col justify-between rounded-2xl shadow-md"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-4 font-bold text-[11px] tracking-wider uppercase font-sans">
                <div className="p-2 bg-white/10 rounded-xl">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span>Fiscal Deficit</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white">- Rs 12B</div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-400/20 uppercase tracking-wider font-mono">
                ~2.5% of GDP
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Co-funded through national treasury bonds</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User-friendly Grid Columns */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-850">
        
        {/* Card 1: Justify Spending */}
        <div 
          onClick={() => onNavigate("spending")}
          className="group cursor-pointer bg-slate-900 hover:bg-slate-850/30 border border-slate-800/80 p-6 rounded-2xl hover:border-blue-900/50 transition-all shadow-xs"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-blue-950/40 text-blue-400 rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Spending Breakdown</span>
          </div>
          <h3 className="text-lg font-serif font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
            Where Does the Money Go?
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Explore simple interactive visual graphs of public expenditures. See how national resources are balanced to support public amenities.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-400">
            <span>Explore categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Measure Impact */}
        <div 
          onClick={() => onNavigate("impact")}
          className="group cursor-pointer bg-slate-900 hover:bg-slate-850/30 border border-slate-800/80 p-6 rounded-2xl hover:border-emerald-900/50 transition-all shadow-xs"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-emerald-950/40 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Citizen Impact Hub</span>
          </div>
          <h3 className="text-lg font-serif font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">
            How It Affects You
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Select your citizen profile—such as Student, Worker, Pensioner, or Small Business Owner—to review a personalized ledger of direct benefits.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span>Find your benefits</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Measure Explainer & AI */}
        <div 
          onClick={() => onNavigate("transparency")}
          className="group cursor-pointer bg-slate-900 hover:bg-slate-850/30 border border-slate-800/80 p-6 rounded-2xl hover:border-amber-900/50 transition-all shadow-xs"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-amber-950/40 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">Measure Explainer &amp; AI</span>
          </div>
          <h3 className="text-lg font-serif font-black text-white mb-2 group-hover:text-amber-400 transition-colors">
            AI Measure Explainer
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Paste or select complex government measures, laws, or official statements to receive instant simple English and Kreol translations.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <span>Explain key measures</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Historical Data Comparison Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
          <motion.div 
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-3xl shadow-xl max-w-2xl w-full p-6 md:p-8 border border-slate-800 relative overflow-hidden"
          >
            {/* Colorful accent line */}
            <div className="absolute top-0 left-0 w-full h-1 flex">
              <div className="flex-1 bg-[#EA4335]" />
              <div className="flex-1 bg-[#4285F4]" />
              <div className="flex-1 bg-[#FBBC05]" />
              <div className="flex-1 bg-[#34A853]" />
            </div>

            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-xl font-serif font-black text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-400" />
                Historical Budget Trends
              </h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-450 hover:text-white text-2xl font-black cursor-pointer px-2"
              >
                &times;
              </button>
            </div>

            <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed">
              Compare primary fiscal statistics over the past five financial years in Mauritius. All figures are presented in Billions of Rupees (Rs).
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3 font-mono">Financial Year</th>
                    <th className="p-3 font-mono">Total Revenue</th>
                    <th className="p-3 font-mono">Total Spending</th>
                    <th className="p-3 font-mono">Deficit</th>
                    <th className="p-3 font-mono">% of GDP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {historicalData.map((d) => (
                    <tr key={d.year} className="hover:bg-slate-850/50 font-medium">
                      <td className="p-3 font-bold font-mono text-white">{d.year}</td>
                      <td className="p-3 font-mono">Rs {d.revenue}B</td>
                      <td className="p-3 font-mono">Rs {d.spending}B</td>
                      <td className="p-3 text-rose-400 font-bold font-mono">- Rs {Math.abs(d.deficit)}B</td>
                      <td className="p-3 font-mono text-slate-400">{d.gdp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Close Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
