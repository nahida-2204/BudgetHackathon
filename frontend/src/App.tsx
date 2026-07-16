// @ts-ignore: suppress missing @types/react in this environment
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Landmark, 
  HelpCircle, 
  Search, 
  Menu, 
  X, 
  FileText, 
  Users, 
  Info, 
  Shield, 
  PhoneCall, 
  Sun, 
  Moon, 
  Sparkles,
  Globe
} from "lucide-react";
import DashboardView from "./components/DashboardView";
import SpendingBreakdownView from "./components/SpendingBreakdownView";
import TaxTransparencyView from "./components/TaxTransparencyView";
import CitizenImpactView from "./components/CitizenImpactView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard"); // dashboard, spending, transparency, impact
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDarkMode = true;
  const [language, setLanguage] = useState<"EN" | "KR">("EN"); // English, Kreol
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string | null>(null);

  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

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

  // Basic Info Modal items
  const [infoModalContent, setInfoModalContent] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 dark">
      
      {/* Top Navigation Bar */}
      <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 shadow-xs">
        <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavigation("dashboard")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="flex flex-col gap-0.5 w-1.5 h-8 shrink-0 rounded-full overflow-hidden">
              <div className="flex-1 bg-[#EA4335]" title="Red" />
              <div className="flex-1 bg-[#4285F4]" title="Blue" />
              <div className="flex-1 bg-[#FBBC05]" title="Yellow" />
              <div className="flex-1 bg-[#34A853]" title="Green" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-bold mb-0.5">
                Republic of Mauritius
              </span>
              <div className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-blue-400" />
                <h1 className="text-lg font-serif font-black text-white tracking-tight">
                  SmartBudget<span className="text-blue-400 font-sans">.mu</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2 h-full">
            <button 
              onClick={() => handleNavigation("dashboard")}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === "dashboard" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleNavigation("spending")}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === "spending" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              Spending Breakdown
            </button>
            <button 
              onClick={() => handleNavigation("transparency")}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === "transparency" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              Measure Explainer &amp; AI
            </button>
            <button 
              onClick={() => handleNavigation("impact")}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === "impact" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              Citizen Impact
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Budget..." 
                className="bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-white w-44 xl:w-52 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Language Toggle EN/KR */}
            <button 
              onClick={() => setLanguage(language === "EN" ? "KR" : "EN")}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-slate-200 rounded-full transition-all cursor-pointer shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{language === "EN" ? "English" : "Kreol"}</span>
            </button>

          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full border border-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-slate-900 border-b border-slate-800 overflow-hidden shadow-md"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <button 
                onClick={() => handleNavigation("dashboard")}
                className={`py-2 text-left font-bold text-sm border-b border-slate-800/80 ${activeTab === "dashboard" ? "text-blue-400" : "text-slate-300"}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavigation("spending")}
                className={`py-2 text-left font-bold text-sm border-b border-slate-800/80 ${activeTab === "spending" ? "text-blue-400" : "text-slate-300"}`}
              >
                Spending Breakdown
              </button>
              <button 
                onClick={() => handleNavigation("transparency")}
                className={`py-2 text-left font-bold text-sm border-b border-slate-800/80 ${activeTab === "transparency" ? "text-blue-400" : "text-slate-300"}`}
              >
                Measure Explainer &amp; AI
              </button>
              <button 
                onClick={() => handleNavigation("impact")}
                className={`py-2 text-left font-bold text-sm ${activeTab === "impact" ? "text-blue-400" : "text-slate-300"}`}
              >
                Citizen Impact Personalizer
              </button>

              <hr className="border-slate-800 my-2" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Language:</span>
                <button 
                  onClick={() => setLanguage(language === "EN" ? "KR" : "EN")}
                  className="text-xs font-bold text-blue-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700"
                >
                  {language === "EN" ? "English" : "Kreol"}
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mt-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Budget..." 
                  className="bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none text-white w-full"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Result Overlay Box */}
      {searchResults && (
        <div className="bg-slate-900 border-b border-slate-800 py-3.5 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 text-xs font-semibold text-blue-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse shrink-0" />
              <span>{searchResults}</span>
            </div>
            <button 
              onClick={() => setSearchResults(null)}
              className="text-slate-400 hover:text-white text-base font-black cursor-pointer px-2"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Main Content Canvas */}
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
      <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
        <div className="w-full py-10 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="font-extrabold text-lg text-white flex items-center gap-1.5">
              <Landmark className="w-5 h-5 text-blue-400" />
              Smart Budget Moris
            </div>
            <div className="text-xs text-slate-500 font-medium">
              © 2024 Republic of Mauritius. Smart Budget Transparency Portal.
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-xs font-bold">
            <button 
              onClick={() => setInfoModalContent("Official Gazette: Direct access to state publications, legislative amendments, and public proclamations regarding budget measures.")}
              className="text-slate-400 hover:text-blue-400 cursor-pointer"
            >
              Official Gazette
            </button>
            <button 
              onClick={() => setInfoModalContent("Ministry of Finance, Economic Planning and Development: The governing public office coordinating macro-economic metrics and national assets.")}
              className="text-slate-400 hover:text-blue-400 cursor-pointer"
            >
              Ministry of Finance
            </button>
            <button 
              onClick={() => setInfoModalContent("Contact Portal: Reach out to the Civil Budget Team at Port Louis. Tel: (+230) 201-1200 or support@budget-moris.gov.mu")}
              className="text-slate-400 hover:text-blue-400 cursor-pointer"
            >
              Contact Us
            </button>
            <button 
              onClick={() => setInfoModalContent("Data Privacy Policy: All calculations, personal salaries, or generated PDF summary requests occur exclusively inside your local browser cache. No personal data is harvested.")}
              className="text-slate-400 hover:text-blue-400 cursor-pointer"
            >
              Data Privacy
            </button>
          </nav>

        </div>
      </footer>

      {/* Info Modal / Popup helper */}
      {infoModalContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-xl shadow-lg max-w-md w-full p-6 border border-slate-800 relative animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Information Portal
              </h4>
              <button 
                onClick={() => setInfoModalContent(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
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
