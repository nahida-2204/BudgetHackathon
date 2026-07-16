import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Bus, 
  Laptop, 
  Baby, 
  Utensils, 
  Smile, 
  Coins, 
  TrendingUp, 
  Percent, 
  HeartHandshake, 
  HeartPulse, 
  Activity, 
  Leaf, 
  Briefcase, 
  CreditCard,
  Briefcase as WorkIcon,
  Smile as FamilyIcon,
  Heart as RetiredIcon,
  Store as SmeIcon,
  Sparkles,
  HandHeart
} from "lucide-react";
import { ImpactProfile } from "../types";

// Which API sectors map to each profile
const PROFILE_SECTORS: Record<string, string[]> = {
  student:     ["Education", "Technology & AI"],
  parent:      ["Social Support", "Education"],
  worker:      ["Social Support", "Infrastructure"],
  pensioner:   ["Healthcare", "Social Support"],
  sme:         ["SME & Business", "Environment & Energy"],
  vulnerable:  ["Social Support"],
};

// Default icon per sector for API-sourced measures
const SECTOR_ICON: Record<string, string> = {
  "Education":            "GraduationCap",
  "Technology & AI":      "Laptop",
  "Social Support":       "HandHeart",
  "Infrastructure":       "Briefcase",
  "Healthcare":           "HeartPulse",
  "SME & Business":       "Store",
  "Environment & Energy": "Leaf",
};

