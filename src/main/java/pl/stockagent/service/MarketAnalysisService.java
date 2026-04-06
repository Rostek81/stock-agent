package pl.stockagent.service;

import org.springframework.stereotype.Service;
import pl.stockagent.config.AgentProperties;
import pl.stockagent.model.DailyQuote;
import pl.stockagent.model.StockRecommendation;
import pl.stockagent.provider.NasdaqDataProvider;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

@Service
public class MarketAnalysisService {

    private final NasdaqDataProvider dataProvider;
    private final AgentProperties properties;

    public MarketAnalysisService(NasdaqDataProvider dataProvider, AgentProperties properties) {
        this.dataProvider = dataProvider;
        this.properties = properties;
    }

    public List<StockRecommendation> analyze() {
        return properties.symbols().stream()
                .map(this::analyzeSymbol)
                .sorted(Comparator.comparingDouble(StockRecommendation::score).reversed())
                .toList();
    }

    private StockRecommendation analyzeSymbol(String symbol) {
        List<DailyQuote> quotes = dataProvider.getDailyQuotes(symbol, properties.analysisLookbackDays());
        if (quotes.size() < 20) {
            return new StockRecommendation(symbol, 0, "BRAK DANYCH", "Za mało danych historycznych");
        }

        DailyQuote latest = quotes.getFirst();
        BigDecimal avgClose5 = averageClose(quotes, 5);
        BigDecimal avgClose20 = averageClose(quotes, 20);
        BigDecimal avgVolume20 = averageVolume(quotes, 20);

        double trendScore = avgClose5.compareTo(avgClose20) > 0 ? 1.5 : 0;
        double momentumScore = latest.close().compareTo(avgClose5) > 0 ? 1 : 0;
        double volumeScore = latest.volume().compareTo(avgVolume20) > 0 ? 1 : 0;
        double liquidityScore = latest.volume().compareTo(properties.minDailyVolume()) >= 0 ? 1 : -1;

        double score = trendScore + momentumScore + volumeScore + liquidityScore;
        String decision = score >= properties.minScoreToRecommend() ? "KUP" : "OBSERWUJ";

        String explanation = "Cena vs SMA5/SMA20: " + latest.close() + "/" + avgClose5 + "/" + avgClose20
                + ", Wolumen: " + latest.volume() + " (avg20: " + avgVolume20 + ")";

        return new StockRecommendation(symbol, round(score), decision, explanation);
    }

    private BigDecimal averageClose(List<DailyQuote> quotes, int days) {
        return quotes.stream()
                .limit(days)
                .map(DailyQuote::close)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(days), 4, RoundingMode.HALF_UP);
    }

    private BigDecimal averageVolume(List<DailyQuote> quotes, int days) {
        return quotes.stream()
                .limit(days)
                .map(DailyQuote::volume)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
