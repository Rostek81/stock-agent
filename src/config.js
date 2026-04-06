import process from 'node:process';
import { config as loadEnv } from 'dotenv';

loadEnv();

const parseSymbols = (raw) => raw.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);

export const appConfig = {
  cron: process.env.AGENT_CRON ?? '0 14 * * 1-5',
  timeZone: process.env.AGENT_TIMEZONE ?? 'Europe/Warsaw',
  symbols: parseSymbols(process.env.AGENT_SYMBOLS ?? 'AAPL,MSFT,NVDA,AMZN,META,TSLA'),
  minDailyVolume: Number(process.env.MIN_DAILY_VOLUME ?? 1_000_000),
  analysisLookbackDays: Number(process.env.ANALYSIS_LOOKBACK_DAYS ?? 30),
  minScoreToRecommend: Number(process.env.MIN_SCORE_TO_RECOMMEND ?? 2)
};

export function validateConfig() {
  const errors = [];
  if (appConfig.symbols.length === 0) errors.push('Lista AGENT_SYMBOLS jest pusta.');

  if (errors.length > 0) {
    throw new Error(`Błąd konfiguracji:\n- ${errors.join('\n- ')}`);
  }
}
