import React, { useState, useEffect } from 'react';
import { getReportById, getStoredReports } from '../utils';
import { Report, ReportStatus } from '../types';
import { 
  Search, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Lock, 
  Eye, 
  Calendar, 
  Clipboard, 
  Check, 
  FileImage,
  ArrowRight,
  Shield,
  CircleAlert,
  Loader
} from 'lucide-react';
import { motion } from 'motion/react';

interface ReportTrackerProps {
  initialSearchId?: string;
  onClearInitialId?: () => void;
}

export default function ReportTracker({ initialSearchId, onClearInitialId }: ReportTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedId, setSearchedId] = useState('');
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [searchError, setSearchError] = useState(false);
  const [recentClaims, setRecentClaims] = useState<Report[]>([]);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    // Collect recently updated reports to populate clickable quick references
    const all = getStoredReports();
    setRecentClaims(all.slice(0, 3));
  }, [activeReport]);

  useEffect(() => {
    if (initialSearchId) {
      setSearchQuery(initialSearchId);
      handleSearch(initialSearchId);
      if (onClearInitialId) onClearInitialId();
    }
  }, [initialSearchId]);

  const handleSearch = (idToSearch?: string) => {
    const id = (idToSearch || searchQuery).trim();
    if (!id) return;

    setSearchedId(id);
    const report = getReportById(id);
    if (report) {
      setActiveReport(report);
      setSearchError(false);
    } else {
      setActiveReport(null);
      setSearchError(true);
    }
  };

  const copyFullSummary = (report: Report) => {
    const timelineStr = report.timeline
      .map(t => `[${new Date(t.timestamp).toLocaleString()}] ${t.status}: ${t.note}`)
      .join('\n');
      
    const summary = `--- SECURITY PORTAL REPORT ---
ID: ${report.id}
Category: ${report.category}
Status: ${report.status}
Created: ${new Date(report.createdAt).toLocaleString()}
Reporter: ${report.isAnonymous ? 'Anonymous' : `${report.reporterName || 'Anonymous'} (${report.reporterContact || 'No contact provided'})`}

TIMELINE LOGS:
${timelineStr}

--------------------------------------`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return 'text-slate-400 bg-slate-900 border-slate-800';
      case 'Under Review':
        return 'text-amber-400 bg-amber-950/20 border-amber-900/50';
      case 'Investigating':
        return 'text-sky-400 bg-sky-950/20 border-sky-900/50';
      case 'Resolved':
        return 'text-emerald-400 bg-emerald-950/10 border-emerald-900/50';
      case 'Archived':
        return 'text-purple-400 bg-purple-950/20 border-purple-900/40';
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="w-4 h-4 text-slate-400" />;
      case 'Under Review':
        return <Eye className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'Investigating':
        return <Loader className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '3s' }} />;
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Archived':
        return <Shield className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <h3 className="text-base font-bold text-slate-100 font-display">Check Report Status</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
          Input your 12-digit Report ID sequence below to evaluate timeline comments, actions taken, and status logs.
        </p>

        {/* Search Query bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="e.g. REP-482937-S"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full text-xs font-mono bg-slate-950 border border-slate-850 focus:border-sky-500 focus:outline-none pl-11 pr-4 py-3 rounded-xl text-slate-100 placeholder-slate-600 transition-colors uppercase tracking-wider"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-xl transition-all shadow-md shadow-sky-500/5 hover:shadow-sky-500/15 font-sans"
          >
            Track Status
          </button>
        </div>

        {/* Quick query recommendation chips */}
        <div className="mt-4 pt-3.5 border-t border-slate-850/60 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-500 font-medium mr-1 uppercase tracking-wider">Demo / Recent Files:</span>
          {recentClaims.length === 0 ? (
            <span className="text-xs text-slate-600 italic">No reports submitted yet.</span>
          ) : (
            recentClaims.map((rc) => (
              <button
                key={rc.id}
                onClick={() => {
                  setSearchQuery(rc.id);
                  handleSearch(rc.id);
                }}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all uppercase flex items-center gap-1.5 ${
                  searchedId === rc.id
                    ? 'bg-sky-550/10 border-sky-500/40 text-sky-400'
                    : 'bg-slate-950 border-slate-850/80 hover:border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{rc.id}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" style={{
                  backgroundColor: rc.status === 'Resolved' ? '#10b981' : rc.status === 'Investigating' ? '#0ea5e9' : rc.status === 'Under Review' ? '#f59e0b' : '#64748b'
                }}></span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Tracked info wrapper */}
      {activeReport ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden"
        >
          {/* Header row details */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase">INCIDENT FILE</span>
                <span className="px-2.5 py-0.5 bg-slate-950 rounded-md border border-slate-850 text-[10px] font-semibold text-slate-300">
                  {new Date(activeReport.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-xl font-bold font-mono text-slate-100 tracking-wide mt-1">
                {activeReport.id}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <span className="px-3 py-1.5 rounded-xl text-xs bg-slate-950 border border-slate-850 text-slate-350 font-mono flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                Category: {activeReport.category}
              </span>
              <span className={`px-3 py-1.5 rounded-xl text-xs border font-medium flex items-center gap-1.5 ${getStatusColor(activeReport.status)}`}>
                {getStatusIcon(activeReport.status)}
                {activeReport.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side column: Details & Screenshot */}
            <div className="lg:col-span-5 space-y-5">
              {/* Submission facts */}
              <div className="bg-slate-950/60 border border-slate-850/60 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Metadata Profile</h5>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-550 block">Origin Type</span>
                    <span className="font-medium text-slate-300 flex items-center gap-1 mt-0.5">
                      {activeReport.isAnonymous ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-indigo-400" /> Anonymous File
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-sky-400" /> Protected ID
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-550 block">Creation Time</span>
                    <span className="font-mono text-slate-300 block mt-0.5">
                      {new Date(activeReport.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {!activeReport.isAnonymous && (
                  <div className="border-t border-slate-850/60 pt-4 text-xs space-y-2">
                    <div>
                      <span className="text-slate-550 block">Reporter Username</span>
                      <span className="font-medium text-slate-200 block mt-0.5">{activeReport.reporterName || 'Anonymous'}</span>
                    </div>
                    <div>
                      <span className="text-slate-550 block">Contact Endpoint</span>
                      <span className="font-mono text-slate-300 mt-0.5 inline-block bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {activeReport.reporterContact || 'None provided'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div className="bg-slate-950/60 border border-slate-850/60 rounded-2xl p-5 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Report Statement</h5>
                <p className="text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-wrap">
                  {activeReport.description}
                </p>
              </div>

              {/* Screenshot attached block */}
              {activeReport.screenshot && (
                <div className="bg-slate-950/60 border border-slate-850/60 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <FileImage className="w-4 h-4 text-emerald-400" /> Attached File Evidence
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                      {activeReport.screenshotName || 'Screenshot.png'}
                    </span>
                  </div>
                  <div className="border border-slate-850 rounded-xl overflow-hidden max-h-[300px] flex items-center justify-center bg-slate-900">
                    <img 
                      src={activeReport.screenshot} 
                      alt="Report evidence files screenshot" 
                      className="w-full h-auto object-contain object-center max-h-[300px] hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right side column: Detailed interactive timeline */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-slate-950/40 border border-slate-850/60 rounded-3xl p-6 relative">
                <div className="flex items-center justify-between border-b border-slate-850/60 pb-4 mb-5">
                  <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-400" /> Resolution Timeline Path
                  </h5>
                  
                  <button
                    onClick={() => copyFullSummary(activeReport)}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-[10px] font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 animate-pulse" /> Copied Summary
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3 h-3 text-slate-400" /> Copy Full Log
                      </>
                    )}
                  </button>
                </div>

                {/* Timeline flow */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-800">
                  {activeReport.timeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-6 top-1 w-[23px] h-[23px] rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] transform -translate-x-1/2 transition-colors duration-200 group-hover:bg-sky-500" style={{
                        borderColor: '#020617', // matches slate-950 background
                        backgroundColor: 
                          item.status === 'Resolved' ? '#10b981' : 
                          item.status === 'Investigating' ? '#0ea5e9' : 
                          item.status === 'Under Review' ? '#f59e0b' : '#475569'
                      }} />
                      
                      {/* Timeline Body card */}
                      <div className="bg-slate-950/80 border border-slate-850/60 rounded-xl p-4 space-y-1.5 hover:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(item.timestamp).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informational advice tip for user's query page */}
              <div className="bg-sky-950/10 border border-sky-900/30 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-400">
                <CircleAlert className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-semibold block mb-0.5">Need immediate additions?</span>
                  If you hold new chat logs, video URLs, or files confirming change of plans from blacklist blackmailers, please reach out directly representing ticket ID <span className="font-semibold text-sky-300 font-mono">{activeReport.id}</span>.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        searchedId && searchError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center bg-slate-900/40 border border-rose-950 rounded-2xl backdrop-blur-md"
          >
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h5 className="text-sm font-semibold text-slate-200">Invalid Report ID</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              We couldn't locate reference code <span className="font-mono text-rose-300 font-semibold">{searchedId}</span>. Case records might be deleted, spellings are case-sensitive, or you might be using a stale local tracker.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setSearchQuery('REP-910283-B')}
                className="px-4 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors rounded-lg text-[10px] font-mono text-slate-400 hover:text-slate-100 uppercase"
              >
                Insert Demo ID: REP-910283-B
              </button>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
