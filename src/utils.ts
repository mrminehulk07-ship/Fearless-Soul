import { Report } from './types';

const STORAGE_KEY = 'fearless_reports_db';

const SEED_REPORTS: Report[] = [
  {
    id: 'REP-482937-S',
    category: 'Scams/Fraud',
    isAnonymous: false,
    reporterName: 'Alex Mercer',
    reporterContact: '@alex_m',
    description: 'Fake Telegram channel mimicking "Fearless Soul" trying to solicit premium recovery fees. The fake account is using username @TakePermit_RealScam.',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'Submitted',
        note: 'Report received securely via portal.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      },
      {
        status: 'Under Review',
        note: 'Analyzing fake username history and cross-checking IP/ID markers.',
        timestamp: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString()
      },
      {
        status: 'Investigating',
        note: 'Submitted official trademark/impersonation claim directly to Telegram Trust & Safety. Reached out to threat database pools.',
        timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString()
      },
      {
        status: 'Resolved',
        note: 'Telegram suspended the impersonator channel. The scam operator is flagged.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    privateNotes: 'Alex verified on chat that the scammer can no longer be messaged and the fake channel link points to deactivated room. Closed. Excellent outcome.'
  },
  {
    id: 'REP-910283-B',
    category: 'Blackmail',
    isAnonymous: true,
    description: 'A blackmailer has obtained ancient chat logs and is threatening exposure unless I transfer crypto tokens. They started contacts via Instagram and Discord.',
    status: 'Investigating',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'Submitted',
        note: 'Anonymous safety report generated.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        status: 'Under Review',
        note: 'Reviewing active threat vectors. Assessed safety risks and structured a security guard block.',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
      },
      {
        status: 'Investigating',
        note: 'Helping report the blackmailer\'s profiles on Instagram and setting up standard reverse lookup profiles on key email addresses provided.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    privateNotes: 'Threat level moderated. Instructed target on stealth social profile blocking settings. Tracing fake Instagram account email handle.'
  }
];

export const getStoredReports = (): Report[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS));
    return SEED_REPORTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_REPORTS;
  }
};

export const saveStoredReports = (reports: Report[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }
};

export const getReportById = (id: string): Report | undefined => {
  const reports = getStoredReports();
  return reports.find(r => r.id.trim().toUpperCase() === id.trim().toUpperCase());
};

export const createReport = (reportData: Omit<Report, 'id' | 'status' | 'createdAt' | 'timeline'>): Report => {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const code = reportData.category.slice(0, 1).toUpperCase();
  const id = `REP-${randNum}-${code}`;
  
  const newReport: Report = {
    ...reportData,
    id,
    status: 'Submitted',
    createdAt: new Date().toISOString(),
    timeline: [
      {
        status: 'Submitted',
        note: 'Report submitted successfully. Standing by for Fearless Soul to begin evaluation.',
        timestamp: new Date().toISOString()
      }
    ]
  };

  const current = getStoredReports();
  const updated = [newReport, ...current];
  saveStoredReports(updated);
  return newReport;
};

export const updateReportStatus = (id: string, newStatus: Report['status'], updaterNote: string, privateNotes?: string): Report | null => {
  const current = getStoredReports();
  let updatedReport: Report | null = null;

  const next = current.map(r => {
    if (r.id === id) {
      const isStatusChanged = r.status !== newStatus;
      
      const updatedTimeline = [...r.timeline];
      if (isStatusChanged || updaterNote) {
        updatedTimeline.push({
          status: newStatus,
          note: updaterNote || `Status updated to ${newStatus}`,
          timestamp: new Date().toISOString()
        });
      }

      updatedReport = {
        ...r,
        status: newStatus,
        timeline: updatedTimeline,
        privateNotes: privateNotes !== undefined ? privateNotes : r.privateNotes
      };
      
      return updatedReport;
    }
    return r;
  });

  if (updatedReport) {
    saveStoredReports(next);
  }
  return updatedReport;
};

export const deleteReport = (id: string): void => {
  const current = getStoredReports();
  const next = current.filter(r => r.id !== id);
  saveStoredReports(next);
};
