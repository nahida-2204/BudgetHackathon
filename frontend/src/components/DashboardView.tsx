import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Landmark, ArrowRight, Calendar, Sparkles, Users, PieChart, ShieldAlert } from "lucide-react";

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

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-slate-200 shadow-sm">
        {/* Mauritius flag stripe */}
        <div className="absolute top-0 left-0 w-full h-[3px] flex">
          <div className="flex-1 bg-[#EA4335]" />
          <div className="flex-1 bg-[#4285F4]" />
          <div className="flex-1 bg-[#FBBC05]" />
          <div className="flex-1 bg-[#34A853]" />
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_360px] items-stretch">
          {/* Left: Headline & CTAs */}
          <div className="px-8 md:px-14 pt-12 pb-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full text-blue-700 font-semibold text-[10px] uppercase tracking-wider mb-6 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Budget Transparency Portal</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-5xl xl:text-[56px] font-serif font-black tracking-tight text-slate-900 mb-5 leading-[1.05]"
            >
              Your budget,<br />
              <span className="text-blue-600">clearly explained.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-sm md:text-[15px] text-slate-600 mb-8 max-w-md leading-relaxed"
            >
              Discover how Mauritius's national revenues are collected, how public funds are allocated across every sector, and what every budget measure means for your daily life.
            </motion.p>
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              <button
                onClick={() => onNavigate("spending")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                <span>Explore 2024 Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowHistoryModal(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-7 py-3 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Historical Trends</span>
              </button>
            </motion.div>
          </div>

          {/* Right: Signature number display — desktop only */}
          {/* ponytail: hidden on mobile — avoids layout stacking issues on small screens */}
          <div className="hidden lg:flex flex-col items-center justify-center border-l border-slate-200 px-8 py-12 bg-gradient-to-b from-slate-50 to-white gap-2">
            <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-semibold mb-1">
              Total National Spending
            </div>
            <div className="font-serif font-black leading-none text-[96px] xl:text-[112px] text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-700 to-slate-400 tabular-nums select-none">
              162B
            </div>
            <div className="text-[11px] font-mono text-slate-400 tracking-widest">RUPEES · 2024</div>
            <div className="mt-4 h-1.5 w-44 flex rounded-full overflow-hidden">
              <div className="flex-1 bg-[#EA4335]" />
              <div className="flex-1 bg-[#4285F4]" />
              <div className="flex-1 bg-[#FBBC05]" />
              <div className="flex-1 bg-[#34A853]" />
            </div>
          </div>
        </div>
      </section>

      {/* Budget at a Glance */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold block mb-1">
              Fiscal Metrics Summary
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">Budget at a Glance (2024)</h2>
          </div>
          <button
            onClick={() => onNavigate("spending")}
            className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 hover:underline transition-all flex items-center gap-1 cursor-pointer w-fit"
          >
            <span>Interactive charts</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Revenue Card */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white border border-slate-200 p-6 md:p-8 flex flex-col justify-between transition-all rounded-2xl shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-blue-700 mb-4 font-bold text-[11px] tracking-wider uppercase font-sans">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span>National Revenues</span>
              </div>
              <div className="text-5xl md:text-6xl font-serif font-black text-slate-900 leading-none">Rs 150B</div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "92%" }}></div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">VAT, Corporate &amp; Income tax contributions</p>
            </div>
          </motion.div>

          {/* Total Spending Card */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white border border-slate-200 p-6 md:p-8 flex flex-col justify-between transition-all rounded-2xl shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-700 mb-4 font-bold text-[11px] tracking-wider uppercase font-sans">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <span>Public Spending</span>
              </div>
              <div className="text-5xl md:text-6xl font-serif font-black text-slate-900 leading-none">Rs 162B</div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }}></div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Healthcare, infrastructure &amp; civil pensions</p>
            </div>
          </motion.div>

          {/* Fiscal Deficit Card */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-amber-50 border border-amber-200 p-6 md:p-8 flex flex-col justify-between rounded-2xl shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-700 mb-4 font-bold text-[11px] tracking-wider uppercase font-sans">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span>Fiscal Deficit</span>
              </div>
              <div className="text-5xl md:text-6xl font-serif font-black text-slate-900 leading-none">- Rs 12B</div>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-200">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wider font-mono">
                ~2.5% of GDP
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">Co-funded through national treasury bonds</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200">

        <div
          onClick={() => onNavigate("spending")}
          className="group cursor-pointer bg-white hover:bg-blue-50/50 border border-slate-200 p-6 rounded-2xl hover:border-blue-300 transition-all shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Spending Breakdown</span>
          </div>
          <h3 className="text-xl font-serif font-black text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
            Where Does the Money Go?
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Explore simple interactive visual graphs of public expenditures. See how national resources are balanced to support public amenities.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600">
            <span>Explore categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("impact")}
          className="group cursor-pointer bg-white hover:bg-emerald-50/50 border border-slate-200 p-6 rounded-2xl hover:border-emerald-300 transition-all shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Citizen Impact Hub</span>
          </div>
          <h3 className="text-xl font-serif font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
            How It Affects You
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Select your citizen profile — Student, Worker, Pensioner, or Small Business Owner — to see a personalized view of direct benefits.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <span>Find your benefits</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("transparency")}
          className="group cursor-pointer bg-white hover:bg-amber-50/50 border border-slate-200 p-6 rounded-2xl hover:border-amber-300 transition-all shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Measure Explainer &amp; AI</span>
          </div>
          <h3 className="text-xl font-serif font-black text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
            AI Measure Explainer
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Paste or select complex government measures to receive instant plain English and Kreol explanations powered by AI.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <span>Explain key measures</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Historical Data Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 md:p-8 border border-slate-200 relative overflow-hidden"
          >
            {/* Flag accent */}
            <div className="absolute top-0 left-0 w-full h-[3px] flex">
              <div className="flex-1 bg-[#EA4335]" />
              <div className="flex-1 bg-[#4285F4]" />
              <div className="flex-1 bg-[#FBBC05]" />
              <div className="flex-1 bg-[#34A853]" />
            </div>

            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-serif font-black text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                Historical Budget Trends
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-black cursor-pointer px-2"
              >
                &times;
              </button>
            </div>

            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              Compare primary fiscal statistics over the past five financial years in Mauritius. All figures are presented in Billions of Rupees (Rs).
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3 font-mono">Financial Year</th>
                    <th className="p-3 font-mono">Total Revenue</th>
                    <th className="p-3 font-mono">Total Spending</th>
                    <th className="p-3 font-mono">Deficit</th>
                    <th className="p-3 font-mono">% of GDP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {historicalData.map((d) => (
                    <tr key={d.year} className="hover:bg-slate-50 font-medium">
                      <td className="p-3 font-bold font-mono text-slate-900">{d.year}</td>
                      <td className="p-3 font-mono">Rs {d.revenue}B</td>
                      <td className="p-3 font-mono">Rs {d.spending}B</td>
                      <td className="p-3 text-rose-600 font-bold font-mono">- Rs {Math.abs(d.deficit)}B</td>
                      <td className="p-3 font-mono text-slate-500">{d.gdp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