export default function CitizenImpactView() {
  const [activeProfileId, setActiveProfileId] = useState("student");
  // Stores API measures keyed by sector name
  const [sectorMeasures, setSectorMeasures] = useState<Record<string, Array<{ title: string; description: string }>>>({});

  useEffect(() => {
    fetch("/api/measures")
      .then((r) => r.json())
      .then((data) => {
        if (data.status !== "success" || !data.data?.length) return;
        const map: Record<string, Array<{ title: string; description: string }>> = {};
        for (const record of data.data) {
          try {
            const raw = record.measures_list.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
            const parsed = JSON.parse(raw);
            const measures = parsed.sectors?.[0]?.measures ?? [];
            map[record.sector] = measures;
          } catch {
            // skip unparseable records
          }
        }
        setSectorMeasures(map);
      })
      .catch(() => { /* silent fallback to hardcoded */ });
  }, []);

  // Build up to 3 measures for a profile from API data; returns null if no data yet
  const getApiMeasures = (profileId: string): ImpactProfile["measures"] | null => {
    const sectors = PROFILE_SECTORS[profileId] ?? [];
    const collected: ImpactProfile["measures"] = [];
    for (const sector of sectors) {
      const items = sectorMeasures[sector] ?? [];
      for (const m of items) {
        if (collected.length >= 3) break;
        collected.push({
          category: sector,
          title: m.title,
          value: "",
          description: m.description,
          iconName: SECTOR_ICON[sector] ?? "GraduationCap",
        });
      }
      if (collected.length >= 3) break;
    }
    return collected.length > 0 ? collected : null;
  };

  const profiles: ImpactProfile[] = [
    {
      id: "student",
      name: "Student",
      iconName: "GraduationCap",
      title: "Key Measures for Students",
      benefitAmount: "+ Rs 22,000",
      benefitSubtitle: "Based on full utilization of education grants and free transport.",
      measures: [
        {
          category: "Education",
          title: "Increased Monthly Allowance",
          value: "Rs 1,500",
          description: "Monthly grant for tertiary students in local public institutions, up from Rs 1,000.",
          iconName: "Coins"
        },
        {
          category: "Transport",
          title: "Free Bus Pass Extension",
          value: "100%",
          description: "Free public transport now extended to weekend tutorials and approved extra-curricular activities.",
          iconName: "Bus"
        },
        {
          category: "Technology",
          title: "Digital Device Subsidy",
          value: "Rs 10,000",
          description: "A one-off Rs 10,000 voucher for purchasing laptops or tablets for first-year university students.",
          iconName: "Laptop"
        }
      ],
      bullets: [
        "Easier access to digital learning tools.",
        "Reduced daily expenses for transport and meals.",
        "More financial independence while studying."
      ]
    },
    {
      id: "parent",
      name: "Parent",
      iconName: "Baby",
      title: "Key Measures for Families & Parents",
      benefitAmount: "+ Rs 36,000",
      benefitSubtitle: "Based on full school feeding and child allowance increases.",
      measures: [
        {
          category: "Nutrition",
          title: "School Feeding Programme",
          value: "Rs 6,000 /yr",
          description: "Provision of hot, nutritious meals for all pre-primary and primary school children across Mauritius.",
          iconName: "Utensils"
        },
        {
          category: "Family support",
          title: "Increased Child Allowance",
          value: "+ Rs 2,000 /yr",
          description: "Monthly child allowance increased to help parents offset rising educational and health expenses.",
          iconName: "Baby"
        },
        {
          category: "Childcare",
          title: "Crèche Voucher Scheme",
          value: "Rs 3,000 /mth",
          description: "Subsidy voucher for working mothers with infants registered in private daycares.",
          iconName: "Smile"
        }
      ],
      bullets: [
        "Direct financial relief for daily infant daycare.",
        "Guaranteed healthy nutrition for pre-primary children.",
        "Additional support for schooling and stationery expenses."
      ]
    },
    {
      id: "worker",
      name: "Worker",
      iconName: "WorkIcon",
      title: "Key Measures for Employed Citizens",
      benefitAmount: "+ Rs 18,000",
      benefitSubtitle: "Based on personal tax threshold adjustments and direct allowance.",
      measures: [
        {
          category: "Income protection",
          title: "Minimum Wage Adjustment",
          value: "Rs 16,500",
          description: "National basic minimum wage raised significantly to support lower-income households.",
          iconName: "Coins"
        },
        {
          category: "Allowance",
          title: "Special Inflation Support",
          value: "+ Rs 1,000 /mth",
          description: "Direct monthly allowance paid under the Workers' Rights Act to offset living costs.",
          iconName: "TrendingUp"
        },
        {
          category: "Taxation",
          title: "Personal Income Tax Exemption",
          value: "Rs 30k Relief",
          description: "Threshold for standard income tax exemption raised, keeping more of your salary in your pockets.",
          iconName: "Percent"
        }
      ],
      bullets: [
        "Higher disposable take-home salary every month.",
        "Direct buffer against imported cost of living and fuel prices.",
        "Tax exemption benefits for middle-class workers."
      ]
    },
    {
      id: "pensioner",
      name: "Pensioner",
      iconName: "RetiredIcon",
      title: "Key Measures for Seniors & Pensioners",
      benefitAmount: "+ Rs 24,000",
      benefitSubtitle: "Based on basic pension uplift and private medical credits.",
      measures: [
        {
          category: "Pension support",
          title: "Retirement Pension Increase",
          value: "Rs 13,500 /mth",
          description: "Basic monthly retirement pension raised to guarantee seniors a comfortable and stable living.",
          iconName: "HeartHandshake"
        },
        {
          category: "Health screening",
          title: "Free Mobile Diagnostics",
          value: "Rs 0",
          description: "Fully sponsored health checks and mobile clinics for citizens aged 60 and above.",
          iconName: "HeartPulse"
        },
        {
          category: "Healthcare",
          title: "Prescription Drug Subsidy",
          value: "Rs 5,000 /yr",
          description: "Expanded credit system to obtain specific chronic medicines at registered private pharmacies.",
          iconName: "Activity"
        }
      ],
      bullets: [
        "Uplifted monthly basic pension for better independence.",
        "Free preventative and specialized geriatric care.",
        "Lower out-of-pocket costs for regular prescriptions."
      ]
    },
    {
      id: "sme",
      name: "SME Owner",
      iconName: "SmeIcon",
      title: "Key Measures for Small Business Owners",
      benefitAmount: "+ Rs 50,000",
      benefitSubtitle: "Average direct co-funding and corporate tax savings for small micro-SMEs.",
      measures: [
        {
          category: "Sustainability",
          title: "SME Solar Tech Grant",
          value: "50% Subsidy",
          description: "Co-funding grant of up to Rs 100,000 for installing solar systems on business premises.",
          iconName: "Leaf"
        },
        {
          category: "Tax Relief",
          title: "Corporate Tax Reduction",
          value: "3% Flat Rate",
          description: "Special corporate tax rate reduced for registered micro-SMEs to support post-pandemic recovery.",
          iconName: "Briefcase"
        },
        {
          category: "Finance",
          title: "Soft Loan Facility",
          value: "2% Interest",
          description: "Access to low-interest working capital credits to purchase new inventory or raw materials.",
          iconName: "CreditCard"
        }
      ],
      bullets: [
        "Immediate support to lower operational utility costs via solar.",
        "Reduced tax rates allowing higher capital reinvestment.",
        "Cheap working capital to safeguard business cashflows."
      ]
    },
    {
      id: "vulnerable",
      name: "Vulnerable Communities",
      iconName: "HandHeart",
      title: "Key Measures for Vulnerable Communities",
      benefitAmount: "",
      benefitSubtitle: "",
      measures: [],
      bullets: []
    }
  ];

  const baseProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const apiMeasures = getApiMeasures(activeProfileId);
  const activeProfile = apiMeasures ? { ...baseProfile, measures: apiMeasures } : baseProfile;

  // Accent Color Mapping - Streamlined for Premium Dark Theme
  const getColorClasses = (id: string) => {
    switch (id) {
      case "student":
        return {
          primary: "bg-blue-600 hover:bg-blue-700",
          text: "text-blue-700",
          bgLight: "bg-blue-50",
          border: "border-blue-200",
          accentLine: "bg-blue-500"
        };
      case "parent":
        return {
          primary: "bg-emerald-600 hover:bg-emerald-700",
          text: "text-emerald-700",
          bgLight: "bg-emerald-50",
          border: "border-emerald-200",
          accentLine: "bg-emerald-500"
        };
      case "worker":
        return {
          primary: "bg-indigo-600 hover:bg-indigo-700",
          text: "text-indigo-700",
          bgLight: "bg-indigo-50",
          border: "border-indigo-200",
          accentLine: "bg-indigo-500"
        };
      case "pensioner":
        return {
          primary: "bg-rose-600 hover:bg-rose-700",
          text: "text-rose-700",
          bgLight: "bg-rose-50",
          border: "border-rose-200",
          accentLine: "bg-rose-500"
        };
      case "sme":
        return {
          primary: "bg-amber-600 hover:bg-amber-700",
          text: "text-amber-700",
          bgLight: "bg-amber-50",
          border: "border-amber-200",
          accentLine: "bg-amber-500"
        };
      case "vulnerable":
        return {
          primary: "bg-teal-600 hover:bg-teal-700",
          text: "text-teal-700",
          bgLight: "bg-teal-50",
          border: "border-teal-200",
          accentLine: "bg-teal-500"
        };
      default:
        return {
          primary: "bg-blue-600 hover:bg-blue-700",
          text: "text-blue-700",
          bgLight: "bg-blue-50",
          border: "border-blue-200",
          accentLine: "bg-blue-500"
        };
    }
  };

  const activeColors = getColorClasses(activeProfileId);

  const renderIcon = (name: string, className: string = "w-5 h-5") => {
    switch (name) {
      case "GraduationCap": return <GraduationCap className={className} />;
      case "Bus": return <Bus className={className} />;
      case "Laptop": return <Laptop className={className} />;
      case "Baby": return <Baby className={className} />;
      case "Utensils": return <Utensils className={className} />;
      case "Smile": return <Smile className={className} />;
      case "Coins": return <Coins className={className} />;
      case "TrendingUp": return <TrendingUp className={className} />;
      case "Percent": return <Percent className={className} />;
      case "HeartHandshake": return <HeartHandshake className={className} />;
      case "HeartPulse": return <HeartPulse className={className} />;
      case "Activity": return <Activity className={className} />;
      case "Leaf": return <Leaf className={className} />;
      case "Briefcase": return <Briefcase className={className} />;
      case "CreditCard": return <CreditCard className={className} />;
      case "WorkIcon": return <WorkIcon className={className} />;
      case "RetiredIcon": return <RetiredIcon className={className} />;
      case "SmeIcon": return <SmeIcon className={className} />;
      case "HandHeart": return <HandHeart className={className} />;
      default: return <GraduationCap className={className} />;
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Hero / Profile Selector */}
      <section className="flex flex-col items-center text-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold block">
          Section 04 / Demographics Focus
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
          Discover Your Budget Impact
        </h1>
        <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
          Select your citizen profile below to see a customized checklist of measures, savings, and direct benefits allocated for your demographic.
        </p>

        <div className="w-full mt-6">
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-3" id="profile-filters">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;
              const pColors = getColorClasses(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProfileId(p.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isActive 
                      ? `${pColors.primary} text-white scale-102` 
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  {renderIcon(p.iconName, "w-4 h-4 shrink-0")}
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Content Area */}
      <div className="relative w-full min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.section 
            key={activeProfileId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col lg:flex-row gap-8 items-stretch"
          >
            {/* Left: Measures List */}
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block mb-1">PROVISION SET</span>
                <h3 className="text-lg md:text-xl font-serif font-black text-slate-900 flex items-center gap-2">
                  {activeProfile.title}
                  <Sparkles className={`w-4 h-4 ${activeColors.text}`} />
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted legislative measures and public investments structured for this category.
                </p>
              </div>

              {/* Grid containing measure cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeProfile.measures.slice(0, 2).map((m) => (
                  <motion.div 
                    key={m.title}
                    whileHover={{ y: -3 }}
                    className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl flex flex-col justify-between group hover:border-slate-300 transition-all relative overflow-hidden shadow-2xs"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${activeColors.accentLine}`}></div>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full ${activeColors.bgLight} ${activeColors.text}`}>
                          {m.category}
                        </span>
                        <div className="text-slate-400">
                          {renderIcon(m.iconName, "w-4.5 h-4.5")}
                        </div>
                      </div>
                      <h4 className="text-base font-serif font-black text-slate-900 mb-2 leading-snug">
                        {m.title}
                      </h4>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      {m.value && (
                        <div className={`text-2xl md:text-3xl font-mono font-bold ${activeColors.text} mb-2`}>
                          {m.value}
                        </div>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Third Measure Card */}
                {activeProfile.measures[2] && (
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="col-span-1 md:col-span-2 bg-white border border-slate-200 p-6 md:p-8 rounded-2xl hover:border-slate-300 transition-all flex flex-col md:flex-row items-center gap-6 shadow-2xs relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${activeColors.accentLine}`}></div>
                    
                    <div className={`w-12 h-12 flex items-center justify-center shrink-0 rounded-xl ${activeColors.bgLight} ${activeColors.text} shadow-2xs`}>
                      {renderIcon(activeProfile.measures[2].iconName, "w-5 h-5")}
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full inline-block mb-1.5 ${activeColors.bgLight} ${activeColors.text}`}>
                        {activeProfile.measures[2].category}
                      </span>
                      <h4 className="text-base font-serif font-black text-slate-900 mb-1 leading-snug">
                        {activeProfile.measures[2].title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeProfile.measures[2].description}
                      </p>
                    </div>
                    {activeProfile.measures[2].value && (
                      <div className={`md:ml-auto text-2xl md:text-3xl font-mono font-bold ${activeColors.text} shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto text-center md:text-right`}>
                        {activeProfile.measures[2].value}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
