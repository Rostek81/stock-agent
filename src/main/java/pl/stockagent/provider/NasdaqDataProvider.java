package pl.stockagent.provider;

import pl.stockagent.model.DailyQuote;

import java.util.List;

public interface NasdaqDataProvider {
    List<DailyQuote> getDailyQuotes(String symbol, int lookbackDays);
}
