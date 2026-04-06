package pl.stockagent.provider;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import pl.stockagent.model.DailyQuote;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Component
public class StooqNasdaqDataProvider implements NasdaqDataProvider {

    private final WebClient webClient;

    public StooqNasdaqDataProvider(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://stooq.com").build();
    }

    @Override
    public List<DailyQuote> getDailyQuotes(String symbol, int lookbackDays) {
        String response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/q/d/l/")
                        .queryParam("s", symbol.toLowerCase() + ".us")
                        .queryParam("i", "d")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isBlank()) {
            return List.of();
        }

        return Arrays.stream(response.split("\\n"))
                .skip(1)
                .map(line -> line.split(","))
                .filter(row -> row.length == 6)
                .map(row -> new DailyQuote(
                        symbol,
                        LocalDate.parse(row[0]),
                        new BigDecimal(row[1]),
                        new BigDecimal(row[2]),
                        new BigDecimal(row[3]),
                        new BigDecimal(row[4]),
                        new BigDecimal(row[5])
                ))
                .sorted(Comparator.comparing(DailyQuote::date).reversed())
                .limit(lookbackDays)
                .toList();
    }
}
