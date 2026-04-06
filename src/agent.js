import cron from 'node-cron';
import { analyzeMarket } from './analyzer.js';
import { printReport } from './reportConsole.js';

export async function runAnalysisAndPrintReport(config) {
  const results = await analyzeMarket(config);
  printReport(results);
  return results;
}

export function startBackgroundAgent(config) {
  cron.schedule(config.cron, async () => {
    console.log(`[agent] Start analizy: ${new Date().toISOString()}`);

    try {
      const results = await runAnalysisAndPrintReport(config);
      console.log(`[agent] Raport wygenerowany. Najlepsza spółka: ${results[0]?.symbol ?? 'brak'}`);
    } catch (error) {
      console.error(`[agent] Błąd: ${error.message}`);
    }
  }, { timezone: config.timeZone });

  console.log(`[agent] Harmonogram aktywny: cron="${config.cron}", timezone="${config.timeZone}"`);
}
