import { appConfig, validateConfig } from './config.js';
import { startBackgroundAgent, runAnalysisAndPrintReport } from './agent.js';

async function bootstrap() {
  validateConfig();

  if ((process.env.RUN_ON_START ?? 'true') === 'true') {
    console.log('[agent] Wykonuję analizę startową...');
    await runAnalysisAndPrintReport(appConfig);
  }

  startBackgroundAgent(appConfig);
}

bootstrap().catch((error) => {
  console.error(`[agent] Nie udało się wystartować: ${error.message}`);
  process.exitCode = 1;
});
