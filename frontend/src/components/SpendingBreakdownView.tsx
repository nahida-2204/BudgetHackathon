import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp } from "lucide-react";

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
  rawValue: number;   // actual Rs amount
  allocationPer1k: number; // Rs per Rs 1,000
  percentage: string;
  color: string;
  desc: string;
}

const SECTOR_CONFIG: Array<{ key: SectorKey; name: string; color: string; desc: string }> = [
  { key: "social_security", name: "Social Security", color: "bg-indigo-500 dark:bg-indigo-400", desc: "Pensions, social aid, and basic retirement protection." },
  { key: "education",       name: "Education",       color: "bg-blue-500 dark:bg-blue-400",   desc: "Primary, secondary, and tertiary public schooling." },
  { key: "health",          name: "Health",          color: "bg-emerald-500 dark:bg-emerald-400", desc: "Public hospitals, healthcare equipment, and medicine." },
  { key: "infrastructure",  name: "Infrastructure",  color: "bg-amber-500 dark:bg-amber-400",  desc: "Road networks, water supply, and transport facilities." },
  { key: "public_order",    name: "Public Order",    color: "bg-slate-500 dark:bg-slate-400",  desc: "Police force, judicial systems, and civil safety." },
  { key: "ict",             name: "ICT",             color: "bg-violet-500 dark:bg-violet-400", desc: "Digital government, connectivity, and technology infrastructure." },
  { key: "tourism",         name: "Tourism",         color: "bg-cyan-500 dark:bg-cyan-400",    desc: "Tourism development, destination marketing, and visitor services." },
  { key: "others",          name: "Others",          color: "bg-teal-500 dark:bg-teal-400",    desc: "General administrative costs and other public sector support." },
];

// Fallback uses approximate real-world figures
const FALLBACK_BREAKDOWN_DATA: BreakdownItem[] = [
  { name: "Social Security", rawValue: 57_000_000_000, allocationPer1k: 280, percentage: "28%", color: "bg-indigo-500 dark:bg-indigo-400", desc: "Pensions, social aid, and basic retirement protection." },
  { name: "Education",       rawValue: 32_000_000_000, allocationPer1k: 160, percentage: "16%", color: "bg-blue-500 dark:bg-blue-400",   desc: "Primary, secondary, and tertiary public schooling." },
  { name: "Health",          rawValue: 24_000_000_000, allocationPer1k: 120, percentage: "12%", color: "bg-emerald-500 dark:bg-emerald-400", desc: "Public hospitals, healthcare equipment, and medicine." },
  { name: "Public Order",    rawValue: 22_000_000_000, allocationPer1k: 110, percentage: "11%", color: "bg-slate-500 dark:bg-slate-400",  desc: "Police force, judicial systems, and civil safety." },
  { name: "Infrastructure",  rawValue: 18_000_000_000, allocationPer1k: 90,  percentage: "9%",  color: "bg-amber-500 dark:bg-amber-400",  desc: "Road networks, water supply, and transport facilities." },
  { name: "Others",          rawValue: 18_000_000_000, allocationPer1k: 90,  percentage: "9%",  color: "bg-teal-500 dark:bg-teal-400",    desc: "General administrative costs and public sector support." },
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
    { threshold: 1_000_000,     label: "Million" },
    { threshold: 1_000,         label: "Thousand" },
  ];
  const unit = units.find(({ threshold }) => amount >= threshold);
  if (!unit) return `Rs ${amount.toLocaleString("en-US")}`;
  const scaled = amount / unit.threshold;
  const formatted = Number.isInteger(scaled) ? scaled.toFixed(0) : scaled.toFixed(1);
  return `Rs ${formatted} ${unit.label}`;
};

