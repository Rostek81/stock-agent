package pl.stockagent.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyQuote(
        String symbol,
        LocalDate date,
        BigDecimal open,
        BigDecimal high,
        BigDecimal low,
        BigDecimal close,
        BigDecimal volume
) {
}
