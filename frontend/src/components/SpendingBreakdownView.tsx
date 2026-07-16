import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Calculator } from "lucide-react";

const SPENDING_BREAKDOWN_API_URL = "/api/spendings";

type SectorKey =
  | "social_security"
  | "education"
  | "health"
  | "infrastructure"
  | "public_order"
  | "ict"
  | "tourism"
  | "others";

interface SpendingDataRecord {
  id: number;
  financial_year: string;
  total_revenue: string;
  total_expenditure: string;
  social_security: string;
  education: string;
  health: string;
  infrastructure: string;
  public_order: string;
  ict: string;
  tourism: string;
  others: string;
  created_at: string;
}

interface SpendingApiResponse {
  status: string;
  count: number;
  data: SpendingDataRecord[];
}

interface BreakdownItem {
  name: string;
  amount: number;
  percentage: string;
  color: string;
  desc: string;
}

const SECTOR_CONFIG: Array<{
  key: SectorKey;
  name: string;
  color: string;
  desc: string;
}> = [
  { key: "social_security", name: "Social Security", color: "bg-indigo-500 dark:bg-indigo-400", desc: "Pensions, social aid, and basic retirement protection." },
  { key: "education", name: "Education", color: "bg-blue-500 dark:bg-blue-400", desc: "Primary, secondary, and tertiary public schooling." },
  { key: "health", name: "Health", color: "bg-emerald-500 dark:bg-emerald-400", desc: "Public hospitals, healthcare equipment, and medicine." },
  { key: "infrastructure", name: "Infrastructure", color: "bg-amber-500 dark:bg-amber-400", desc: "Road networks, water supply, and transport facilities." },
  { key: "public_order", name: "Public Order", color: "bg-slate-500 dark:bg-slate-400", desc: "Police force, judicial systems, and civil safety." },
  { key: "ict", name: "ICT", color: "bg-violet-500 dark:bg-violet-400", desc: "Digital government, connectivity, and technology infrastructure." },
  { key: "tourism", name: "Tourism", color: "bg-cyan-500 dark:bg-cyan-400", desc: "Tourism development, destination marketing, and visitor services." },
  { key: "others", name: "Others", color: "bg-teal-500 dark:bg-teal-400", desc: "General administrative costs and other public sector support." },
];

const FALLBACK_BREAKDOWN_DATA: BreakdownItem[] = [
  { name: "Social Security", amount: 280, percentage: "28%", color: "bg-indigo-500 dark:bg-indigo-400", desc: "Pensions, social aid, and basic retirement protection." },
  { name: "Education", amount: 160, percentage: "16%", color: "bg-blue-500 dark:bg-blue-400", desc: "Primary, secondary, and tertiary public schooling." },
  { name: "Health", amount: 120, percentage: "12%", color: "bg-emerald-500 dark:bg-emerald-400", desc: "Public hospitals, healthcare equipment, and medicine." },
  { name: "Public Order", amount: 110, percentage: "11%", color: "bg-slate-500 dark:bg-slate-400", desc: "Police force, judicial systems, and civil safety." },
  { name: "Infrastructure", amount: 90, percentage: "9%", color: "bg-amber-500 dark:bg-amber-400", desc: "Road networks, water supply, and transport facilities." },
  { name: "Debt Servicing", amount: 150, percentage: "15%", color: "bg-rose-500 dark:bg-rose-400", desc: "Interests and servicing of public national debt." },
  { name: "Other", amount: 90, percentage: "9%", color: "bg-teal-500 dark:bg-teal-400", desc: "General administrative costs and public sector support." },
];

