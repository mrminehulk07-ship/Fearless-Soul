import React, { useState } from 'react';
import { CONTACT_CHANNELS } from '../data';
import { ContactChannel } from '../types';
import { Send, Mail, Instagram, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ContactCard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (type: ContactChannel['type']) => {
    switch (type) {
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-400" />;
      case 'gmail':
        return <Mail className="w-5 h-5 text-rose-400" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-400" />;
    }
  };

  const getChannelStyle = (type: ContactChannel['type']) => {
    switch (type) {
      case 'telegram':
        return 'hover:border-sky-500/50 bg-sky-950/20 shadow-[0_0_15px_rgba(56,189,248,0.05)]';
      case 'gmail':
        return 'hover:border-rose-500/50 bg-rose-950/20 shadow-[0_0_15px_rgba(251,113,133,0.05)]';
      case 'instagram':
        return 'hover:border-pink-500/50 bg-pink-950/20 shadow-[0_0_15px_rgba(244,114,182,0.05)]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md telegram-glow">
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-100 font-display">Direct Secure Contacts</h3>
            <p className="text-sm text-slate-400 leading-relaxed mt-1">
              If you feel more comfortable talking live or need to send high-volume video attachments, use our audited secure direct endpoints below. All text messages, logs, and files are protected and never disclosed.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONTACT_CHANNELS.map((channel) => (
          <div
            key={channel.type}
            className={`border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${getChannelStyle(
              channel.type
            )}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
                  {getIcon(channel.type)}
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-slate-950/80 border border-slate-800 text-slate-300 rounded-full">
                  {channel.badge}
                </span>
              </div>

              <h4 className="text-base font-semibold text-slate-100 font-display">
                {channel.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {channel.description}
              </p>

              <div className="mt-4 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="truncate pr-2">{channel.username}</span>
                <button
                  onClick={() => handleCopy(channel.username, channel.type)}
                  className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-slate-200"
                  title="Copy Contact Handle"
                >
                  {copiedId === channel.type ? (
                    <Check className="w-4 h-4 text-emerald-400 animate-pulse" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/50">
              <a
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-slate-200 hover:text-white rounded-xl text-xs font-medium group"
              >
                <span>Launch {channel.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
