import { Report } from './types';

// Hardcode your default credentials here if you are deploying to Netlify
// so that any visitor's submitted reports automatically reach you!
export const DEFAULT_TELEGRAM_CONFIG = {
  botToken: '8388429349:AAEs_ncNI376E6_XCFTpPOIonaCsAc1w41U', // e.g. '123456789:ABCdefGhI_...'
  chatId: '8711559607',   // e.g. '987654321' or '@YourGroupChannel'
};

const STORAGE_TOKEN_KEY = 'fearless_tg_token';
const STORAGE_CHAT_ID_KEY = 'fearless_tg_chat_id';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export const getTelegramConfig = (): TelegramConfig => {
  if (typeof window === 'undefined') {
    return { botToken: '', chatId: '' };
  }

  let storedToken = (localStorage.getItem(STORAGE_TOKEN_KEY) || '').trim();
  let storedChatId = (localStorage.getItem(STORAGE_CHAT_ID_KEY) || '').trim();

  // Safeguard against legacy corruption or 'null'/'undefined' string states
  if (storedToken === 'undefined' || storedToken === 'null') storedToken = '';
  if (storedChatId === 'undefined' || storedChatId === 'null') storedChatId = '';

  // If storedChatId is the old wrong Chat ID, clear it to let the new default take effect
  if (storedChatId === '8388429349') {
    storedChatId = '';
    localStorage.removeItem(STORAGE_CHAT_ID_KEY);
  }

  let envToken = '';
  let envChatId = '';
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      envToken = (metaEnv.VITE_TELEGRAM_BOT_TOKEN || '').trim();
      envChatId = (metaEnv.VITE_TELEGRAM_CHAT_ID || '').trim();
    }
  } catch (err) {
    // Fail silently if environments cannot be resolved
  }

  const finalConfig = {
    botToken: storedToken || envToken || DEFAULT_TELEGRAM_CONFIG.botToken || '',
    chatId: storedChatId || envChatId || DEFAULT_TELEGRAM_CONFIG.chatId || '',
  };

  // Mask sensitive token for diagnostics
  const maskedToken = finalConfig.botToken 
    ? `${finalConfig.botToken.slice(0, 8)}...${finalConfig.botToken.slice(-6)}` 
    : 'Not configured';
  console.log('🔮 SafeLine - Loaded Telegram Config:', { botToken: maskedToken, chatId: finalConfig.chatId });

  return finalConfig;
};

export const saveTelegramConfig = (botToken: string, chatId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_TOKEN_KEY, botToken.trim());
    localStorage.setItem(STORAGE_CHAT_ID_KEY, chatId.trim());
  }
};

export const clearTelegramConfig = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_CHAT_ID_KEY);
  }
};

const escapeHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Sends a high-contrast formatted HTML report to your Telegram Bot
 * Using HTML avoids parsing failures due to special Markdown characters in user-submitted descriptions.
 */
export const sendTelegramNotification = async (report: Report): Promise<boolean> => {
  const config = getTelegramConfig();
  if (!config.botToken || !config.chatId) {
    throw new Error('Telegram Bot Token and Chat ID are not configured. Please supply valid properties.');
  }

  const dateStr = new Date(report.createdAt).toLocaleString();
  
  const escapedId = escapeHtml(report.id);
  const escapedCategory = escapeHtml(report.category);
  const escapedStatus = escapeHtml(report.status);
  const escapedType = report.isAnonymous ? '👤 Anonymous Submission' : '🔒 Protected User';
  const escapedReporterName = report.reporterName ? escapeHtml(report.reporterName) : 'Anonymous';
  const escapedReporterContact = report.reporterContact ? escapeHtml(report.reporterContact) : 'Not provided';
  const escapedDescription = escapeHtml(report.description);
  const escapedDate = escapeHtml(dateStr);
  const escapedOrigin = escapeHtml(window.location.origin);

  // Format report data beautifully in HTML
  // Note: All supporting inline links are escaped for attributes
  const escapedOriginAttr = escapedOrigin.replace(/"/g, '&quot;');
  const text = `🚨 <b>NEW INCIDENT REPORT PORTAL RECEIVED</b> 🚨

<b>ID Tracker:</b> <code>${escapedId}</code>
<b>Category:</b> <b>${escapedCategory}</b>
<b>Status:</b> ${escapedStatus}
<b>Type:</b> ${escapedType}

${!report.isAnonymous ? `<b>Reporter Name:</b> ${escapedReporterName}\n<b>Contact Endpoint:</b> ${escapedReporterContact}\n` : ''}
<b>Incident Details Description:</b>
<pre>${escapedDescription}</pre>

📅 <b>Timestamp:</b> ${escapedDate}
🔗 <b>Portal Link:</b> <a href="${escapedOriginAttr}">Track Case</a>
`;

  try {
    // 1. Send the primary text report
    const textUrl = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const textRes = await fetch(textUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!textRes.ok) {
      const errText = await textRes.text();
      console.error('Failed to send Telegram message:', errText);
      throw new Error(`Telegram API sendMessage Error: ${errText}`);
    }

    // 2. Send the image/screenshot if one is attached
    if (report.screenshot) {
      try {
        const photoUrl = `https://api.telegram.org/bot${config.botToken}/sendPhoto`;
        
        // Convert the base64 string back to binary Blob to send as solid file
        // This is done directly using synchronous binary buffers to avoid CORS iframe issues
        const parts = report.screenshot.split(';base64,');
        if (parts.length === 2) {
          const contentType = parts[0].split(':')[1];
          const raw = window.atob(parts[1]);
          const rawLength = raw.length;
          const uInt8Array = new Uint8Array(rawLength);
          for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          const blob = new Blob([uInt8Array], { type: contentType });
          
          const formData = new FormData();
          formData.append('chat_id', config.chatId);
          formData.append('photo', blob, report.screenshotName || 'screenshot.png');
          formData.append('caption', `📷 Supporting Screenshot Evidence for Report ID: <code>${escapedId}</code>`);
          formData.append('parse_mode', 'HTML');

          const photoRes = await fetch(photoUrl, {
            method: 'POST',
            body: formData,
          });

          if (!photoRes.ok) {
            const photoErrText = await photoRes.text();
            console.warn('Sent text report but screenshot failed to load:', photoErrText);
          }
        }
      } catch (screenshotError) {
        console.error('Error uploading base64 screenshot to Telegram:', screenshotError);
      }
    }

    return true;
  } catch (err: any) {
    console.error('Error sending Telegram API update Request:', err);
    throw err;
  }
};

/**
 * Sends a fast test ping to verify values are 100% operational
 */
export const sendTelegramTestPing = async (token: string, chatId: string): Promise<{ success: boolean; message: string }> => {
  if (!token || !chatId) {
    return { success: false, message: 'Please input both your Telegram Bot Token and Chat ID.' };
  }

  const text = `⚙️ *PORTAL TEST NOTIFICATION* ⚙️\n\nYour Safe Line Telegram Integration is *100% Operational*!\nIncoming safety reports will appear here in real-time.`;
  
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (res.ok) {
      return { success: true, message: 'Test message sent successfully! Check your Telegram Chat.' };
    } else {
      const errText = await res.text();
      return { success: false, message: `Telegram Error: ${errText}` };
    }
  } catch (err) {
    return { success: false, message: `Fetch Error: ${(err as Error).message}` };
  }
};
