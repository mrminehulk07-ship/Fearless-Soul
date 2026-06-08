import React, { useState, useEffect } from 'react';
import { OWNER_INFO } from './data';
import { getStoredReports } from './utils';
import { Report } from './types';
import ContactCard from './components/ContactCard';
import ReportForm from './components/ReportForm';
import ReportTracker from './components/ReportTracker';
import OwnerAdmin from './components/OwnerAdmin';
import { 
  ShieldAlert, 
  Send, 
  Search, 
  Settings, 
  Lock, 
  Eye, 
  MessageSquareCode, 
  Mail, 
  Instagram, 
  ExternalLink,
  ShieldCheck,
  Flame,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'contacts' | 'admin'>('submit');
  const [reportsCount, setReportsCount] = useState(0);
  const [trackerSearchId, setTrackerSearchId] = useState<string>('');

  // Update reports badging count
  const updateReportsCount = () => {
    const all = getStoredReports();
    setReportsCount(all.length);
  };

  useEffect(() => {
    updateReportsCount();
  }, []);

  const handleReportCreated = (newReport: Report) => {
    updateReportsCount();
  };

  const handleNavigateToTrack = (reportId: string) => {
    setTrackerSearchId(reportId);
    setActiveTab('track');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-150 flex flex-col relative overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-350">
      {/* Dynamic atmospheric ambient glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-900/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Primary Top Bar */}
      <header className="border-b border-slate-900/90 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-base font-bold font-display shadow-lg shadow-sky-500/10">
                FS
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse"></span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 tracking-tight font-display flex items-center gap-1.5">
                <span>{OWNER_INFO.name}</span>
                <span className="text-[10px] bg-sky-550/10 text-sky-400 font-mono py-0.2 px-1.5 rounded border border-sky-500/25">PORTAL</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">Verified Safety & Recovery Response</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick launch links */}
            <a
              href="https://t.me/TakePermit"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-sky-950/40 hover:bg-sky-950/80 border border-sky-900/20 hover:border-sky-500/30 text-sky-400 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Urgent t.me/TakePermit</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1 space-y-8">
        
        {/* Welcome & Bio Hero profile banner */}
        <section className="relative rounded-3xl border border-slate-900 bg-linear-to-b from-slate-900/40 to-slate-950/20 p-6 sm:p-8 overflow-hidden backdrop-blur-md">
          {/* Animated light effect inside */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/5 to-indigo-600/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative">
            {/* Owner visual avatar */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-sky-500/20 shadow-xl flex items-center justify-center text-sky-400 font-display text-2xl font-bold relative group">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]" />
              </div>
            </div>

            {/* Title, Bio & Explanatory greeting speech bubble */}
            <div className="space-y-2.5 text-center md:text-left flex-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                <Flame className="w-3 h-3 text-amber-500 animate-pulse" /> Always active to support you
              </span>

              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-100 tracking-tight leading-none mt-1">
                CONTACT &amp; INCIDENT SAFETY PORTAL
              </h2>

              <p className="text-xs text-sky-350 font-mono uppercase tracking-widest font-semibold max-w-xl">
                &ldquo; {OWNER_INFO.about} &rdquo;
              </p>

              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {OWNER_INFO.welcome} If you are facing harassment, blackmail, identity theft, or toxic bullying, use this unified client dashboard to submit details or track solution milestones securely.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Selection Navigation layout */}
        <div className="border-b border-slate-900 pb-px">
          <div className="flex flex-nowrap overflow-x-auto gap-4 scrollbar-none pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab('submit')}
              className={`pb-3.5 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 px-1 relative transition-colors cursor-pointer shrink-0 ${
                activeTab === 'submit'
                  ? 'border-sky-500 text-slate-150'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Submit Safety Case</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`pb-3.5 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 px-1 relative transition-colors cursor-pointer shrink-0 ${
                activeTab === 'track'
                  ? 'border-sky-500 text-slate-150'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Track Incident Case</span>
              <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400">
                {reportsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-3.5 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 px-1 relative transition-colors cursor-pointer shrink-0 ${
                activeTab === 'contacts'
                  ? 'border-sky-500 text-slate-150'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              <MessageSquareCode className="w-4 h-4 shrink-0" />
              <span>Direct Secure Contacts</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-3.5 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 px-1 relative transition-colors cursor-pointer shrink-0 ${
                activeTab === 'admin'
                  ? 'border-sky-500 text-slate-150'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Owner Panel Gateway</span>
            </button>
          </div>
        </div>

        {/* Tab view rendering */}
        <section className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'submit' && (
              <motion.div
                key="submit-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ReportForm 
                  onSuccess={handleReportCreated} 
                  onNavigateToTrack={handleNavigateToTrack} 
                />
              </motion.div>
            )}

            {activeTab === 'track' && (
              <motion.div
                key="track-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ReportTracker 
                  initialSearchId={trackerSearchId} 
                  onClearInitialId={() => setTrackerSearchId('')} 
                />
              </motion.div>
            )}

            {activeTab === 'contacts' && (
              <motion.div
                key="contacts-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ContactCard />
              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div
                key="admin-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <OwnerAdmin onReportUpdated={updateReportsCount} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Informative Help panel details */}
        <section className="p-4 bg-slate-900/20 border border-slate-900 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-450">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-slate-300 font-semibold block">Need To Send Physical Proof?</span>
            <p>
              Our automated portal generates randomized 12-digit Client Key codes. If you prefer secure, completely decentralized channels, we highly advise using Telegram &ldquo;Secret Chats&rdquo; to contact <span className="font-semibold text-slate-200">@TakePermit</span> directly regarding active threats. Never pay ransom demands.
            </p>
          </div>
        </section>

      </main>

      {/* Styled Footer */}
      <footer className="border-t border-slate-900/90 py-8 bg-slate-950 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p>{OWNER_INFO.footerNote}</p>
          </div>

          <p className="text-center sm:text-right font-mono">
            &copy; 2026 Contact &amp; Report Portal • Created for {OWNER_INFO.name}
          </p>
        </div>
      </footer>
    </div>
  );
}
