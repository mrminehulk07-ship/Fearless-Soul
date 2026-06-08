export type ReportCategory =
  | 'Blackmail'
  | 'Threats'
  | 'Harassment'
  | 'Fake Accounts'
  | 'Scams/Fraud'
  | 'Cyberbullying'
  | 'Other';

export type ReportStatus = 'Submitted' | 'Under Review' | 'Investigating' | 'Resolved' | 'Archived';

export interface ReportTimelineEntry {
  status: ReportStatus;
  note: string;
  timestamp: string;
}

export interface Report {
  id: string;
  category: ReportCategory;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string; // telegram username, email, etc.
  description: string;
  screenshot?: string; // base64 string
  screenshotName?: string;
  status: ReportStatus;
  createdAt: string;
  timeline: ReportTimelineEntry[];
  privateNotes?: string;
}

export interface ContactChannel {
  name: string;
  username: string;
  value: string;
  type: 'gmail' | 'telegram' | 'instagram';
  url: string;
  description: string;
  badge: string;
}