const parseBudgetValue = (value: unknown): number | null => {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const normalized = String(value).trim();
  if (normalized === "-1") return null;

  const parsed = Number(normalized.replace(/[\s,]/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const formatPercentage = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
};

const formatBudgetAmount = (amount: number) => {
  const units = [
    { threshold: 1_000_000_000, label: "Billion" },
    { threshold: 1_000_000, label: "Million" },
    { threshold: 1_000, label: "Thousand" },
  ];
  const unit = units.find(({ threshold }) => amount >= threshold);

  if (!unit) return `Rs ${amount.toLocaleString("en-US")}`;

  const scaled = amount / unit.threshold;
  const formatted = Number.isInteger(scaled) ? scaled.toFixed(0) : scaled.toFixed(1);
  return `Rs ${formatted} ${unit.label}`;
};

export default function SpendingBreakdownView() {
  const [personalTax, setPersonalTax] = useState<string>("5000");
  const [animateBars, setAnimateBars] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [breakdownData, setBreakdownData] = useState<BreakdownItem[]>(FALLBACK_BREAKDOWN_DATA);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(180_000_000_000);
  const [totalExpenditure, setTotalExpenditure] = useState<number | null>(205_000_000_000);

  useEffect(() => {
    // Trigger bar animations on mount
    const timer = setTimeout(() => setAnimateBars(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadSpendingData = async () => {
      try {
        const response = await fetch(SPENDING_BREAKDOWN_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Spending API returned ${response.status}`);
        }

        const result = (await response.json()) as SpendingApiResponse;

        if (result.status !== "success" || !Array.isArray(result.data) || result.data.length === 0) {
          throw new Error("Spending API returned no budget data");
        }

        const spendingData = result.data[0];
        const apiTotalRevenue = parseBudgetValue(spendingData.total_revenue);
        const apiTotalExpenditure = parseBudgetValue(spendingData.total_expenditure);
        const availableSectors = SECTOR_CONFIG.flatMap(({ key, ...sector }) => {
          const value = parseBudgetValue(spendingData[key]);
          return value === null ? [] : [{ ...sector, value }];
        });

        const availableSectorTotal = availableSectors.reduce((sum, sector) => sum + sector.value, 0);
        const allocationBase = apiTotalExpenditure && apiTotalExpenditure > 0
          ? apiTotalExpenditure
          : availableSectorTotal;
        const nextBreakdown = availableSectors.map((sector) => {
          const share = allocationBase > 0 ? sector.value / allocationBase : 0;
          return {
            name: sector.name,
            amount: Math.round(share * 1_000),
            percentage: formatPercentage(share * 100),
            color: sector.color,
            desc: sector.desc,
          };
        });

        if (!controller.signal.aborted) {
          setTotalRevenue(apiTotalRevenue);
          setTotalExpenditure(apiTotalExpenditure);
          setBreakdownData(nextBreakdown);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        // Keep the current hardcoded values available while the placeholder URL is in use.
        console.error("Unable to load spending breakdown; using fallback values.", error);
      }
    };

    void loadSpendingData();
    return () => controller.abort();
  }, []);

  const hasTotals = totalRevenue !== null || totalExpenditure !== null;

  const calculatedTaxContribution = (amount: number) => {
    const parsed = parseFloat(personalTax) || 0;
    return Math.round((parsed * amount) / 1000).toLocaleString();
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header Section */}
      <header className="flex flex-col gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 font-bold block">
          Section 01 / Fund Allocation Model
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-800 dark:text-white">
          Where Your Money Goes
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed font-medium">
          Explore a simplified breakdown of the national budget. See exactly how your tax rupees are allocated across key sectors and compare total national income versus expenditure.
        </p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Rs 1,000 Breakdown (Span 8) */}
        <section className={`${hasTotals ? "lg:col-span-8" : "lg:col-span-12"} bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-6 rounded-2xl shadow-xs relative overflow-hidden`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-50 dark:border-slate-850">
            <div>
              <h2 className="text-base md:text-lg font-serif font-black text-slate-800 dark:text-white">The Rs 1,000 Allocation Model</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                For every Rs 1,000 spent by the state, the capital is dispersed as follows:
              </p>
            </div>
            
            <button 
              onClick={() => setCalculatorOpen(!calculatorOpen)}
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100/30 dark:border-blue-900/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-full transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{calculatorOpen ? "Hide Calculator" : "Try Tax Calculator"}</span>
            </button>
          </div>

          {/* Interactive Calculator Slide down */}
          {calculatorOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-blue-50/45 dark:bg-slate-850/50 p-5 border border-blue-100/30 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between rounded-xl"
            >
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-serif font-black text-slate-800 dark:text-white text-xs md:text-sm">Personal Tax Calculator</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                  Enter the approximate total tax (VAT, Income Tax, Excise duties) you contribute per year (in Rs) to calculate your specific sector-by-sector contribution.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">RS</span>
                <input 
                  type="number"
                  value={personalTax}
                  onChange={(e) => setPersonalTax(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-32 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </motion.div>
          )}

          {/* Visualization Area */}
          <div className="flex flex-col gap-5 relative z-10 mt-2">
            {breakdownData.length === 0 && (
              <p className="py-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                No sector allocation data is available.
              </p>
            )}
            {breakdownData.map((d, index) => (
              <div key={d.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                {/* Label Section */}
                <div className="sm:w-44 shrink-0 flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-sans">
                  <span>{d.name}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">Rs {d.amount}</span>
                </div>
                
                {/* Progress bar container */}
                <div className="flex-grow h-8 bg-slate-50 dark:bg-slate-850 rounded-full overflow-hidden flex relative border border-slate-100 dark:border-slate-800/80 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: animateBars ? d.percentage : 0 }}
                    transition={{ delay: index * 0.05, duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${d.color} rounded-full flex items-center justify-end pr-3`}
                  >
                    <span className="text-[9px] font-mono font-bold text-white dark:text-slate-900 hidden sm:inline">{d.percentage}</span>
                  </motion.div>

                  {/* Description text displayed beautifully on hover */}
                  <div className="absolute inset-0 flex items-center justify-start pl-4 pointer-events-none">
                    <span className="text-[10px] font-serif italic text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 hidden lg:inline">
                      {d.desc}
                    </span>
                  </div>
                </div>

                {/* Personal tax contribution calculation */}
                {calculatorOpen && (
                  <div className="text-right sm:w-28 shrink-0 font-mono font-bold text-xs text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/20 dark:border-blue-900/30 px-3 py-1.5 rounded-full self-end sm:self-center">
                    Rs {calculatedTaxContribution(d.amount)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Money In vs Money Out (Span 4) */}
        {hasTotals && <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Money In Card */}
          {totalRevenue !== null && <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-850 pb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 block">Revenue Model</span>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-800 dark:text-white">Money In (Revenue)</h3>
              </div>
            </div>
            
            <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white">{formatBudgetAmount(totalRevenue)}</div>
            
            <ul className="flex flex-col gap-1.5 mt-2">
              <li className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></span>
                  <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">Direct Taxes</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">42%</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full shrink-0"></span>
                  <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">Indirect Taxes (VAT)</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">48%</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-teal-500 rounded-full shrink-0"></span>
                  <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">Grants &amp; Other</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">10%</span>
              </li>
            </ul>
          </div>}

          {/* Money Out Card */}
          {totalExpenditure !== null && <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-850 pb-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <ArrowUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 block">Expenditure Model</span>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-800 dark:text-white">Money Out (Spending)</h3>
              </div>
            </div>
            
            <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white">{formatBudgetAmount(totalExpenditure)}</div>
            
            <ul className="flex flex-col gap-1.5 mt-2">
              <li className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0"></span>
                  <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">Current Expenditures</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">75%</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0"></span>
                  <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">Capital Projects</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">15%</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shrink-0"></span>
                  <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">Debt Repayment</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">10%</span>
              </li>
            </ul>
          </div>}
        </section>}
      </div>
    </div>
  );
}
