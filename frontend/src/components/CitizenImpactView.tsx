import React, { useState } from "react";
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
  CheckCircle2,
  Users,
  Briefcase as WorkIcon,
  Smile as FamilyIcon,
  Heart as RetiredIcon,
  Store as SmeIcon,
  Sparkles
} from "lucide-react";
import { ImpactProfile } from "../types";

export default function CitizenImpactView() {
  const [activeProfileId, setActiveProfileId] = useState("student");

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
    }
  ];

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Accent Color Mapping - Streamlined for Premium Dark Theme
  const getColorClasses = (id: string) => {
    switch (id) {
      case "student":
        return {
          primary: "bg-blue-600 hover:bg-blue-700",
          text: "text-blue-400",
          bgLight: "bg-blue-950/40",
          border: "border-blue-900/40",
          accentLine: "bg-blue-500"
        };
      case "parent":
        return {
          primary: "bg-emerald-600 hover:bg-emerald-700",
          text: "text-emerald-400",
          bgLight: "bg-emerald-950/40",
          border: "border-emerald-900/40",
          accentLine: "bg-emerald-500"
        };
      case "worker":
        return {
          primary: "bg-indigo-600 hover:bg-indigo-700",
          text: "text-indigo-400",
          bgLight: "bg-indigo-950/40",
          border: "border-indigo-900/40",
          accentLine: "bg-indigo-500"
        };
      case "pensioner":
        return {
          primary: "bg-rose-600 hover:bg-rose-700",
          text: "text-rose-400",
          bgLight: "bg-rose-950/40",
          border: "border-rose-900/40",
          accentLine: "bg-rose-500"
        };
      case "sme":
        return {
          primary: "bg-amber-600 hover:bg-amber-700",
          text: "text-amber-400",
          bgLight: "bg-amber-950/40",
          border: "border-amber-900/40",
          accentLine: "bg-amber-500"
        };
      default:
        return {
          primary: "bg-blue-600 hover:bg-blue-700",
          text: "text-blue-400",
          bgLight: "bg-blue-950/40",
          border: "border-blue-900/40",
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
      default: return <GraduationCap className={className} />;
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Hero / Profile Selector */}
      <section className="flex flex-col items-center text-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold block">
          Section 04 / Demographics Focus
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-white">
          Discover Your Budget Impact
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed font-medium">
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
                      : "bg-slate-900 text-slate-300 border border-slate-800/80 hover:bg-slate-850 hover:border-slate-700"
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
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase block mb-1">PROVISION SET</span>
                <h3 className="text-lg md:text-xl font-serif font-black text-white flex items-center gap-2">
                  {activeProfile.title}
                  <Sparkles className={`w-4 h-4 ${activeColors.text}`} />
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Targeted legislative measures and public investments structured for this category.
                </p>
              </div>

              {/* Grid containing measure cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeProfile.measures.slice(0, 2).map((m) => (
                  <motion.div 
                    key={m.title}
                    whileHover={{ y: -3 }}
                    className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl flex flex-col justify-between group hover:border-slate-700 transition-all relative overflow-hidden shadow-2xs"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${activeColors.accentLine}`}></div>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full ${activeColors.bgLight} ${activeColors.text}`}>
                          {m.category}
                        </span>
                        <div className="text-slate-500">
                          {renderIcon(m.iconName, "w-4.5 h-4.5")}
                        </div>
                      </div>
                      <h4 className="text-base font-serif font-black text-white mb-2 leading-snug">
                        {m.title}
                      </h4>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-850">
                      <div className={`text-2xl md:text-3xl font-mono font-bold ${activeColors.text} mb-2`}>
                        {m.value}
                      </div>
                      <p className="text-xs text-slate-450 leading-relaxed font-medium">
                        {m.description}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Third Measure Card */}
                {activeProfile.measures[2] && (
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl hover:border-slate-700 transition-all flex flex-col md:flex-row items-center gap-6 shadow-2xs relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${activeColors.accentLine}`}></div>
                    
                    <div className={`w-12 h-12 flex items-center justify-center shrink-0 rounded-xl ${activeColors.bgLight} ${activeColors.text} shadow-2xs`}>
                      {renderIcon(activeProfile.measures[2].iconName, "w-5 h-5")}
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full inline-block mb-1.5 ${activeColors.bgLight} ${activeColors.text}`}>
                        {activeProfile.measures[2].category}
                      </span>
                      <h4 className="text-base font-serif font-black text-white mb-1 leading-snug">
                        {activeProfile.measures[2].title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {activeProfile.measures[2].description}
                      </p>
                    </div>
                    <div className={`md:ml-auto text-2xl md:text-3xl font-mono font-bold ${activeColors.text} shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-850 w-full md:w-auto text-center md:text-right`}>
                      {activeProfile.measures[2].value}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: Impact Summary Card */}
            <div className="w-full lg:w-1/3 flex flex-col shrink-0">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 md:p-8 flex flex-col h-full rounded-2xl justify-between shadow-lg border border-slate-800 relative overflow-hidden">
                
                {/* Minimalist colorful corner accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 ${activeColors.accentLine}`}></div>

                <div className="flex flex-col gap-5 flex-grow relative z-10">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="p-2 bg-white/10 rounded-xl text-blue-400">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base md:text-lg font-serif font-black">How It Affects You</h3>
                  </div>

                  <div className="space-y-6 flex-grow">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Estimated Annual Benefit</p>
                      <div className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-emerald-400">{activeProfile.benefitAmount}</div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                        {activeProfile.benefitSubtitle}
                      </p>
                    </div>

                    <hr className="border-slate-800" />

                    <ul className="space-y-4.5 text-xs font-medium">
                      {activeProfile.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-slate-300 leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
