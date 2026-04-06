import process from 'node:process';
import { config as loadEnv } from 'dotenv';

loadEnv();

const parseSymbols = (raw) => raw.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);

export const appConfig = {
  cron: process.env.AGENT_CRON ?? '0 14 * * 1-5',
  timeZone: process.env.AGENT_TIMEZONE ?? 'Europe/Warsaw',
  reportRecipient: process.env.REPORT_RECIPIENT ?? '',
  mailFrom: process.env.MAIL_FROM ?? process.env.MAIL_USER ?? '',
  symbols: parseSymbols(process.env.AGENT_SYMBOLS ?? 'AAPL,MSFT,NVDA,AMZN,META,TSLA'),
  minDailyVolume: Number(process.env.MIN_DAILY_VOLUME ?? 1_000_000),
  analysisLookbackDays: Number(process.env.ANALYSIS_LOOKBACK_DAYS ?? 30),
  minScoreToRecommend: Number(process.env.MIN_SCORE_TO_RECOMMEND ?? 2),
  smtp: {
    host: process.env.MAIL_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT ?? 587),
    secure: (process.env.MAIL_SECURE ?? 'false') === 'true',
    user: process.env.MAIL_USER ?? '',
    pass: process.env.MAIL_PASS ?? ''
  }
};

export function validateConfig() {
  const errors = [];

  if (!appConfig.reportRecipient) errors.push('Brak REPORT_RECIPIENT.');
  if (!appConfig.mailFrom) errors.push('Brak MAIL_FROM lub MAIL_USER.');
  if (!appConfig.smtp.user || !appConfig.smtp.pass) errors.push('Brak MAIL_USER / MAIL_PASS.');
  if (appConfig.symbols.length === 0) errors.push('Lista AGENT_SYMBOLS jest pusta.');

  if (errors.length > 0) {
    throw new Error(`Błąd konfiguracji:\n- ${errors.join('\n- ')}`);
  }
}
