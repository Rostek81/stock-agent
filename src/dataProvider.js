const STOOQ_BASE_URL = 'https://stooq.com/q/d/l/';

function parseCsvRow(symbol, row) {
  const [date, open, high, low, close, volume] = row.split(',');
  if (!date || !open || !high || !low || !close || !volume) {
    return null;
  }

  return {
    symbol,
    date,
    open: Number(open),
    high: Number(high),
    low: Number(low),
    close: Number(close),
    volume: Number(volume)
  };
}

export async function getDailyQuotes(symbol, lookbackDays) {
  const stooqSymbol = `${symbol.toLowerCase()}.us`;
  const url = `${STOOQ_BASE_URL}?s=${encodeURIComponent(stooqSymbol)}&i=d`;

  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`Stooq zwrócił status ${response.status} dla ${symbol}`);
  }

  const csv = await response.text();
  if (!csv?.trim()) return [];

  return csv
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => parseCsvRow(symbol, line))
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, lookbackDays);
}
