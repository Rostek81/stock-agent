import { getDailyQuotes } from './dataProvider.js';

function average(values) {
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function scoreSymbol(quotes, minDailyVolume, minScoreToRecommend) {
  if (quotes.length < 20) {
    return {
      score: 0,
      decision: 'BRAK DANYCH',
      explanation: 'Za mało danych historycznych (minimum 20 sesji).'
    };
  }

  const latest = quotes[0];
  const closes5 = quotes.slice(0, 5).map((q) => q.close);
  const closes20 = quotes.slice(0, 20).map((q) => q.close);
  const volumes20 = quotes.slice(0, 20).map((q) => q.volume);

  const avgClose5 = average(closes5);
  const avgClose20 = average(closes20);
  const avgVolume20 = average(volumes20);

  const trendScore = avgClose5 > avgClose20 ? 1.5 : 0;
  const momentumScore = latest.close > avgClose5 ? 1 : 0;
  const volumeScore = latest.volume > avgVolume20 ? 1 : 0;
  const liquidityScore = latest.volume >= minDailyVolume ? 1 : -1;

  const score = Number((trendScore + momentumScore + volumeScore + liquidityScore).toFixed(2));
  const decision = score >= minScoreToRecommend ? 'KUP' : 'OBSERWUJ';

  return {
    score,
    decision,
    explanation: `Cena=${latest.close}, SMA5=${avgClose5.toFixed(2)}, SMA20=${avgClose20.toFixed(2)}, wolumen=${latest.volume}, avgVol20=${avgVolume20.toFixed(0)}`
  };
}

export async function analyzeMarket({ symbols, analysisLookbackDays, minDailyVolume, minScoreToRecommend }) {
  const results = await Promise.all(symbols.map(async (symbol) => {
    try {
      const quotes = await getDailyQuotes(symbol, analysisLookbackDays);
      const analysis = scoreSymbol(quotes, minDailyVolume, minScoreToRecommend);

      return {
        symbol,
        ...analysis
      };
    } catch (error) {
      return {
        symbol,
        score: 0,
        decision: 'BŁĄD',
        explanation: `Nie udało się pobrać danych: ${error.message}`
      };
    }
  }));

  return results.sort((a, b) => b.score - a.score);
}
