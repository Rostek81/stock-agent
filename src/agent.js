import cron from 'node-cron';
import { analyzeMarket } from './analyzer.js';
import { sendReportEmail } from './reportEmail.js';

export async function runAnalysisAndSendReport(config) {
  const results = await analyzeMarket(config);

  await sendReportEmail({
    smtp: config.smtp,
    from: config.mailFrom,
    to: config.reportRecipient,
    results
  });

  return results;
}

export function startBackgroundAgent(config) {
  cron.schedule(config.cron, async () => {
    console.log(`[agent] Start analizy: ${new Date().toISOString()}`);

    try {
      const results = await runAnalysisAndSendReport(config);
      console.log(`[agent] Raport wysłany. Najlepsza spółka: ${results[0]?.symbol ?? 'brak'}`);
    } catch (error) {
      console.error(`[agent] Błąd: ${error.message}`);
    }
  }, { timezone: config.timeZone });

  console.log(`[agent] Harmonogram aktywny: cron="${config.cron}", timezone="${config.timeZone}"`);
}
