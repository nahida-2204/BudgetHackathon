// @ts-ignore: suppress missing @types/react in this environment
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Landmark,
  Search,
  Menu,
  X,
  Info,
  Sparkles,
  Globe
} from "lucide-react";
import DashboardView from "./components/DashboardView";
import SpendingBreakdownView from "./components/SpendingBreakdownView";
import TaxTransparencyView from "./components/TaxTransparencyView";
import CitizenImpactView from "./components/CitizenImpactView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"EN" | "KR">("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [infoModalContent, setInfoModalContent] = useState<string | null>(null);

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    let result = "No specific match found. Try searching for 'VAT', 'Allowance', 'Retirement', 'Student', or 'Education'.";

    if (query.includes("vat") || query.includes("tax") || query.includes("revenue")) {
      result = "Matches found in 'Measure Explainer & AI'. National VAT represents 45% of state revenues, with 5.2% growth.";
    } else if (query.includes("allowance") || query.includes("allowances") || query.includes("special")) {
      result = "Matches found in 'Citizen Impact > Worker'. Direct monthly allowance paid under the Workers' Rights Act raised by Rs 1,000.";
    } else if (query.includes("pension") || query.includes("retirement") || query.includes("senior")) {
      result = "Matches found in 'Citizen Impact > Pensioner'. Retirement pension raised to Rs 13,500 monthly.";
    } else if (query.includes("student") || query.includes("education") || query.includes("device")) {
      result = "Matches found in 'Citizen Impact > Student'. Student measures include Rs 1,500 monthly allowance and Rs 10,000 digital device subsidies.";
    }

    setSearchResults(result);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "spending", label: "Spending Breakdown" },
    { id: "transparency", label: "Measure Explainer & AI" },
    { id: "impact", label: "Citizen Impact" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">

      {/* Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        {/* Mauritius flag identity stripe */}
        <div className="h-[3px] flex w-full">
          <div className="flex-1 bg-[#EA4335]" />
          <div className="flex-1 bg-[#4285F4]" />
          <div className="flex-1 bg-[#FBBC05]" />
          <div className="flex-1 bg-[#34A853]" />
        </div>
        <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto h-[68px]">

          {/* Brand Logo */}
          <div
            onClick={() => handleNavigation("dashboard")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="flex flex-col gap-0.5 w-1.5 h-8 shrink-0 rounded-full overflow-hidden">
              <div className="flex-1 bg-[#EA4335]" />
              <div className="flex-1 bg-[#4285F4]" />
              <div className="flex-1 bg-[#FBBC05]" />
              <div className="flex-1 bg-[#34A853]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold mb-0.5">
                Republic of Mauritius
              </span>
              <div className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-blue-600" />
                <h1 className="text-lg font-serif font-black text-slate-900 tracking-tight">
                  SmartBudget<span className="text-blue-600 font-sans">.mu</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNavigation(id)}
                className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Budget..."
                className="bg-slate-100 border border-slate-300 rounded-full pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-900 placeholder:text-slate-400 w-44 xl:w-52 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "EN" ? "KR" : "EN")}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-slate-700 rounded-full transition-all cursor-pointer shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{language === "EN" ? "English" : "Kreol"}</span>
            </button>

          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden shadow-md"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map(({ id, label }, i) => (
                <button
                  key={id}
                  onClick={() => handleNavigation(id)}
                  className={`py-2 text-left font-semibold text-sm ${
                    i < navItems.length - 1 ? "border-b border-slate-100" : ""
                  } ${activeTab === id ? "text-blue-700" : "text-slate-700"}`}
                >
                  {label}
                </button>
              ))}

              <hr className="border-slate-100 my-1" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Language:</span>
                <button
                  onClick={() => setLanguage(language === "EN" ? "KR" : "EN")}
                  className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
                >
                  {language === "EN" ? "English" : "Kreol"}
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative mt-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Budget..."
                  className="bg-slate-100 border border-slate-300 rounded-full pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none text-slate-900 w-full"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Result Banner */}
      {searchResults && (
        <div className="bg-blue-50 border-b border-blue-100 py-3.5 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 text-xs font-semibold text-blue-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
              <span>{searchResults}</span>
            </div>
            <button
              onClick={() => setSearchResults(null)}
              className="text-slate-400 hover:text-slate-700 text-base font-black cursor-pointer px-2"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "dashboard" && <DashboardView onNavigate={handleNavigation} />}
            {activeTab === "spending" && <SpendingBreakdownView />}
            {activeTab === "transparency" && <TaxTransparencyView />}
            {activeTab === "impact" && <CitizenImpactView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="w-full py-10 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="font-extrabold text-lg text-slate-900 flex items-center gap-1.5">
              <Landmark className="w-5 h-5 text-blue-600" />
              Smart Budget Moris
            </div>
            <div className="text-xs text-slate-400 font-medium">
              © 2024 Republic of Mauritius. Smart Budget Transparency Portal.
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-xs font-semibold">
            {[
              ["Official Gazette", "Official Gazette: Direct access to state publications, legislative amendments, and public proclamations regarding budget measures."],
              ["Ministry of Finance", "Ministry of Finance, Economic Planning and Development: The governing public office coordinating macro-economic metrics and national assets."],
              ["Contact Us", "Contact Portal: Reach out to the Civil Budget Team at Port Louis. Tel: (+230) 201-1200 or support@budget-moris.gov.mu"],
              ["Data Privacy", "Data Privacy Policy: All calculations, personal salaries, or generated PDF summary requests occur exclusively inside your local browser cache. No personal data is harvested."],
            ].map(([label, info]) => (
              <button
                key={label}
                onClick={() => setInfoModalContent(info)}
                className="text-slate-500 hover:text-blue-700 cursor-pointer transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>

        </div>
      </footer>

      {/* Info Modal */}
      {infoModalContent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Information
              </h4>
              <button
                onClick={() => setInfoModalContent(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {infoModalContent}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInfoModalContent(null)}
                className="bg-blue-600 text-white py-2 px-5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
