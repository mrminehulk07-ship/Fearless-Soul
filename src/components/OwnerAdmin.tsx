import React, { useState, useEffect } from 'react';
import { getStoredReports, updateReportStatus, deleteReport } from '../utils';
import { Report, ReportStatus } from '../types';
import { 
  Lock, 
  Key, 
  ShieldAlert, 
  Eye, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  MessageSquare, 
  Shield, 
  Activity, 
  AlertTriangle, 
  Check, 
  Plus,
  PlusCircle,
  Clock,
  Loader
} from 'lucide-react';
import { motion } from 'motion/react';

interface OwnerAdminProps {
  onReportUpdated?: () => void;
}

export default function OwnerAdmin({ onReportUpdated }: OwnerAdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Update state fields
  const [statusVal, setStatusVal] = useState<ReportStatus>('Under Review');
  const [noteVal, setNoteVal] = useState('');
  const [privateNoteVal, setPrivateNoteVal] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadReportsData();
    }
  }, [isAuthenticated]);

  const loadReportsData = () => {
    const data = getStoredReports();
    setReports(data);
    if (selectedReport) {
      const refreshed = data.find(r => r.id === selectedReport.id);
      setSelectedReport(refreshed || null);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passkey.trim().toLowerCase().replace('@', '');
    if (cleanPass === 'takepermit' || cleanPass === 'admin') {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Access Denied. Hint: Use username "TakePermit" to simulate.');
    }
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const updated = updateReportStatus(
      selectedReport.id, 
      statusVal, 
      noteVal.trim() || `Status updated to ${statusVal}`, 
      privateNoteVal.trim()
    );

    if (updated) {
      loadReportsData();
      setNoteVal('');
      setSuccessMsg(`Report ${selectedReport.id} successfully updated!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      if (onReportUpdated) onReportUpdated();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you absolutely sure you want to permanently delete Report ${id}?`)) {
      deleteReport(id);
      setSelectedReport(null);
      loadReportsData();
      if (onReportUpdated) onReportUpdated();
    }
  };

  const getMetricCounts = () => {
    return {
      total: reports.length,
      investigating: reports.filter(r => r.status === 'Investigating').length,
      resolved: reports.filter(r => r.status === 'Resolved').length,
      threats: reports.filter(r => r.category === 'Blackmail' || r.category === 'Threats').length
    };
  };

  const metrics = getMetricCounts();

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        /* Password Gate */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md text-center space-y-6 relative"
        >
          {/* Decorative Security elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex p-3 bg-sky-550/10 border border-sky-500/20 text-sky-450 rounded-2xl">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold font-display text-slate-100">Owner Portal Gate</h3>
            <p className="text-xs text-slate-400 mt-1 lines-relaxed">
              Authenticate using your Telegram security credentials to manage active incident tracking.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="Simulative Access Passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-850 focus:border-sky-500 focus:outline-none pl-10 pr-4 py-3 rounded-xl text-slate-100 placeholder-slate-650"
              />
            </div>

            {errorMessage && (
              <p className="text-[10px] text-rose-400 font-medium bg-rose-950/20 py-2 px-3 border border-rose-900/40 rounded-xl leading-relaxed">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-650 hover:from-sky-550 hover:to-indigo-600 text-white font-semibold text-xs rounded-xl transition-all"
            >
              Verify Credentials
            </button>
          </form>

          <div className="p-3 bg-slate-950 border border-slate-850/80 rounded-xl text-[10px] text-slate-500 text-left space-y-1">
            <span className="font-semibold text-slate-400 block mb-0.5">💡 Interactive Sandbox Guide:</span>
            <span>Since this app is executing locally on your browser container, use the Telegram username <span className="font-mono text-sky-400">TakePermit</span> or code name <span className="font-mono text-indigo-400">admin</span> to log in and simulate your dashboard as Fearless Soul.</span>
          </div>
        </motion.div>
      ) : (
        /* Complete Interactive Admin Dashboard */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Header metrics card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Cases Logged</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-100">{metrics.total}</span>
                <span className="text-[10px] text-slate-450">reports</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Under Assessment</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-sky-400">{metrics.investigating}</span>
                <span className="text-[10px] text-sky-500 font-medium">active</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Resolved Solutions</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-emerald-400">{metrics.resolved}</span>
                <span className="text-[10px] text-emerald-500 font-medium">secured</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">High Threat Cases</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-rose-400">{metrics.threats}</span>
                <span className="text-[10px] text-rose-500 font-semibold">critical</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Hand: Reports List layout */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
                <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider mb-3 px-1">Case Incidents Inbox</h4>

                {reports.length === 0 ? (
                  <p className="text-center text-xs text-slate-550 py-10 italic">No safety reports submitted yet.</p>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {reports.map((report) => (
                      <button
                        key={report.id}
                        type="button"
                        onClick={() => {
                          setSelectedReport(report);
                          setStatusVal(report.status);
                          setPrivateNoteVal(report.privateNotes || '');
                          setNoteVal('');
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between gap-2.5 relative ${
                          selectedReport?.id === report.id
                            ? 'border-sky-500/80 bg-sky-950/15 shadow-sm'
                            : 'border-slate-850 hover:border-slate-800 bg-slate-950/40 hover:bg-slate-950/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 w-full">
                          <span className="font-mono font-bold text-slate-200 tracking-wider">
                            {report.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-slate-350 line-clamp-1 leading-relaxed">
                          {report.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 w-full">
                          <span className="text-[10px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-400">
                            {report.category}
                          </span>

                          <span className={`text-[10px] font-semibold flex items-center gap-1 font-sans ${
                            report.status === 'Resolved' ? 'text-emerald-400' :
                            report.status === 'Investigating' ? 'text-sky-400' :
                            report.status === 'Under Review' ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{
                              backgroundColor: 
                                report.status === 'Resolved' ? '#10b981' :
                                report.status === 'Investigating' ? '#0ea5e9' :
                                report.status === 'Under Review' ? '#f59e0b' : '#64748b'
                            }}></span>
                            {report.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Hand: Active Selected Report Details editor */}
            <div className="lg:col-span-7">
              {selectedReport ? (
                <motion.div
                  key={selectedReport.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-sm font-bold text-slate-100">{selectedReport.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] bg-indigo-950/30 border border-indigo-900/40 text-indigo-400 px-2.5 py-0.5 rounded-full font-mono font-medium">
                          {selectedReport.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Reported via client on {new Date(selectedReport.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(selectedReport.id)}
                        className="px-3 py-1.5 bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-850 hover:border-rose-950 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        title="Permanently Delete Case File"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950/80 border border-slate-850/60 p-4 rounded-xl space-y-2">
                      <span className="text-slate-500 uppercase tracking-widest font-semibold block text-[9px]">Reporter Info</span>
                      {selectedReport.isAnonymous ? (
                        <div className="text-slate-400 italic">Submitted as Anonymous Case</div>
                      ) : (
                        <div className="space-y-1.5">
                          <div>
                            <span className="text-slate-600 block">Name/Alias:</span>
                            <span className="text-slate-200 font-semibold">{selectedReport.reporterName}</span>
                          </div>
                          <div>
                            <span className="text-slate-600 block">Provided Handle:</span>
                            <span className="text-sky-300 font-mono select-all bg-slate-900 border border-slate-800 py-0.5 px-2 rounded mt-0.5 inline-block">
                              {selectedReport.reporterContact}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-950/80 border border-slate-850/60 p-4 rounded-xl space-y-2">
                      <span className="text-slate-500 uppercase tracking-widest font-semibold block text-[9px]">Investigation State</span>
                      <div className="space-y-1">
                        <span className="text-slate-600 block">Current Status Indicator:</span>
                        <span className="text-slate-250 font-bold block">{selectedReport.status}</span>
                        <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-sky-500" />
                          <span>{selectedReport.timeline.length} total events in log</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Incident Detail Inputted</span>
                    <div className="bg-slate-950/80 border border-slate-850/65 rounded-xl p-4 text-xs font-sans text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto">
                      {selectedReport.description}
                    </div>
                  </div>

                  {/* Screenshot evidence file frame */}
                  {selectedReport.screenshot && (
                    <div className="bg-slate-950/50 border border-slate-850/50 p-4 rounded-xl space-y-2.5">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Embedded Screenshot Screenshot Evidence</span>
                      <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/80 max-h-[220px] flex items-center justify-center">
                        <img 
                          src={selectedReport.screenshot} 
                          alt="Evidence upload frame" 
                          className="max-h-[220px] w-full object-contain object-center"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Interactive Status Timeline Progress Form */}
                  <form onSubmit={handleUpdateStatus} className="bg-slate-950/80 border border-slate-850/80 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-sky-400" /> Push Investigative Log Update
                    </h5>

                    {successMsg && (
                      <p className="text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/50 p-2.5 rounded-xl flex items-center gap-1.5 font-medium">
                        <CheckCircle className="w-4 h-4" /> {successMsg}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Dropdown status selection */}
                      <div className="md:col-span-4 space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase uppercase">Target Status</label>
                        <select
                          value={statusVal}
                          onChange={(e) => setStatusVal(e.target.value as ReportStatus)}
                          className="w-full text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-200 focus:border-sky-500 focus:outline-none"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Investigating">Investigating</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      {/* Log Explanation */}
                      <div className="md:col-span-8 space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase">Public Timeline Comment <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Explain what steps have been completed (e.g., filed claims, blocked hacker)..."
                          value={noteVal}
                          onChange={(e) => setNoteVal(e.target.value)}
                          className="w-full text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-205 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Private Notes block */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
                        <span>Private Owner Notes</span> 
                        <span className="text-[8px] bg-slate-900 py-0.5 px-2 rounded-full font-sans tracking-wide text-indigo-400 border border-indigo-950 font-normal">VISIBLE TO ADMIN ONLY</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Private forensics metadata details, active contact status trackers..."
                        value={privateNoteVal}
                        onChange={(e) => setPrivateNoteVal(e.target.value)}
                        className="w-full text-xs bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-slate-300 placeholder-slate-650 focus:border-sky-500 focus:outline-none resize-none font-sans"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-900/80 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-sky-650 hover:bg-sky-550 border border-sky-650 text-white font-semibold text-xs rounded-xl flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Save Timeline Update
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <div className="bg-slate-900/30 border border-slate-850 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[360px] text-slate-500 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  <ShieldAlert className="w-10 h-10 text-slate-600 mb-3" />
                  <h5 className="text-sm font-semibold text-slate-300">No Incident Case Selected</h5>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Select one of the incoming safety claims from the panel inbox on the left to review metrics, upload milestones, and delete items.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