export default function SpendingBreakdownView() {
  const [animateBars, setAnimateBars] = useState(false);
  const [breakdownData, setBreakdownData] = useState<BreakdownItem[]>(FALLBACK_BREAKDOWN_DATA);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(180_000_000_000);
  const [totalExpenditure, setTotalExpenditure] = useState<number | null>(205_000_000_000);

  useEffect(() => {
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

        if (!response.ok) throw new Error(`Spending API returned ${response.status}`);

        const result = (await response.json()) as SpendingApiResponse;
        if (result.status !== "success" || !Array.isArray(result.data) || result.data.length === 0)
          throw new Error("Spending API returned no budget data");

        const spendingData = result.data[0];
        const apiTotalRevenue = parseBudgetValue(spendingData.total_revenue);
        const apiTotalExpenditure = parseBudgetValue(spendingData.total_expenditure);

        const availableSectors = SECTOR_CONFIG.flatMap(({ key, ...sector }) => {
          const value = parseBudgetValue(spendingData[key]);
          return value === null ? [] : [{ ...sector, value }];
        });

        const sectorTotal = availableSectors.reduce((sum, s) => sum + s.value, 0);
        const allocationBase = apiTotalExpenditure && apiTotalExpenditure > 0 ? apiTotalExpenditure : sectorTotal;

        const nextBreakdown = availableSectors.map((sector) => {
          const share = allocationBase > 0 ? sector.value / allocationBase : 0;
          return {
            name: sector.name,
            rawValue: sector.value,
            allocationPer1k: Math.round(share * 1_000),
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
        console.error("Unable to load spending breakdown; using fallback values.", error);
      }
    };

    void loadSpendingData();
    return () => controller.abort();
  }, []);

  const hasTotals = totalRevenue !== null || totalExpenditure !== null;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 font-bold block">
          Section 01 / Fund Allocation
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-800 dark:text-white">
          Where Your Money Goes
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed font-medium">
          Explore a breakdown of the national budget across key sectors and compare total national income versus expenditure.
        </p>
      </header>

      {/* Main grid: sector bars + revenue/expenditure cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Sector Breakdown */}
        <section className={`${hasTotals ? "lg:col-span-8" : "lg:col-span-12"} bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-6 rounded-2xl shadow-xs`}>
          <div className="pb-4 border-b border-slate-50 dark:border-slate-850">
            <h2 className="text-base md:text-lg font-serif font-black text-slate-800 dark:text-white">Sector Allocations</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Actual budget allocations per sector for the 2025–2026 financial year.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {breakdownData.length === 0 && (
              <p className="py-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                No sector allocation data is available.
              </p>
            )}
            {breakdownData.map((d, index) => (
              <div key={d.name} className="flex items-center gap-4 group">
                {/* Fixed-width label block: name on top, value below */}
                <div className="w-48 shrink-0">
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">{d.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">{formatBudgetAmount(d.rawValue)}</div>
                </div>

                <div className="flex-grow h-7 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: animateBars ? d.percentage : 0 }}
                    transition={{ delay: index * 0.05, duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${d.color} rounded-full flex items-center justify-end pr-3 shrink-0`}
                  >
                    <span className="text-[9px] font-mono font-bold text-white hidden sm:inline">{d.percentage}</span>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-[10px] font-serif italic text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:inline">
                      {d.desc}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue / Expenditure cards */}
        {hasTotals && (
          <section className="lg:col-span-4 flex flex-col gap-6">
            {totalRevenue !== null && (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-4 rounded-2xl shadow-xs">
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
                  {[["bg-blue-500", "Direct Taxes", "42%"], ["bg-indigo-500", "Indirect Taxes (VAT)", "48%"], ["bg-teal-500", "Grants & Other", "10%"]].map(([color, label, pct]) => (
                    <li key={label} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${color} rounded-full shrink-0`}></span>
                        <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">{label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">{pct}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {totalExpenditure !== null && (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-4 rounded-2xl shadow-xs">
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
                  {[["bg-emerald-500", "Current Expenditures", "75%"], ["bg-amber-500", "Capital Projects", "15%"], ["bg-rose-500", "Debt Repayment", "10%"]].map(([color, label, pct]) => (
                    <li key={label} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${color} rounded-full shrink-0`}></span>
                        <span className="text-xs font-bold tracking-wide text-slate-600 dark:text-slate-400">{label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">{pct}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Rs 1,000 Allocation Model — separate section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-6 rounded-2xl shadow-xs">
        <div className="pb-4 border-b border-slate-50 dark:border-slate-850">
          <h2 className="text-base md:text-lg font-serif font-black text-slate-800 dark:text-white">The Rs 1,000 Allocation Model</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            For every Rs 1,000 spent by the state, the capital is dispersed as follows:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {breakdownData.map((d) => (
            <div key={d.name} className="flex flex-col gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${d.color}`} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{d.name}</span>
              </div>
              <span className="text-3xl font-mono font-bold text-white">Rs {d.allocationPer1k}</span>
              <span className="text-[10px] text-slate-500">{d.percentage} of total</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
