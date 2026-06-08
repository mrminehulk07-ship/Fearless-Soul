import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { REPORT_CATEGORIES } from '../data';
import { ReportCategory, Report } from '../types';
import { createReport } from '../utils';
import { sendTelegramNotification } from '../telegram';
import { 
  Shield, 
  User, 
  UserX, 
  UploadCloud, 
  FileImage, 
  AlertTriangle, 
  CornerDownRight, 
  CheckCircle, 
  Copy, 
  Check, 
  Lock, 
  Send, 
  X, 
  ArrowRight,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportFormProps {
  onSuccess: (newReport: Report) => void;
  onNavigateToTrack: (reportId: string) => void;
}

export default function ReportForm({ onSuccess, onNavigateToTrack }: ReportFormProps) {
  const [category, setCategory] = useState<ReportCategory>('Blackmail');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [screenshot, setScreenshot] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [tgDeliveryError, setTgDeliveryError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategoryInfo = REPORT_CATEGORIES.find(c => c.category === category)!;

  // Handle Drag-and-Drop file uploads
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are permitted for screenshot upload.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshot(reader.result);
        setScreenshotName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeScreenshot = () => {
    setScreenshot('');
    setScreenshotName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe the incident in detail.');
      return;
    }

    const report = createReport({
      category,
      isAnonymous,
      reporterName: isAnonymous ? undefined : reporterName.trim() || 'Anonymous',
      reporterContact: isAnonymous ? undefined : reporterContact.trim() || 'Not Provided',
      description: description.trim(),
      screenshot: screenshot || undefined,
      screenshotName: screenshotName || undefined
    });

    // Send Telegram alert
    sendTelegramNotification(report)
      .then(() => {
        setTgDeliveryError(null);
      })
      .catch((err) => {
        console.error('Telegram notification error:', err);
        setTgDeliveryError(err.message || String(err));
      });

    setSubmittedReport(report);
    onSuccess(report);
  };

  const resetFormState = () => {
    setCategory('Blackmail');
    setDescription('');
    setIsAnonymous(true);
    setReporterName('');
    setReporterContact('');
    setScreenshot('');
    setScreenshotName('');
    setSubmittedReport(null);
    setTgDeliveryError(null);
  };

  const getSafetyTips = (cat: ReportCategory) => {
    switch (cat) {
      case 'Blackmail':
        return [
          'DO NOT PAY. Paying almost always triggers further demands, not deletion.',
          'Cease all communication immediately. Do not trigger or provoke the attacker.',
          'Take screenshots of all chats, usernames, profiles, and cryptocurrency wallet addresses.',
          'Secure all your other accounts by changing passwords and enabling multi-factor auth (MFA).'
        ];
      case 'Threats':
        return [
          'If you face immediate physical danger offline, please contact local emergency authorities.',
          'Keep copies of the exact wording, social handles, timestamps, and active metadata.',
          'Lock down your social media profiles and avoid sharing location indicators.'
        ];
      case 'Harassment':
        return [
          'Block the profiles completely. Avoid the urge to reply to hate comments or direct insults.',
          'Enable profile settings that restrict tag mentions, strangers direct messages (DMs), and searches.',
          'Save all links to the harasser profiles in a secure document.'
        ];
      case 'Fake Accounts':
        return [
          'Report the fake account straight on the platform hosting it utilizing their original policy claims.',
          'Post a clear feed broadcast on your real verified channels warning others of the scam profile.',
          'Do not click any files, attachments, or links shared by the impersonating user.'
        ];
      case 'Scams/Fraud':
        return [
          'Contact your banking institution, exchange, or wallet provider immediately to block unauthorized steps.',
          'Flag phishing links, domain names, or wallet IDs in corresponding registries.',
          'Never share private seeds, mnemonic phrases, or OTP confirmation pin messages.'
        ];
      default:
        return [
          'Gather all digital logs, screenshots, and profiles related to the issue.',
          'Keep your profile settings completely private to shield yourself from unsolicited actions.',
          'Do not challenge or retaliate against malicious online coordinators.'
        ];
    }
  };

  return (
    <div id="report-section" className="space-y-6">
      <AnimatePresence mode="wait">
        {!submittedReport ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Hand: Category Choices */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md telegram-glow">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Step 1 of 3</span>
                <h3 className="text-base font-bold text-slate-100 font-display mt-1">Select Incident Category</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                  Choosing the precise category populates matching assistance templates and ensures rapid routing.
                </p>

                <div className="space-y-2">
                  {REPORT_CATEGORIES.map((catObj) => (
                    <button
                      key={catObj.category}
                      type="button"
                      onClick={() => setCategory(catObj.category)}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-start gap-3 relative overflow-hidden group ${
                        category === catObj.category
                          ? 'border-sky-500 bg-sky-950/20 shadow-[0_0_12px_rgba(56,189,248,0.08)]'
                          : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80'
                      }`}
                    >
                      {category === catObj.category && (
                        <div className="absolute top-0 right-0 w-12 h-12 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
                      )}
                      <div className={`p-1.5 rounded-lg border mt-0.5 ${
                        category === catObj.category ? 'bg-sky-500/10 border-sky-400/20 text-sky-400' : 'bg-slate-900 border-slate-800 text-slate-500 group-hover:text-slate-300'
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                          <span>{catObj.category}</span>
                          {category === catObj.category && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {catObj.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Information disclaimer info box */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 leading-relaxed">
                <div className="flex gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 font-semibold block mb-0.5">Strict Confidentiality</span>
                    We use zero-knowledge client trackers. All reports and loaded screenshots are safely saved in your local web container unless transmitted to verified support channels.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hand: Submissions Form body */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Step 2 of 3</span>
                    <h3 className="text-base font-bold text-slate-100 font-display mt-0.5">Provide Report Details</h3>
                  </div>
                  <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-medium rounded-full border border-sky-500/20">
                    Category: {category}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Anonymous reporting toggle */}
                  <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${isAnonymous ? 'bg-indigo-950/20 border-indigo-500/20 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        {isAnonymous ? <UserX className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-200 cursor-pointer" htmlFor="anon-toggle">
                          Report Anonymously
                        </label>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isAnonymous 
                            ? "Your identity fields are protected. No names or contacts will be tied." 
                            : "Provide contact handles for direct updates and follow ups."}
                        </p>
                      </div>
                    </div>
                    
                    {/* Toggle button */}
                    <button
                      type="button"
                      id="anon-toggle"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isAnonymous ? 'bg-sky-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        isAnonymous ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Reporter credentials if not anonymous */}
                  <AnimatePresence>
                    {!isAnonymous && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 overflow-hidden"
                      >
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-slate-300">
                            Your Name / Alias
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. John Doe (Optional)"
                            value={reporterName}
                            onChange={(e) => setReporterName(e.target.value)}
                            className="w-full text-xs bg-slate-950 border border-slate-850 focus:border-sky-500 focus:outline-none p-3 rounded-xl text-slate-100 placeholder-slate-600 transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-slate-300">
                            Contact Handle / Email
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. @username or email"
                            value={reporterContact}
                            onChange={(e) => setReporterContact(e.target.value)}
                            className="w-full text-xs bg-slate-950 border border-slate-850 focus:border-sky-500 focus:outline-none p-3 rounded-xl text-slate-100 placeholder-slate-600 transition-colors"
                            required={!isAnonymous}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Incident full description */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-slate-300">
                        Detailed Description of Incident <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-500">Please provide all timestamps & platforms</span>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={selectedCategoryInfo.placeholder}
                      rows={6}
                      className="w-full text-xs bg-slate-950 border border-slate-850 focus:border-sky-500 focus:outline-none p-3.5 rounded-xl text-slate-100 placeholder-slate-600 transition-colors font-sans leading-relaxed resize-y"
                      required
                    />
                  </div>

                  {/* Screenshot upload zone - Step 3 of 3 */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Step 3 of 3</span>
                        <label className="block text-xs font-medium text-slate-300 mt-0.5">
                          Attach Supporting Evidence (Screenshot / Image)
                        </label>
                      </div>
                      <span className="text-[10px] text-slate-500">Max size 5MB</span>
                    </div>

                    {!screenshot ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                          isDragging 
                            ? 'border-sky-500 bg-sky-950/20' 
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80'
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-slate-300" />
                        <p className="text-xs font-medium text-slate-300">
                          Drag & drop your screenshot here, or <span className="text-sky-400">browse file</span>
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">
                          PNG, JPG, JPEG, static logs screenshots
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                            <img 
                              src={screenshot} 
                              alt="Screenshot preview" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-300 truncate max-w-[200px] sm:max-w-[320px]">
                              {screenshotName || 'Attached_Screenshot.png'}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <FileImage className="w-3 h-3 text-emerald-400" /> Embedded Base64
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeScreenshot}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors text-slate-400 hover:text-rose-400"
                          title="Remove attached file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning and Action Buttons */}
                <div className="mt-6 pt-5 border-t border-slate-800/85 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-2.5 max-w-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0 animate-pulse"></span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      By clicking submit, you will generate a secure private Report ID that locks this query into storage. Save your ID sequence to track progression logs later.
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-sky-550/10 cursor-pointer transition-all duration-300 transform active:translate-y-px hover:shadow-sky-500/20"
                  >
                    <span>Submit Report</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Submission Success Screen overlay with interactive modals */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="max-w-2xl mx-auto bg-slate-900/80 border border-emerald-500/35 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative"
          >
            {/* Ambient emerald lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center space-y-4">
              <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-100">
                Safety Report Generated Privately!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Your case has been recorded in the secure portal. An initial checkpoint timeline has been generated for you with ID trackers.
              </p>
              
              {tgDeliveryError && (
                <div className="mt-4 p-3.5 bg-amber-950/20 border border-amber-500/25 rounded-xl text-left">
                  <span className="text-xs font-bold text-amber-400 block mb-1">⚠️ Telegram Notification Status:</span>
                  <div className="text-[10px] text-amber-300 font-mono leading-relaxed bg-black/40 p-2.5 rounded border border-amber-500/10 whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {tgDeliveryError}
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-2">
                    Please make sure your bot is started and configured in the Admin settings panel with correct token and chat ID. This warning does not affect the safety of your local submission.
                  </span>
                </div>
              )}
            </div>

            {/* Generated Ticket display card */}
            <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl relative">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">REPORT SECURITY SYSTEM</span>
                  <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                    <span className="text-sm font-mono font-bold text-slate-200 tracking-wider">
                      {submittedReport.id}
                    </span>
                    <button
                      onClick={() => handleCopyId(submittedReport.id)}
                      className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-slate-200"
                      title="Copy ID to Clipboard"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <span className="px-3 py-1 bg-sky-950/50 border border-sky-800/50 text-sky-400 text-xs rounded-lg font-mono">
                    {submittedReport.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 text-xs rounded-lg">
                    {submittedReport.status}
                  </span>
                </div>
              </div>

              {copiedId && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full shadow-lg">
                  ID Copied!
                </div>
              )}
            </div>

            {/* Crucial Type-Specific Coping Strategies */}
            <div className="mt-6 bg-slate-950/60 border border-slate-900 rounded-xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 shrink-0" /> Essential Incident Precautions:
              </h4>

              <div className="space-y-2">
                {getSafetyTips(submittedReport.category).map((tip, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs text-slate-350 leading-relaxed">
                    <CornerDownRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetFormState}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-slate-350 hover:text-slate-100 text-xs font-semibold rounded-lg"
              >
                File Another Case
              </button>

              <button
                onClick={() => onNavigateToTrack(submittedReport.id)}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white transition-colors text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 group"
              >
                <span>Track Report Status</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
