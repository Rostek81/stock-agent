function buildReportText(results) {
  const date = new Date().toISOString().slice(0, 10);
  const header = `Dzienny raport NASDAQ (${date})`;

  const lines = results.map((result) => (
    `${result.symbol} | decyzja: ${result.decision} | score: ${result.score}\nPowód: ${result.explanation}`
  ));

  return `${header}\n\n${lines.join('\n\n')}\n`;
}

export function printReport(results) {
  const report = buildReportText(results);
  console.log('\n========== RAPORT ==========' );
  console.log(report);
  console.log('======== KONIEC RAPORTU ========\n');
}
