import { ReportCategory, ContactChannel } from './types';

export const OWNER_INFO = {
  name: 'Fearless Soul',
  telegram: '@TakePermit',
  gmail: 'mrminehulk07@gmail.com',
  instagram: '@FearlessSoul_18457',
  about: 'ALWAYS HERE TO HELP YOU DOESN\'T MATTER WHAT',
  welcome: 'If you are facing blackmail, threats, harassment, fake accounts, scams, or any online safety issue, you can contact me through the methods below.',
  footerNote: 'All reports are reviewed privately and treated with respect.'
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    name: 'Telegram',
    username: '@TakePermit',
    value: 'Direct instant messaging support',
    type: 'telegram',
    url: 'https://t.me/TakePermit',
    description: 'Best for urgent cases. Fully encrypted chat, secret chat option, rapid response times.',
    badge: 'Fastest Response'
  },
  {
    name: 'Gmail',
    username: 'mrminehulk07@gmail.com',
    value: 'mrminehulk07@gmail.com',
    type: 'gmail',
    url: 'mailto:mrminehulk07@gmail.com?subject=URGENT%20-%20Online%20Safety%20Reporting%20Portal&body=Hello%20Fearless%20Soul,%0D%0A%0D%0AI%20am%20reaching%20out%20regarding%20an%20online%20safety%20issue.%0D%0A%0D%0ADetails:',
    description: 'Best for formal detailed inquiries, attaching complex evidence zip folders, or detailed logs.',
    badge: 'Formal Support'
  },
  {
    name: 'Instagram',
    username: '@FearlessSoul_18457',
    value: '@FearlessSoul_18457',
    type: 'instagram',
    url: 'https://instagram.com/FearlessSoul_18457',
    description: 'Direct Message option on Instagram if you prefer connecting through social media networks.',
    badge: 'Social Connect'
  }
];

export const REPORT_CATEGORIES: { category: ReportCategory; description: string; placeholder: string; icon: string }[] = [
  {
    category: 'Blackmail',
    description: 'Extortion, threats to publish private images/videos, or sensitive private information manipulation.',
    placeholder: 'Explain what images/videos they are holding, what platforms they use to threaten you, how they contacted you, and what they are demanding...',
    icon: 'Lock'
  },
  {
    category: 'Threats',
    description: 'Physical threats, acts of violence, death threats, or targeting your physical safety offline.',
    placeholder: 'Describe the messages, who is making them, what platforms are being used, and any urgent context we must know...',
    icon: 'AlertOctagon'
  },
  {
    category: 'Harassment',
    description: 'Relentless toxic messages, digital or physical stalking, doxxing, or aggressive unwanted contact.',
    placeholder: 'How long has this been going on? List usernames, platforms, contact channels, or files sent to harass you...',
    icon: 'UsersX'
  },
  {
    category: 'Fake Accounts',
    description: 'Identity theft, profiles pretending to be you to scam others, or posting leaking media under your name.',
    placeholder: 'Please supply a link to the fake account, links/names of your real accounts, screenshots of their activity, or any scamming messages...',
    icon: 'UserX'
  },
  {
    category: 'Scams/Fraud',
    description: 'Phishing schemes, fake tokens, money extortion, telegram pump-and-dumps, or general deceit.',
    placeholder: 'What did they steal or try to steal? What wallets, websites, usernames, or channels were used to conduct the fraud...',
    icon: 'FileWarning'
  },
  {
    category: 'Cyberbullying',
    description: 'Public mocking, malicious threads, targeted offensive campaigns, or hate speech raids.',
    placeholder: 'Where is the bullying taking place? Who are the main culprits and which groups, servers, or chats are hosting it...',
    icon: 'MessageSquareX'
  },
  {
    category: 'Other',
    description: 'Any other safety concerns, digital forensics, reverse lookup requests, or unlisted digital safety issues.',
    placeholder: 'Provide a complete comprehensive summary of the digital or real-world safety issue you are battling...',
    icon: 'HelpCircle'
  }
];
